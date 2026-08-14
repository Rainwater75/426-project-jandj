## docs/SERVICES.md

- `association-service` (Shared): Initializes/modifies tenant association (TA) in the application database, for example: gather and return users that have not complete demographic information survey for this tenant association.

- `email-service` (Shared): handles the act of compiling and sending emails to tenants and assignee candidates for matters such as approaching deadlines or contacting potential assignee candidates.

- `liaison-service` (John Park): finds a compatible assignee that could buy the building on their behalf and send communications to agents of potential assignees, for example: a notification of the TA's intent to find a TOPA match.

- `deadlines-service` (Jason Karos) : sends out notifications to tenants about approaching deadlines, what needs to be completed, the fact that the process has started, etc.

                                        +---------------+
                                        | load-balancer |
                                        +---------------+
                                                |       \
                                                |        \
                                                V         V
                +-------------------+ +-----------------+ +---------------------+  +---------------+
                | deadlines-service | | liaison-service | | association-service |--| redis caching |
                +-------------------+ +-----------------+ +---------------------+  +---------------+
                        ^                   ^                 |
                        | [publisher]       | [publisher]     |
                        |                   |                 |
                +---------------------------------------+     |
                |             kafka pub/sub             |     |
                +---------------------------------------+     |
                        |                                     |
                        | [consumer]                          |
                        V                                     |
                +---------------------------------------+     |
                |              email-service            |     |
                +---------------------------------------+     |
                        |                        \            |
                        |                         \           |
                        V                          V          V
                +--------------------+           +----------------------+
                | assignee candidates|           |        tenants       |
                +--------------------+           +----------------------+
