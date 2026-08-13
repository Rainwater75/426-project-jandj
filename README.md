# 426-project-jandj

### Team name: jandj

### Team Roster

| Email                | GitHub Username |
| :------------------- | :-------------- |
| jkaros@umass.edu.com | sh34v3          |
| jjpark@umass.edu     | rainwater75     |

## Project Documentation

- [Refined Project Description](docs/PROJECT.md)
- [Initial Service List](docs/SERVICES.md)
- [Service Level Objectives](docs/SLO.md)

TOPA laws operate on incredibly tight legal deadlines. In most jurisdictions, when a landlord announces an intent to sell, tenants usually have a narrow window (often just 30 to 45 days) to legally form a tenant association, vote, and file an official "Statement of Interest."

If they decide to assign their rights, the assignee has a limited timeframe (frequently 60 to 90 days) to match the outside buyer's appraisal, secure funding, and close the deal. Real estate transactions involving non-profits or public funds rarely move that fast, and missing a deadline by even one day forfeits the tenants' rights entirely.

To exercise or assign TOPA rights, a solid majority of households in the building must actively cooperate. Getting dozens—or hundreds—of neighbors to agree on a single path forward is a massive community-organizing challenge.

TOPA matching is a web application that allows Tenants of Massachusetts to quickly exercise their TOPA rights. Using it they can organize a tenant association, communicate, vote, and file a statement of interest, while also helping match the TA to appropriate assignees. This application could help tenants overcome the logistic challenges of asserting their TOPA rights and more easily preserve their place of residence.


## Environment Variables
- `PORT`: port for the service to listen on. example: 4000, 3002, 3001, 3000. Without port, service will fail because nothing will be able to access it.
- `REDIS_URL`: target port for caching. example: `redis://localhost:6379`. Without, association-service will not be able to establish a connection with the cache and then throw an error.
- `KAFKA_BROKER`: target pointer for kafka go between. ex: `kafka:19092`. Without, services would need to communicate directly which would be a routing pain.
- `FAILURE_MODE`: feature flag that induces manual mock faults ex: `LIVE_CACHE_DOWN`, `LIVE_DATABASE_DOWN`, `fail`, `slow`, `null`. Without, services would not be able to trigger induced failure mode.
- `SMTP_HOST`: secure mail protocol server url (Gmail). Ex: smtp.gmail.com. email will fail to send if missing.
- `SMTP_USER`: email account username credential. ex: example@gmail.com. Email will fail to send if missing.
- `SMTP_PASS `: email account password credential. Ex: sjjp fjaj qoie vlcl. Email will fail to send if missing
- `SMTP_PORT` : nodemailer asks SMTP_HOST to send emails over this port (default port for SMTPS traffic). Ex: 465. Email will fail to send if missing
- `SMTP_SECURE`: nodemailer asks SMTP_HOST to use SMTPS instead of regular SMTP (required for gmail). ex: true. If missing nodemailer will default to false. 
- `DEFAULT_FROM_EMAIL`: who the email will be listed from. Ex: example@gmail.com. If missing, will default to empty. 
- `DEFAULT_REPLY_TO`: where reply emails will be directed. Ex: replyExample@gmail.com. If missing, contacted user may be unable to reply.

- `EMAIL_SERVICE_URL` target for email service requests. ex: `http://email-service:3000/contact_assignee_candidate`. Although commented out right now, the service would not be able to make fetch requests without a target url. 

every other environment var is an internal metadata var

## Setup & Running
```bash
docker compose up --build
```

## .env
need a .env file for the system to work correctly

## Running Load Tests
```bash
k6 run .\load-tests\sprint-3-load.js
k6 run .\load-tests\sprint-5-load.js
```