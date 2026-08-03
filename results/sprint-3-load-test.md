## association-service load test of get_TA and get_user endpoints



            /\      Grafana   /‾‾/
       /\  /  \     |\  __   /  /
      /  \/    \    | |/ /  /   ‾‾\
     /          \   |   (  |  (‾)  |
    / __________ \  |_|\_\  \_____/


     execution: local
        script: sprint-3-load.js
        output: -

     scenarios: (100.00%) 2 scenarios, 20 max VUs, 1m0s max duration (incl. graceful stop):
              * getAssociation: 10 looping VUs for 30s (exec: getAssociation, gracefulStop: 30s)
              * getUser: 10 looping VUs for 30s (exec: getUser, gracefulStop: 30s)



    THRESHOLDS

    http_req_duration{scenario:getAssociation}
    ✓ 'p(95)<10000' p(95)=4.46ms

    http_req_duration{scenario:getUser}
    ✓ 'p(95)<10000' p(95)=4.67ms

    http_req_failed{scenario:getAssociation}
    ✓ 'rate<0.01' rate=0.00%

    http_req_failed{scenario:getUser}
    ✓ 'rate<0.01' rate=0.00%


    TOTAL RESULTS

    HTTP
    http_req_duration...............: avg=2.17ms  min=494.17µs med=1.24ms  max=307.25ms p(90)=3.58ms p(95)=4.55ms
      { expected_response:true }....: avg=2.17ms  min=494.17µs med=1.24ms  max=307.25ms p(90)=3.58ms p(95)=4.55ms
      { scenario:getAssociation }...: avg=2.24ms  min=494.17µs med=1.26ms  max=307.25ms p(90)=3.49ms p(95)=4.46ms
      { scenario:getUser }..........: avg=2.09ms  min=560.47µs med=1.23ms  max=207.9ms  p(90)=3.64ms p(95)=4.67ms
    http_req_failed.................: 0.00%  0 out of 11380
      { scenario:getAssociation }...: 0.00%  0 out of 5680
      { scenario:getUser }..........: 0.00%  0 out of 5700
    http_reqs.......................: 11380  378.786839/s

    EXECUTION
    iteration_duration..............: avg=52.76ms min=50.66ms  med=51.94ms max=359.97ms p(90)=54.2ms p(95)=55.27ms
    iterations......................: 11380  378.786839/s
    vus.............................: 20     min=20         max=20
    vus_max.........................: 20     min=20         max=20

    NETWORK
    data_received...................: 12 MB  400 kB/s
    data_sent.......................: 979 kB 33 kB/s


### get_TA
- reliability: stated SLO seeks $success > 99.0%$. Load test shows reliability of 100%.
- latency: stated SLO seeks approximate latency of P99: 5-10s P95: 1s - 3s, P50: ~100ms with $max < 10s$. Load test shows $P95 \approx 5ms$ and $max \approx 308ms$

### get_user
  - reliability: stated SLO seeks $success > 99.0%$. Load test shows reliability of 100%.
  - latency: stated SLO seeks approximate latency of P99: 5-10s P95: 1s - 3s, P50: ~100ms with $max < 10s$. Load test shows $P95 \approx 5ms$ and $max \approx 208ms$


Summary: in their current states, the get_user and get_TA endpoints of association-service exceed their latency and reliability SLOs. Simulated SQLite database reads are simulated as 200ms and 300ms delays respectively. The large difference between $max$ and $P95$ can be attributed to the redis cache being hit for every subsequent read after the first; the request only simulates a read over one record. This is a limitation of this simulation and latency/reliability metrics will likely change once the user database is implemented. Still, this load test shows cache-hit performance to far exceed what is necessary for stated SLOs.
