import express from "express";

const app = express();
app.use(express.json());

//FOR SIMULATION PURPOSES ----------------------
/**
 * simulates work
 * @param {Number} latencyMs - simulated latency in ms, default to 1500
 */
function simulateWork(latencyMs = 1500) {
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
  console.log(`generating ta_admin_digest...`);
  //TODO:
  // 1. gather email, name, propertyName, and deadlines from database for given TA
  // 2. implement idempotency mechanism
  // 3. implement at least once behavior
  // 4. add functionality for case in which there are multiple TA admins

  await simulateWork(2000); //simulates getting record from the database and creating digest object

  const digest = example_record;

  const response = await fetch("http://email-service:3000/email_deadline_digest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(digest),
  });

  res.json(await response.json());
};

app.post("/ta_admin_digest", ta_admin_digest);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`deadlines-service listening on port ${PORT}`);
});
