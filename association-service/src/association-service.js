import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const REPLICA_ID = process.env.REPLICA_ID;

console.log(`environment: \n\tPORT=${PORT}`);

//FOR SIMULATION PURPOSES ----------------------
/**
 * simulates work
 * @param {Number} latencyMs - simulated latency in ms, default to 1500
 */
function simulateWork(latencyMs = 1500) {
  return new Promise((resolve) => setTimeout(resolve, latencyMs));
}


// simulated data
const example_record = {
  user_id: 1, //unique id for each user
  ta_id: 4,   //unique id for TA
  ta_role: "ta_admin", //disambiguates users as a "tenant" or "ta_admin"
  first_name: "Homer",
  last_name: "Simpson",
  email: "jsok475@gmail.com",
  property_name: "742 Evergreen Terrace",
  apartment: "2B",
  //can be empty
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
  // for testing -- remove if it breaks something
  handledBy: REPLICA_ID
};

const example_association = {
  ta_id: 4, //unique id for each TA
  property_name: "742 Evergreen Terrace",
  owner: "Charles Montgomery Burns",
  owner_email: "destroyTheSun@gmail.com",
  admins: ["Homer Simpson, Marge Simpson"],
  contact_email: ["jsok475@gmail.com"],
  tenants: ["Homer Simpson", "Marge Simpson", "Lisa Simpson", "Bart Simpson", "Maggie Simpson"],
  //can be empty
  deadlines: [
    {
      title: "Notice of Intent to Match",
      due_date: "2026-08-15T23:59:59Z",
      description: "30-day window to match outside contract price",
      responsible: ["Homer Simpson", "Marge Simpson"] //who is responsible for this deadline
    },
    {
      title: "Execute Purchase & Sale Agreement",
      due_date: "2026-09-14T23:59:59Z",
      description: "Finalize formal P&S contract with owner attorneys",
      responsible: ["Homer Simpson", "Marge Simpson"]
    },
    {
      title: "Onboard Tenant Accounts",
      due_date: "2026-08-15T23:59:59Z",
      description: "All tenants at property must be registered in the TA",
      responsible: ["Bart Simpson", "Lisa Simpson", "Maggie Simpson"]
    }
  ],
  //can be empty
  matches: [
    {
      name: "Springfield Affordable Housing Authority",
      contact:{
        name: "Seymore Skinner",
        email: "principalInChief@gmail.com",
      }
    },
    {
      name: "Quimby Land Trust",
      contact:{
        name:"Diamond Joe Quimby Jr.",
        email:"diamondJoe@gmail.com"
      }
    }
  ],
  // for testing -- remove if it breaks something
  handledBy: REPLICA_ID
}

//--------------------------------------------
/** fetches a single user's record from the database based on user_id in query string
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const get_user = async (req, res) => {
  console.log(`get_user endpoint hit`);
  //TODO:
  // 1.

  //console.log(`getting user ${req.query.user_id}...`);

  simulateWork(200);

  const response = example_record;

  res.status(200).json(response);
};

/** fetches a TA record from the database based on ta_id in query string
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const get_TA = async (req, res) => {
  console.log(`get_TA endpoint hit`);

  //console.log(`getting TA record ${req.query.ta_id}`)

  simulateWork(300);

  const response = example_association;

  res.status(200).json(response);
}

app.get("/health", (req, res) => {
    return res.status(200).json({ status: 'UP', service: 'association-service', handledBy: REPLICA_ID });
});


app.get("/get_user", get_user);

app.get("/get_TA", get_TA);

app.listen(PORT, () => {
  console.log(`association-service listening on port ${PORT}`);
});
