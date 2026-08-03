import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
const CONTAINER_ID = process.env.CONTAINER_ID;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

console.log(`environment: \n\tPORT=${PORT}`);


const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.error("[REDIS ERROR]", err));

await redisClient.connect().then(() => {
  console.log("Connected to Redis server successfully");
})






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
}


//TODO:
  // 1. association service permanently hangs when request has bad/malformed query.

//--------------------------------------------
/** fetches a single user's record from the database based on user_id in query string
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const get_user = async (req, res) => {
  const { user_id } = req.query;
  console.log(`get_user endpoint hit`);



  if (!user_id){
    console.log("[ERROR] bad request, user_id not included");
    return res.status(400).json({ success: false, err: "[ERROR] bad request, user_id not included" });
  }

  try {
    const cacheKey = `user:${user_id}`;

    const cachedData = await redisClient.get(cacheKey);

    // if cache hit
    if (cachedData) {
      console.log(`[CACHE HIT] sending ${user_id} from cache `);
      return res.status(200).json({ respondent: CONTAINER_ID, success: true, record: JSON.parse(cachedData), fromCache: true,});
    }

    // cache miss
    console.log(`[CACHE MISS] getting user ${req.query.user_id}...`);
    await simulateWork(200);

    const data = example_record;

    // set data to the cache with a 60 second expiration
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 })

    res.status(200).json({
      respondent: CONTAINER_ID,
      success: true,
      record: data,
      fromCache: false
    });
  } catch (error) {
    res.status(500).json({ success: false, err: error.message });
  }

};

/** fetches a TA record from the database based on ta_id in query string
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const get_TA = async (req, res) => {
  const { ta_id } = req.query;
  // console.log(`get_TA endpoint hit`);

  if (!ta_id){
    console.log("[ERROR] bad request, ta_id not included");
    return; res.status(400).json({ success: false, err: "[ERROR] bad request, ta_id not included", fromCache: false });
  }

  try {
    const cacheKey = `ta:${ta_id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`[CACHE HIT] Serving TA ${ta_id} from Redis`);
      return res.status(200).json({ respondent: CONTAINER_ID, success: true, record: JSON.parse(cachedData), fromCache: true });
    }

    console.log(`[CACHE MISS] getting TA record ${req.query.ta_id}`);

    await simulateWork(300);
    const data = example_association;

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
    res.status(200).json({ respondent: CONTAINER_ID, success: true, record: data, fromCache: false});
  } catch (error) {
    res.status(500).json({ success: false, err: error.message });
  }
}

app.get("/health", (req, res) => {
    return res.status(200).json({ status: 'UP', service: 'association-service', handledBy: CONTAINER_ID });
});


app.get("/get_user", get_user);

app.get("/get_TA", get_TA);

app.listen(PORT, () => {
  console.log(`association-service-${CONTAINER_ID} listening on port ${PORT}`);
});
