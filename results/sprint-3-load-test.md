## association-service, liason-service load test of get_TA and get_user endpoints


            /\      Grafana   /‾‾/
       /\  /  \     |\  __   /  /
      /  \/    \    | |/ /  /   ‾‾\
     /          \   |   (  |  (‾)  |
    / __________ \  |_|\_\  \_____/


     execution: local
        script: sprint-3-load.js
        output: -

     scenarios: (100.00%) 3 scenarios, 40 max VUs, 1m0s max duration (incl. graceful stop):
              * getAssociation: 10 looping VUs for 30s (exec: getAssociation, gracefulStop: 30s)
              * getUser: 10 looping VUs for 30s (exec: getUser, gracefulStop: 30s)
              * liason: 20 looping VUs for 30s (exec: liasion, gracefulStop: 30s)



    THRESHOLDS

    http_req_duration{scenario:getAssociation}
    ✓ 'p(95)<10000' p(95)=4.33ms

    http_req_duration{scenario:getUser}
    ✓ 'p(95)<10000' p(95)=4.24ms

    http_req_duration{scenario:liason}
    ✓ 'p(95)<2000' p(95)=1.5s

    http_req_failed{scenario:getAssociation}
    ✓ 'rate<0.01' rate=0.00%

    http_req_failed{scenario:getUser}
    ✓ 'rate<0.01' rate=0.00%

    http_req_failed{scenario:liason}
    ✓ 'rate<0.01' rate=0.00%


    TOTAL RESULTS

    checks_total.......: 380     12.477104/s
    checks_succeeded...: 100.00% 380 out of 380
    checks_failed......: 0.00%   0 out of 380

    ✓ status is 2xx

    HTTP
    http_req_duration...............: avg=50.46ms  min=464.07µs med=1.37ms  max=1.5s     p(90)=3.49ms  p(95)=6.02ms
      { expected_response:true }....: avg=50.46ms  min=464.07µs med=1.37ms  max=1.5s     p(90)=3.49ms  p(95)=6.02ms
      { scenario:getAssociation }...: avg=2.16ms   min=466.67µs med=1.35ms  max=302.47ms p(90)=2.54ms  p(95)=4.33ms
      { scenario:getUser }..........: avg=1.97ms   min=464.07µs med=1.35ms  max=202.98ms p(90)=2.49ms  p(95)=4.24ms
      { scenario:liason }...........: avg=1.5s     min=1.49s    med=1.5s    max=1.5s     p(90)=1.5s    p(95)=1.5s
    http_req_failed.................: 0.00%  0 out of 11780
      { scenario:getAssociation }...: 0.00%  0 out of 5690
      { scenario:getUser }..........: 0.00%  0 out of 5710
      { scenario:liason }...........: 0.00%  0 out of 380
    http_reqs.......................: 11780  386.790211/s

    EXECUTION
    iteration_duration..............: avg=102.65ms min=50.51ms  med=51.97ms max=1.6s     p(90)=54.01ms p(95)=56.51ms
    iterations......................: 11780  386.790211/s
    vus.............................: 40     min=40         max=40
    vus_max.........................: 40     min=40         max=40

    NETWORK
    data_received...................: 12 MB  402 kB/s
    data_sent.......................: 1.0 MB 34 kB/s


## association-service
### get_TA
- reliability: stated SLO seeks $success > 99.0%$. Load test shows reliability of 100%.
- latency: stated SLO seeks approximate latency of P99: 5-10s P95: 1s - 3s, P50: ~100ms with $max < 10s$. Load test shows $P95 \approx 5ms$ and $max \approx 308ms$

### get_user
  - reliability: stated SLO seeks $success > 99.0%$. Load test shows reliability of 100%.
  - latency: stated SLO seeks approximate latency of P99: 5-10s P95: 1s - 3s, P50: ~100ms with $max < 10s$. Load test shows $P95 \approx 5ms$ and $max \approx 208ms$


Summary: in their current states, the get_user and get_TA endpoints of association-service exceed their latency and reliability SLOs. Simulated SQLite database reads are simulated as 200ms and 300ms delays respectively. The large difference between $max$ and $P95$ can be attributed to the redis cache being hit for every subsequent read after the first; the request only simulates a read over one record. This is a limitation of this simulation and latency/reliability metrics will likely change once the user database is implemented. Still, this load test shows cache-hit performance to far exceed what is necessary for stated SLOs.


## liason-service


         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 


     execution: local
        script: loadtest.js
        output: -

     scenarios: (100.00%) 1 scenario, 20 max VUs, 1m0s max duration (incl. graceful stop):
              * default: 20 looping VUs for 30s (gracefulStop: 30s)



  █ THRESHOLDS 

    http_req_duration
    ✓ 'p(95)<2000' p(95)=1.5s

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 380     12.4457/s
    checks_succeeded...: 100.00% 380 out of 380
    checks_failed......: 0.00%   0 out of 380

    ✓ status is 2xx

    HTTP
    http_req_duration..............: avg=1.5s min=1.5s med=1.5s max=1.51s p(90)=1.5s  p(95)=1.5s 
      { expected_response:true }...: avg=1.5s min=1.5s med=1.5s max=1.51s p(90)=1.5s  p(95)=1.5s 
    http_req_failed................: 0.00%  0 out of 380
    http_reqs......................: 380    12.4457/s

    EXECUTION
    iteration_duration.............: avg=1.6s min=1.6s med=1.6s max=1.62s p(90)=1.61s p(95)=1.61s
    iterations.....................: 380    12.4457/s
    vus............................: 20     min=20       max=20
    vus_max........................: 20     min=20       max=20

    NETWORK
    data_received..................: 208 kB 6.8 kB/s
    data_sent......................: 57 kB  1.9 kB/s




running (0m30.5s), 00/20 VUs, 380 complete and 0 interrupted iterations
default ✓ [======================================] 20 VUs  30s

### check
- reliability: stated SLO seeks $success > 99.9%$ . Load test shows reliability of 100%
- latency: stated SLO seeks $P95 < 2s$. Load test shows $P95 ~ 1.5s$

Summary: in it's current state, the match endpoint of liason-service does operate inside of its SLOs while being load balanced via Caddy. This is due to its work being simulated on the backend with a hard coded delay of 1500ms. This will likely change when the backend is implemented further.
