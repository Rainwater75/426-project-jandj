import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());
let healthy = false;

const PORT = process.env.PORT || 4000;
const CONTAINER_ID = process.env.CONTAINER_ID;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const DB_DELAY_MS = process.env.DB_DELAY_MS || 200;
const FAILURE_MODE = process.env.FAILURE_MODE || null;
// FAILURE_MODE="LIVE_CACHE_DOWN" --> simulates redis becoming unreachable while live
// FAILURE_MODE="LIVE_DATABASE_DOWN" --> simulates database becoming unreachable while live

console.log(
  `environment: \n\tPORT=${PORT}\n\tCONTAINER_ID=${CONTAINER_ID}\n\tREDIS_URL=${REDIS_URL}\n\tFAILURE_MODE=${FAILURE_MODE}`,
);

const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.error("[REDIS ERROR]", err));

await redisClient.connect().then(() => {
  console.log("Connected to Redis server successfully");
  healthy = true;
});

/** fetches record from redis cache, catches timeout errors
 *
 * @param {string} key
 * @returns {Object} {cachedData: Object, redisHealth: boolean}
 */
const redis_get = async (cacheKey) => {
  try {
    if (FAILURE_MODE === "LIVE_CACHE_DOWN") {
      console.log(`[LOG] simulating cache timeout`);
      await simulateWork(5000);
      const error = new Error("Redis connection timed out");
      error.code = "ETIMEDOUT";
      throw error;
    } else {
      return {
        cachedData: await redisClient.get(cacheKey),
        redisHealthy: true,
      };
    }
  } catch (err) {
    if (
      ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EAI_AGAIN"].includes(
        err.code,
      )
    ) {
      console.log(`[ERROR:CACHE] ${err.message} - falling back to DB`);
      return {
        cachedData: null,
        redisHealthy: false,
      };
    }
    throw err;
  }
};

/** fetches record from redis cache, catches timeout errors
 *
 * @param {string} key
 * @returns {boolean} true: successful cache, false: unsuccessful cache
 */
const redis_set = async (cacheKey, data) => {
  try {
    if (FAILURE_MODE === "LIVE_CACHE_DOWN") {
      console.log(`[LOG] simulating cache timeout`);
      await simulateWork(5000);
      const error = new Error("Redis connection timed out");
      error.code = "ETIMEDOUT";
      throw error;
    } else {
      await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
      return true;
    }
  } catch (err) {
    if (
      ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EAI_AGAIN"].includes(
        err.code,
      )
    ) {
      console.log(`[ERROR:CACHE] ${err.message}`);
      return false;
    }
    throw err;
  }
};

/** fetches user from database, catches timeout errors
 *
 * @param {string} key
 * @returns {Object} contents of record matching `key`
 */
const db_get_user = async (db_key) => {
  if (FAILURE_MODE === "LIVE_DATABASE_DOWN") {
    console.log(`[LOG] simulating database timeout`);
    await simulateWork(5000);
    const error = new Error("Database connection timed out");
    throw error;
  } else {
    await simulateWork(DB_DELAY_MS);
    return example_record;
  }
};

/** fetches TA from database, catches timeout errors
 *
 * @param {string} key
 * @returns {Object} contents of record matching `key`
 */
const db_get_TA = async (db_key) => {
  if (FAILURE_MODE === "LIVE_DATABASE_DOWN") {
    console.log(`[LOG] simulating database timeout`);
    await simulateWork(5000);
    const error = new Error("Database connection timed out");
    throw error;
  } else {
    await simulateWork(DB_DELAY_MS + 100);
    return example_association;
  }
};

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
  ta_id: 4, //unique id for TA
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
  tenants: [
    "Homer Simpson",
    "Marge Simpson",
    "Lisa Simpson",
    "Bart Simpson",
    "Maggie Simpson",
  ],
  //can be empty
  deadlines: [
    {
      title: "Notice of Intent to Match",
      due_date: "2026-08-15T23:59:59Z",
      description: "30-day window to match outside contract price",
      responsible: ["Homer Simpson", "Marge Simpson"], //who is responsible for this deadline
    },
    {
      title: "Execute Purchase & Sale Agreement",
      due_date: "2026-09-14T23:59:59Z",
      description: "Finalize formal P&S contract with owner attorneys",
      responsible: ["Homer Simpson", "Marge Simpson"],
    },
    {
      title: "Onboard Tenant Accounts",
      due_date: "2026-08-15T23:59:59Z",
      description: "All tenants at property must be registered in the TA",
      responsible: ["Bart Simpson", "Lisa Simpson", "Maggie Simpson"],
    },
  ],
  //can be empty
  matches: [
    {
      name: "Springfield Affordable Housing Authority",
      contact: {
        name: "Seymore Skinner",
        email: "principalInChief@gmail.com",
      },
    },
    {
      name: "Quimby Land Trust",
      contact: {
        name: "Diamond Joe Quimby Jr.",
        email: "diamondJoe@gmail.com",
      },
    },
  ],
};

