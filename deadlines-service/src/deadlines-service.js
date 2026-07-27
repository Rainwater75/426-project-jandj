import express from "express";

const app = express();
app.use(express.json());

const data = {
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

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const gather_digests = async (req, res) => {
  const response = await fetch("http://email-service:3000/email_deadline_digest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resp_json = await response.json();

  res.json(resp_json);
};

app.post("/gather_digests", gather_digests);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Email Ambassador running on port ${PORT}`);
});
