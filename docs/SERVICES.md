## docs/SERVICES.md

### association-service (Shared)

Initializes/modifies tenant associations (TA) in the application database
Gather information on TA. For example: Which users have accepted an invite to TA? Which users have completed the survey on their household?

### liaison-service (John Park)

Runs algorithm that takes demographic and financial information of the tenants and finds a compatible assignee that could buy the building on their behalf 
Send communications to agents of potential assignees of the TAs intent to find a TOPA match, along with relevant stats on the building and the tenants

### deadlines-service (Jason Karos)

Sends out notifications to tenants about approaching deadlines, what needs to be completed, the fact that the process has started, etc.