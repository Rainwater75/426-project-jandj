import express from "express";
import http from 'http';
import fs from 'fs';
import path from 'path';
import { stringify } from 'querystring';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SIMULATED_LATENCY = process.env.SIMULATED_LATENCY || 1500;

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


// returns that the service is healthy 
app.get("/health", (req, res) => {
    return res.status(200).json({ status: 'UP', service: 'liaison-service' });
});

// endpoint for retreiving compatible asingees that can buy the building on the tenant's behalf 

// currently expects body to contain a zipcode and neighboorhood, can add more features
// returns a json containing the query (zipcode and neigborhood), matchedCount: the number of successful 
app.get("/liaison/match", async (req, res) => {
    // the query parameters used to search the area for potential assignees 
    const { zipCode, neighborhood }  = req.query; 

    // runs the "search algorithm" that determines the best match or a list of matches 
    await simulateWork();

    // query: the query informaton, 
    // matchedCount: how many assignees qualify 
    // eligibleAssingees: array of objects representing the assignee candidates that qualify to purcahse the building legally under TOPA
        // each object will have fields such as: id, name, focusArea, email, maxAcquisitonBudget, activeStatus
    // timestamp: the time the work finished 
    return res.status(200).json({
        query: { zipCode: zipCode, neighborhood: neighborhood },
        matchedCount: MOCK_ASSIGNEES.length, 
        eligibleAssignees: MOCK_ASSIGNEES,
        timestamp: new Date().toISOString()
    });

});


// endpoint that automatically contacts the potential assignee from the tenant Association with a predermined message 
app.post("/liaison/contact", async (req, res) => {
    // assigneeId: Id of assignee candidate to be contacted, tenantAssociationId: id of the tenant association doing the contacting, message: message to be sent to the assignee
    const { assigneeId, tenantAssociationId, message } = req.body; 

    // simulate network latency 
    await simulateWork();


    return res.status(201).json({
        success: true,
        deliveryStatus: "Received",
        tenantAssociationId: tenantAssociationId,
        sentAt: new Date().toISOString()
    });
});



app.listen(PORT, () => console.log(`liaison-service listening on port ${PORT}`));


// tests for match and contact 

//curl "http://localhost:3001/liaison/match?zipCode=02108&neighborhood=Boston"

// curl -X POST http://localhost:3001/liaison/contact \
//   -H "Content-Type: application/json" \
//   -d '{"assigneeId": "assignee-01", "tenantAssociationId": "ta-123", "message": "Intent to file TOPA notice."}'