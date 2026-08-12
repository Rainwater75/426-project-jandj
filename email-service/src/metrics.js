// metrics.js
import client from "prom-client";

// copied from unit 18

// A counter: total HTTP requests served, sliced by method, route, and status
// code. Counters only ever increase.
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests received",
  labelNames: ["method", "route", "status_code"],
});

// A histogram: request latency in seconds, bucketed so a query can recover a p95
// later. Buckets are concentrated where real latencies land, 10 ms to 1 s.
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

export const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const labels = { method: req.method, route: req.path, status_code: res.statusCode };
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);
  });
  next();
};


// The scrape target: render every registered metric in Prometheus's plaintext
// exposition format for Prometheus to collect.
export const metricsEndpoint = async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};