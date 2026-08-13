## association-service, liason-service load test of get_TA and get_user endpoints

             /\      Grafana   /‾‾/
        /\  /  \     |\  __   /  /
       /  \/    \    | |/ /  /   ‾‾\
      /          \   |   (  |  (‾)  |
     / __________ \  |_|\_\  \_____/


        execution: local
            script: sprint-5-load.js
            output: -

        scenarios: (100.00%) 5 scenarios, 78 max VUs, 10m30s max duration (incl. graceful stop):
                  * deadlines: 33 iterations for each of 3 VUs (maxDuration: 10m0s, exec: deadlines, gracefulStop: 30s)
                  * getAssociation: 15 looping VUs for 1m30s (exec: getAssociation, gracefulStop: 30s)
                  * getUser: 40 looping VUs for 1m30s (exec: getUser, gracefulStop: 30s)
                  * liaison_contact: 20 iterations for each of 5 VUs (maxDuration: 10m0s, exec: liaison_contact, gracefulStop: 30s)
                  * liaison_match: 15 looping VUs for 1m30s (exec: liaison_match, gracefulStop: 30s)



      █ THRESHOLDS

        http_req_duration{scenario:deadlines}
        ✓ 'p(95)<60000' p(95)=2s

        http_req_duration{scenario:getAssociation}
        ✓ 'p(95)<10000' p(95)=3.72ms

        http_req_duration{scenario:getUser}
        ✓ 'p(95)<10000' p(95)=3.72ms

        http_req_duration{scenario:liaison_contact}
        ✓ 'p(95)<10000' p(95)=1.5s

        http_req_duration{scenario:liaison_match}
        ✓ 'p(95)<2000' p(95)=1.5s

        http_req_failed{scenario:deadlines}
        ✓ 'rate<0.0001' rate=0.00%

        http_req_failed{scenario:getAssociation}
        ✓ 'rate<0.01' rate=0.00%

        http_req_failed{scenario:getUser}
        ✓ 'rate<0.01' rate=0.00%

        http_req_failed{scenario:liaison_contact}
        ✓ 'rate<0.01' rate=0.00%

        http_req_failed{scenario:liaison_match}
        ✓ 'rate<0.001' rate=0.00%


      █ TOTAL RESULTS

        checks_total.......: 1054    11.538565/s
        checks_succeeded...: 100.00% 1054 out of 1054
        checks_failed......: 0.00%   0 out of 1054

        ✓ status is 2xx

        HTTP
        http_req_duration................: avg=19.17ms min=458µs   med=1.61ms max=2.01s    p(90)=3.09ms  p(95)=4.01ms
          { expected_response:true }.....: avg=19.17ms min=458µs   med=1.61ms max=2.01s    p(90)=3.09ms  p(95)=4.01ms
          { scenario:deadlines }.........: avg=2s      min=2s      med=2s     max=2.01s    p(90)=2s      p(95)=2s
          { scenario:getAssociation }....: avg=2.1ms   min=458µs   med=1.6ms  max=243.13ms p(90)=3ms     p(95)=3.72ms
          { scenario:getUser }...........: avg=2.1ms   min=500µs   med=1.6ms  max=244.2ms  p(90)=2.98ms  p(95)=3.72ms
          { scenario:liaison_contact }...: avg=1.5s    min=1.5s    med=1.5s   max=1.55s    p(90)=1.5s    p(95)=1.5s
          { scenario:liaison_match }.....: avg=1.5s    min=1.49s   med=1.5s   max=1.54s    p(90)=1.5s    p(95)=1.5s
        http_req_failed..................: 0.00%  0 out of 95553
          { scenario:deadlines }.........: 0.00%  0 out of 99
          { scenario:getAssociation }....: 0.00%  0 out of 25773
          { scenario:getUser }...........: 0.00%  0 out of 68726
          { scenario:liaison_contact }...: 0.00%  0 out of 100
          { scenario:liaison_match }.....: 0.00%  0 out of 855
        http_reqs........................: 95553  1046.057397/s

        EXECUTION
        iteration_duration...............: avg=70ms    min=50.49ms med=51.9ms max=2.12s    p(90)=53.41ms p(95)=54.38ms
        iterations.......................: 95553  1046.057397/s
        vus..............................: 15     min=15         max=78
        vus_max..........................: 78     min=78         max=78

        NETWORK
        data_received....................: 70 MB  763 kB/s
        data_sent........................: 8.4 MB 92 kB/s




    running (01m31.3s), 00/78 VUs, 95553 complete and 0 interrupted iterations
    deadlines       ✓ [==========] 3 VUs   01m09.4s/10m0s  99/99 iters, 33 per VU
    getAssociation  ✓ [==========] 15 VUs  1m30s
    getUser         ✓ [==========] 40 VUs  1m30s
    liaison_contact ✓ [==========] 5 VUs   00m32.1s/10m0s  100/100 iters, 20 per VU
    liaison_match   ✓ [==========] 15 VUs  1m30s


## caddy --> association
### get_TA
- reliability: stated SLO seeks $success > 99.0%$. Load test shows reliability of 100%.
- latency: stated SLO seeks approximate latency of P99: 5-10s P95: 1s - 3s, P50: ~100ms with $max < 10s$. Load test shows $P95 \approx 5ms$ and $max \approx 308ms$

### get_user
  - reliability: stated SLO seeks $success > 99.0%$. Load test shows reliability of 100%.
  - latency: stated SLO seeks approximate latency of P99: 5-10s P95: 1s - 3s, P50: ~100ms with $max < 10s$. Load test shows $P95 \approx 5ms$ and $max \approx 208ms$


### Summary
Summary: in their current states, the get_user and get_TA endpoints of association-service exceed their latency and reliability SLOs. Simulated SQLite database reads are 200ms and 300ms delays respectively. The large difference between $max$ and $P95$ can be attributed to the redis cache being hit for every subsequent read after the first; the request only simulates a read over one record. This is a limitation of this simulation and latency/reliability metrics will likely change once a user database is implemented. Still, this load test shows cache-hit performance to far exceed what is necessary for stated SLOs.


## caddy --> liaison --> kafka

### match
- reliability: stated SLO seeks $success > 99.9%$ . Load test shows reliability of 100%
- latency: stated SLO seeks $P95 < 1min$. Load test shows $P95 ~ 1.5s$

### contact
- reliability:stated SLO seeks $success > 99.9%$ . Load test shows reliability of 100%
- latency:stated SLO seeks $P95 < 1min$. Load test shows $P95 ~ 1.5s$


### Summary
in it's current state, the match endpoint of liaison-service does operate inside of its SLOs while being load balanced via Caddy. This is due to its work being simulated on the backend with a hard coded delay of 1500ms. This will likely change when the backend is implemented further.

## deadlines --> kafka

### ta_admin_digest
- reliability: stated SLO seeks $success > 99.99%$ . Load test shows reliability of 100%
- latency: stated SLO seeks $P95 < 1min$. Load test shows $P95 ~ 2s$


### Summary
In it's current state, the only notification endpoint of `deadlines-service`, `ta_admin_digest` does meet all desired SLO targets. The service is able to effectively and reliably publish jobs to kafka which are consumed, resulting in emails sent. Albeit, we are only limited to observing what is in the system itself. Since we are using Google's SMTPS server via `nodemailer`, we currently don't have a way of measuring reliability or latency once the job is given to them. Google simply responds once the job is put into the outbound queue. Furthermore, this service is still working with a simulated database retrieval (hence the extremely consistent 2s latency performance across all percentiles). Wiring this service to live SQLite database would surely change performance across the board.
