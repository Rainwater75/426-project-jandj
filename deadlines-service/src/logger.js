// copy paste this into your src file for the service or inside the service folder and import it 

// example usage: 

// import { logger, requestLogger } from './logger.js';
// dont need to do const log = logger or anything

// logger.info("Received match request", { zipCode, neighborhood, handledBy: REPLICA_ID }); 
// {"level":"INFO","message":"Received match request","zipCode":"02108","neighborhood":"Boston","handledBy":"replica-1","timestamp":"2026-08-11T10:54:53.249Z"}
// zipcode, neighboord, and handledby are all variables specific to my service, so i include them in the "context" section so they will be logged as well

// logger.error("This is an error message", new Error("Something went wrong"), { additional: "context" });
// {"level":"ERROR","message":"This is an error message","error":"Something went wrong","additional":"context", "timestamp":"2024-06-01T12:00:00.000Z"}

// context is everything that you want to add, just add it manually 
// ex. im going to add { replicaId: REPLICA_ID } to every log in my service after the main parameters

// requestLogger logs for every request, use app.use(requestLogger); at the top and express will use it automatically
// i dont tihnk it logs statuses 

// note that return res.status will log in the console you curled in while logger will log in the docker console 

// also i tried a few ways to share this file between services but it was a bust

export const logger = {
    // takes message and context 
    info: (message, context = {}) => {
        console.log(JSON.stringify({
            level: "INFO",
            message,
            ...context,
            timestamp: new Date().toISOString(),
        }));
    },
    // takes message, error object and context
    error: (message, error, context = {}) => {
        console.error(JSON.stringify({
            level: "ERROR",
            message,
            error: error?.message || error,
            ...context,
            timestamp: new Date().toISOString(),
        }));
    },

};

export const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    // caddy constatly checks the health endpoint so 3 lines are being printed to the console every few seconds, too much clog
    if (req.path === "/health" || req.path === "/liaison/health") {
        return next(); 
    }

    res.on('finish', () => {
        const endTime = Date.now();
        const durationMs = endTime - startTime;

        logger.info(`HTTP ${req.method} ${req.path}`, {
            http: {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                responseTimeMs: durationMs
            }
        });
    });

    next();
};