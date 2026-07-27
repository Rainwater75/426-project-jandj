import express from "express";

const app = express();
app.use(express.json());

data = {
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

fetch("email-service:3000/email_deadline_digest");
