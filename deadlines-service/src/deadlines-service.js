import express from "express";
import { Kafka } from "kafkajs";
import { logger, requestLogger } from "./logger.js";
import { metricsMiddleware, metricsEndpoint } from "./metrics.js";

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(metricsMiddleware);

const PORT = process.env.PORT || 3002;
const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:19092";

const kafka = new Kafka({ brokers: [KAFKA_BROKER] });
const producer = kafka.producer();

logger.info(`environment: \n\tPORT=${PORT}`);

//FOR SIMULATION PURPOSES ----------------------
/**
 * simulates work
 * @param {Number} latencyMs - simulated latency in ms, default to 500
 */
function simulateWork(latencyMs = 500) {
  return new Promise((resolve) => setTimeout(resolve, latencyMs));
}

const example_record = {
  admin_email: "jsok475@gmail.com",
  admin_name: "Homer Simpson",
  property_name: "742 Evergreen Terrace",
  deadlines: [
    {
      title: "Notice of Intent to Match",
      due_date: "2026-08-15T23:59:59Z",
      description: "30-day window to match outside contract price",
    },
    {
      title: "Execute Purchase & Sale Agreement",
      due_date: "2026-09-14T23:59:59Z",
      description: "Finalize formal P&S contract with owner attorneys",
    },
  ],
};

//--------------------------------------------
/**
 * Gathers records needed for TA admin digest and then sends notifications via email-ambassador.
 * res.body json shape: {success: bool, messageId:String, type:String}
 * latency SLO: P99 < 8s
 * reliability SLO: <0.01% error
 * @param {express.Request} req
 * @param {express.Response} res
 */
const ta_admin_digest = async (req, res) => {
  logger.info(`generating ta_admin_digest...`);
  //TODO:
  // 1. gather email, name, propertyName, and deadlines from database for given TA
  // 2. implement idempotency mechanism
  // 3. implement at least once behavior
  // 4. add functionality for case in which there are multiple TA admins

  await simulateWork(300); //simulates getting record from the database and creating digest object

  const digest = example_record;

  // const response = await fetch("http://email-service:3000/email_deadline_digest", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(digest),
  // });

  // res.json(await response.json());

  // Kafka message schema: payload: {value: Object}
  // value: message content Object to pass to endpoint

  await producer.send({
    topic: "deadline.digest",
    messages: [
      {
        value: JSON.stringify(digest),
      },
    ],
  });

  logger.info("[KAFKA] published deadline digest event");
  return res.status(202).json({
    success: true,
    status: "queued",
    message: "deadline digest request queued for async processing",
  });
};

app.get("/health", (req, res) => {
  logger.info("Health check requested");
  return res.status(200).json({ status: "ok" });
});

app.post("/ta_admin_digest", ta_admin_digest);

app.get("/metrics", metricsEndpoint);

app.listen(PORT, async () => {
  logger.info(`deadlines-service listening on port ${PORT}`);
  try {
    await producer.connect();
    logger.info("[KAFKA] Deadlines producer connected successfully.");
  } catch (error) {
    logger.error("[KAFKA ERROR] Producer failed to connect:", error);
  }
});
