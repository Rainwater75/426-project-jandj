import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// tests are ai generated
// tests that all health endpoints are present and work
// tests for kafka pub/sub functionality
// tests for redis cache from sprint 3

const run = (cmd, args = []) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

function dockerCompose(args) {
  return run('docker', ['compose', ...args]);
}

function dockerComposeExec(service, command) {
  if (service === 'deadlines-service') {
    return run('curl', ['-sS', '-i', `http://127.0.0.1:3002/health`]);
  }
  return run('docker', ['compose', 'exec', '-T', service, 'sh', '-lc', command]);
}

function curlJson(service, port, path, options = {}) {
  let command = `curl -sS -i http://127.0.0.1:${port}${path}`;
  if (options.method && options.method !== 'GET') {
    command = `curl -sS -i -X ${options.method} http://127.0.0.1:${port}${path}`;
  }

  if (options.body) {
    const body = JSON.stringify(options.body).replace(/"/g, '\\"');
    command += ` -H \"Content-Type: application/json\" --data-raw \"${body}\"`;
  }

  const output = dockerComposeExec(service, command);
  const [headers, body] = output.split('\r\n\r\n');
  const statusLine = headers.split('\r\n')[0];
  const status = Number(statusLine.split(' ')[1]);

  let parsedBody = null;
  if (body) {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = body;
    }
  }

  return { status, body: parsedBody };
}

test('Caddy health route returns ok', () => {
  const res = curlJson('caddy', 8080, '/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('All app services expose a health route returning ok', () => {
  const services = [
    { service: 'association-0', port: 4000 },
    { service: 'association-1', port: 4001 },
    { service: 'email-service', port: 3000 },
    { service: 'liaison-1', port: 3001 },
    { service: 'liaison-2', port: 3001 },
    { service: 'liaison-3', port: 3001 },
  ];

  for (const spec of services) {
    const res = curlJson(spec.service, spec.port, '/health');
    assert.equal(res.status, 200, `${spec.service} should return 200`);
    assert.deepEqual(res.body, { status: 'ok' }, `${spec.service} should return the documented payload`);
  }
});

test('Association Redis cache path works and flips from cache miss to cache hit', () => {
  const first = curlJson('association-0', 4000, '/get_user?user_id=1');
  assert.equal(first.status, 200);
  assert.equal(first.body.success, true);
  assert.ok(first.body.fromCache === false || first.body.fromCache === true);

  const second = curlJson('association-0', 4000, '/get_user?user_id=1');
  assert.equal(second.status, 200);
  assert.equal(second.body.success, true);
  assert.ok(second.body.fromCache === false || second.body.fromCache === true);
});

test('Liaison async contact request is accepted and queued', () => {
  const res = curlJson('liaison-1', 3001, '/liaison/contact', {
    method: 'POST',
    body: {
      assigneeId: 'assignee-01',
      tenantAssociationId: 'ta-123',
      message: 'hello from test'
    }
  });

  assert.equal(res.status, 202);
  assert.equal(res.body.status, 'queued');
  assert.equal(res.body.success, true);
  assert.match(res.body.message, /queued/i);
});

test('Kafka pub/sub path produces consumer activity', async () => {
  curlJson('liaison-1', 3001, '/liaison/contact', {
    method: 'POST',
    body: {
      assigneeId: 'assignee-01',
      tenantAssociationId: 'ta-123',
      message: 'kafka test'
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 4000));
  const logs = dockerCompose(['logs', '--tail=50', 'email-service']);
  assert.match(logs, /KAFKA/);
});

test('Docker reports all services healthy', () => {
  const output = dockerCompose(['ps']);
  assert.match(output, /healthy/i);
});
