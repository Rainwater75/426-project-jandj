# 426-project-jandj
This document itemizes TODOs for each service of TOPA matching.

NOTE:
1. TODOs here are duplicated in corresponding source files
2. format todos like so:
 -  [ ] `service component`: task description
    - [ ] subtask



### deadlines-service
- [ ] `ta_admin_digest`: add functionality
  - [ ] gather email, name, propertyName, and deadlines from database for given TA
  - [ ] implement idempotency mechanism
  - [ ] implement at least once behavior based on `email-service/health_check`
  - [ ] add functionality for case in which there are multiple TA admins

### email-service
- [ ] `health_check`: add endpoint

### liason-service
