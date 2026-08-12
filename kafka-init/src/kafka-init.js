// kafka-init.js
import { Kafka } from "kafkajs";

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:19092";

const kafka = new Kafka({ brokers: [KAFKA_BROKER] });
const admin = kafka.admin();
await admin.connect();
await admin.createTopics({
  topics: [
    { topic: "deadline.digest", numPartitions: 1 },
    { topic: "assignee.contact", numPartitions: 1 },
  ],
});
await admin.disconnect();
console.log("[LOG] Topic 'emails' created successfully.");
