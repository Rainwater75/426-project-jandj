# Scripted Failure Scenario

## liaison-service

### 1. Description of the Failure Scenario
You can force an error with the `liaison-service` at the `POST /liaison/contact` endpoint.
*   **fail mode:** Simulates an immediate breakdown by skipping the real work and forcing the service to return a `503 Service Unavailable` error.
*   **slow mode:** Simulates high resource use or network problems by simulating a higher than normal latency spike (`4000ms`) before the service processes requests.

### 2. How to Trigger It

```bash
   $env:FAILURE_MODE="fail"
   docker compose up --build

   $env:FAILURE_MODE="slow"
   docker compose up --build

curl -X POST http://localhost:8080/liaison/contact \
  -H "Content-Type: application/json" \
  -d '{"assigneeId": "assignee-01", "tenantAssociationId": "ta-123", "message": "Intent to file TOPA notice."}'
```

### 3. How to Clear It
```bash
   $env:FAILURE_MODE="none"
```

### 4. How the System Responds and Comparison to Real World
The failure kills the work process immediately and an error is returned. A real system would probably retry the process at least once before returning failure to the user since contact is an externally facing service that in practicality has a higher chance of failure.


## association-service

### 1. Description of the Failure Scenario
You can force simulated response timeouts in both the `redis` cache and the simulated database that `association-service` makes use of.
*   **LIVE_CACHE_DOWN:** Simulates that the `redis` cache has become unreachable after a healthy startup.
*   **LIVE_DATABASE_DOWN:** Simulates that the database has become unreachable after a healthy startup.
*


### 2. How to trigger it

1. Set the environment variable `FAILURE_MODE` for the `association-0` (or `association-1`) container as one of the following options:
   * `FAILURE_MODE=LIVE_CACHE_DOWN` - simulates cache as unreachable
   * `FAILURE_MODE=LIVE_DATABASE_DOWN` - simulated database as unreachable
2. Build and run the association-service and or entire compose project: `docker compose up --build -d`
3. Hit the endpoints as usual or through the caddy load balancer (if it was started as well). For example, if association-0 is the target:
   * `curl http://localhost:4000/get_user?user_id=1` (endpoint through tunnel)
   * `curl http://localhost:3999/get_user?user_id=1` (caddy loadbalancer path)


### 3. How to clear it.

Clear the environment variable `FAILURE_MODE` then rebuild the container.

### 4. How the System Responds and Comparison to Real World

* in the case of **LIVE_CACHE_DOWN:**, upon timing out, `association-service` catches the timeout error and then resorts to querying the database.
* in the case of **LIVE_DATABASE_DOWN**, upon timing out, `association-service` catches the error, flips a flag `healthy` to `false`, then returns a `status 500` error response. From then afterward, `Caddy` will not forward requests to that service because it will read as unhealthy.

In the real world, healing mechanisms should be put in place in an attempt to reconnect. A finite retry loop with an exponentially increasing backoff timer could run `FAILURE_RETRY` times. A successful reconnection would resume use of the `redis` cache seamlessly. A successful reconnection to the database would flip the `healthy` flag, then Caddy could resume forwarding jobs to that replica of `association-service`.