//TODO:
// 1.

//--------------------------------------------
/** fetches a single user's record from the database based on user_id in query string
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const get_user = async (req, res) => {
  console.log(`[LOG] get_user endpoint hit`);
  let user_id;

  //try to parse query string
  try {
    console.log(`[LOG] parsing query string`);
    user_id = req.query.user_id;
  } catch (err) {
    console.log(`[ERROR] malformed query string: ${err}`);
    return res.status(400).json({
      success: false,
      err: `[ERROR] malformed query string: ${err}`,
    });
  }

  //input validation
  if (!user_id) {
    console.log("[ERROR] bad request, user_id is empty");
    return res.status(400).json({
      success: false,
      err: "[ERROR] bad request, user_id is empty",
    });
  }

  try {
    const cacheKey = `user:${user_id}`;

    const { redisHealthy, cachedData } = await redis_get(cacheKey);

    // if cache hit
    if (cachedData) {
      console.log(`[CACHE HIT] sending ${user_id} from cache `);
      return res.status(200).json({
        respondent: CONTAINER_ID,
        success: true,
        record: JSON.parse(cachedData),
        fromCache: true,
      });
    }

    // cache miss
    console.log(`[CACHE MISS] getting user ${req.query.user_id}...`);

    const data = await db_get_user(user_id);

    if (redisHealthy) {
      await redis_set(cacheKey, data);
    }

    res.status(200).json({
      respondent: CONTAINER_ID,
      success: true,
      record: data,
      fromCache: false,
    });
  } catch (error) {
    healthy = false;
    res.status(500).json({ success: false, err: error.message });
  }
};

/** fetches a TA record from the database based on ta_id in query string
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const get_TA = async (req, res) => {
  console.log(`[LOG] get_TA endpoint hit`);
  let ta_id;

  //try to parse query string
  try {
    console.log(`[LOG] parsing query string`);
    ta_id = req.query.ta_id;
  } catch (err) {
    console.log(`[ERROR] malformed query string, cannot parse`);
    return res.status(400).json({
      success: false,
      error: "[ERROR] malformed query string, cannot parse",
    });
  }

  //check for nullish ta_id
  if (!ta_id) {
    console.log("[ERROR] bad request, ta_id not included");
    return res.status(400).json({
      success: false,
      err: "[ERROR] bad request, ta_id not included",
    });
  }

  if (!ta_id) {
    console.log("[ERROR] bad request, ta_id not included");
    return;
    res.status(400).json({
      success: false,
      err: "[ERROR] bad request, ta_id not included",
      fromCache: false,
    });
  }

  try {
    const cacheKey = `ta:${ta_id}`;
    const { redisHealthy, cachedData } = await redis_get(cacheKey);

    if (cachedData) {
      console.log(`[CACHE HIT] Serving TA ${ta_id} from Redis`);
      return res.status(200).json({
        respondent: CONTAINER_ID,
        success: true,
        record: JSON.parse(cachedData),
        fromCache: true,
      });
    }

    console.log(`[CACHE MISS] getting TA record ${ta_id}`);

    const data = await db_get_user(ta_id);

    if (redisHealthy) {
      await redis_set(cacheKey, data);
    }

    res.status(200).json({
      respondent: CONTAINER_ID,
      success: true,
      record: data,
      fromCache: false,
    });
  } catch (error) {
    healthy = false;
    res.status(500).json({ success: false, err: error.message });
  }
};

app.get("/health", (req, res) => {
  if (healthy) {
    return res.status(200).json({ status: "ok" });
  } else {
    return res.status(500).json({ status: "not ok" });
  }
});

app.get("/get_user", get_user);

app.get("/get_TA", get_TA);

app.listen(PORT, () => {
  console.log(`association-service-${CONTAINER_ID} listening on port ${PORT}`);
});
