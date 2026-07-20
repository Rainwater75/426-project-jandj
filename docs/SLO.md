## docs/SLO.md

In forming our SLOs, a main consideration that occurred was our much increased need for reliability over speed.

### Latency SLO

`association-service`: The association service is a user facing API.

- The get_summary endpoint must respond within 10 s at the 99th percentile. It should approximate the following latency ranges: P99: 5-10s P95: 1s - 3s, P50: ~100ms. It is likely that if the response time exceeds P99, the TA administrator will refresh the page or submit another request.

`liaison-service`: The liaison-service is not user facing and therefore does not need to respond as quickly.

- The assignees search endpoint response thresholds are as follows: PP:4-5 min, PP95: 1 min, P50: 1-5s. Only the tenant board is waiting for a response, so the algorithm can prioritize finding the perfect match. However, if the algorithm somehow stretches for hours, it would cause frustration due to the need to find an assignee.

`deadlines-service`: this not a user facing service, although it is part of an automated, discontinuous UX. These notifications are meant to inform deadlines that are days away, so delay on the order of many minutes is acceptable.

- The notification endpoint response must respond within 10 minutes at the 99th percentile. It should approximate the following latency ranges: P99: 5-10 min, P95:1-3 min, P50:5 - 10s. If the notification endpoint exceeds these thresholds into many hours, deadline information may become inaccurate leading the tenant administrator to be misinformed on how far away the deadline is.

### Reliability SLO

`association-service`: This is service will be used by the TA admins to get/modify information about the TA and their matching process. It must have high reliability.

- The initialize_association end point should succeed 99.9% of the time. At-most-once might mean a tenant association isn’t initialized, which would mean the TA admin would need to fill out the relevant forms again, an annoyance that reduces user confidence. At-least-once might mean that duplicate associations are written to the database, which would create data consistency problems if TA data is read/written by name.

`liaison-service`:

- The liaison service must achieve a success rate of 99.9% in all endpoints. The assignees search endpoint should follow at-most-once semantics. If a query fails, it is better to retry that return out of date information or a sub par candidate. The assignee contanct endpoint which reaches out to the potential assignee should follow at-least-once semantics since redundant emails are better than the alternative of never actually informing the assignee of interest.

`deadlines-service`: This service is meant to inform users about critical deadlines. Users need to be confident that they are **guaranteed** to receive notifications.

- the notification endpoint must succeed 99.99% of the time. It should be designed with **at-least-once** delivery in mind. Receiving duplicate notifications is functionally no inconvenience. **At-most-once** delivery is not appropriate for this service, because failing to receive a notification can have a large negative impact on the TA, should they subsequently learn that the due date is approaching sooner than expected.
