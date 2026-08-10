# Scripted Failure Scenario 

## 1. Description of the Failure Scenario
You can force an error with the `liaison-service` at the `POST /liaison/contact` endpoint.
*   **fail mode:** Simulates an immediate breakdown by skipping the real work and forcing the service to return a `503 Service Unavailable` error.
*   **slow mode:** Simulates high resource use or network problems by simulating a higher than normal latency spike (`4000ms`) before the service processes requests.

## 2. How to Trigger It

```bash
   $env:FAILURE_MODE="fail"
   docker compose up --build

   $env:FAILURE_MODE="slow"
   docker compose up --build

curl -X POST http://localhost:8080/liaison/contact \
  -H "Content-Type: application/json" \
  -d '{"assigneeId": "assignee-01", "tenantAssociationId": "ta-123", "message": "Intent to file TOPA notice."}'
```

## 3. How to Clear It
```bash
   $env:FAILURE_MODE="none"
```

## 4. How the System Responds and Comparison to Real World
The failure kills the work process immediately and an error is returned. A real system would probably retry the process at least once before returning failure to the user since contact is an externally facing service that in practicality has a higher chance of failure. 