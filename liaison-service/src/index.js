import express from "express";
import http from 'http';
import fs from 'fs';
import path from 'path';
import { stringify } from 'querystring';
import { AssertionError } from "assert/strict";
import { Kafka } from "kafkajs";
import { logger, requestLogger } from "./logger.js";
import { metricsMiddleware, metricsEndpoint } from "./metrics.js";

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(metricsMiddleware);

const PORT = process.env.PORT || 3001;
const SIMULATED_LATENCY = process.env.SIMULATED_LATENCY || 1500;
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || "http://email-service:3000/contact_assignee_candidate";
const REPLICA_ID = process.env.REPLICA_ID; 
const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:19092";
const FAILURE_MODE = (process.env.FAILURE_MODE || "none").toLowerCase(); // fail, slow or else
const FAILURE_LATENCY_MS = process.env.FAILURE_LATENCY_MS || 4000

const kafka = new Kafka({ brokers: [KAFKA_BROKER] });
const producer = kafka.producer();

// ai generated btw
const MOCK_ASSIGNEES = [
    {
        id: "assignee-01",
        name: "Greater Boston Community Land Trust",
        focusArea: "Boston",
        contactEmail: " acquisitions@gbclt.org",
        maxAcquisitionBudgetUSD: 5000000,
        activeStatus: "Ready"
    },
]

// simulates work according to the set simualted latency variable
// update to reflect SLO when possible
function simulateWork(latencyMs = SIMULATED_LATENCY) {
    return new Promise((resolve) => setTimeout(resolve, latencyMs));
}


// for the global health check
app.get("/health", (req, res) => {
    return res.status(200).json({ status: "ok" });
});

// for the caddy health check
// EXCLUDED FROM LOGGING BECAUSE IT CLOGS THE TERMINAL SEE logger.js
app.get("/liaison/health", (req, res) => {
    return res.status(200).json({ status: "ok", service: "liaison-service", handledBy: REPLICA_ID });
});

// endpoint for retreiving compatible asingees that can buy the building on the tenant's behalf 

// currently expects body to contain a zipcode and neighboorhood, can add more features
// returns a json containing the query (zipcode and neigborhood), matchedCount: the number of successful 
app.get("/liaison/match", async (req, res) => {
    // the query parameters used to search the area for potential assignees 
    const { zipCode, neighborhood }  = req.query; 

    logger.info("Received match request", { zipCode, neighborhood, handledBy: REPLICA_ID });
    // runs the "search algorithm" that determines the best match or a list of matches 
    await simulateWork();

    // query: the query informaton, 
    // matchedCount: how many assignees qualify 
    // eligibleAssingees: array of objects representing the assignee candidates that qualify to purcahse the building legally under TOPA
        // each object will have fields such as: id, name, focusArea, email, maxAcquisitonBudget, activeStatus
    // timestamp: the time the work finished 
    logger.info("Match request processed", { handedBy: REPLICA_ID, matchedCount: MOCK_ASSIGNEES.length });
    return res.status(200).json({
        query: { zipCode: zipCode, neighborhood: neighborhood },
        matchedCount: MOCK_ASSIGNEES.length, 
        eligibleAssignees: MOCK_ASSIGNEES,
        timestamp: new Date().toISOString(),
        handledBy: REPLICA_ID
    });

});


// endpoint that automatically contacts the potential assignee from the tenant Association with a predermined message 
app.post("/liaison/contact", async (req, res) => {
    // assigneeId: Id of assignee candidate to be contacted, tenantAssociationId: id of the tenant association doing the contacting, message: message to be sent to the assignee
    const { assigneeId, tenantAssociationId, message } = req.body; 

    if (!assigneeId || !tenantAssociationId) {
        logger.error("Missing required fields for contact request", new Error("Missing required fields"), { handledBy: REPLICA_ID });
        return res.status(400).json({ error: "Missing required fields: assigneeId and tenantAssociationId" });
    }

    logger.info("Received contact request", { assigneeId, tenantAssociationId, handledBy: REPLICA_ID });

    try {
        if (FAILURE_MODE === "fail") {
            logger.error("[FAIL] Induced failure mode enabled, rejecting request", new Error("Induced failure mode"), { handledBy: REPLICA_ID });
            return res.status(503).json({ success: false, error: "Inducedx failure mode enabled", handledBy: REPLICA_ID });
        }

        if (FAILURE_MODE === "slow") {
            logger.info("[SLOW] Induced slow mode enabled, simulating latency", { latencyMs: FAILURE_LATENCY_MS, handledBy: REPLICA_ID });
            await simulateWork(FAILURE_LATENCY_MS);
        } else {
            await simulateWork();
        }

    // send to the ambassador which will send the email
        // const ambassadorResponse = await fetch(EMAIL_SERVICE_URL, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ associationId: tenantAssociationId, assigneeId: assigneeId, message: message })
        // });

        // if(!ambassadorResponse.ok){
        //     const errorData = await ambassadorResponse.json();
        //     throw new Error(errorData.error || "Ambassador rejected request");
        // }

        // const ambassadorData = await ambassadorResponse.json();

        // return res.status(201).json({
        //     success: true,
        //     deliveryStatus: "Sent",
        //     messageId: ambassadorData.messageId,
        //     tenantAssociationId: tenantAssociationId,
        //     sentAt: new Date().toISOString(),
        //     handledBy: REPLICA_ID
        // });


        await producer.send({
            topic: "assignee.contact",
            messages: [
                { value: JSON.stringify({
                    associationId: tenantAssociationId,
                    assigneeId,
                    message,
                })},
            ],
        });

        logger.info("[KAFKA] Published assignee contact event", { handledBy: REPLICA_ID });
        return res.status(202).json({
            success: true,
            status: "queued",
            message: "Assignee contact request queued for async processing",
            handledBy: REPLICA_ID
        });
        
    } catch (error) {
        console.error("Liaison service failed to send assignee contact email via ambassador:", error);
        return res.status(500).json({
            success: false,
            error: "failed to send assignee contact email",
            message: error.message,
            handledBy: REPLICA_ID
        });
    }
});

app.get("/metrics", metricsEndpoint);


app.listen(PORT, async () => {
    logger.info("liaison-service replica started", { handledBy: REPLICA_ID, port: PORT });
    try {
        await producer.connect();
        logger.info("[KAFKA] Liaison producer connected successfully.", { handledBy: REPLICA_ID });
    } catch (error) {
        logger.error("[KAFKA ERROR] Producer failed to connect:", error, { handledBy: REPLICA_ID });
    }
});
    

// tests for match and contact 

//for i in {1..6}; do (curl -s -H "Connection: close" "http://localhost:8080/liaison/match?zipCode=02108&neighborhood=Boston"; echo "") & done; wait

// curl -X POST http://localhost:3001/liaison/contact \
//   -H "Content-Type: application/json" \
//   -d '{"assigneeId": "assignee-01", "tenantAssociationId": "ta-123", "message": "Intent to file TOPA notice."}'