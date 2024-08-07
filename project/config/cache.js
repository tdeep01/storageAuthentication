const NodeCache = require('node-cache');
const rateLimitCache = new NodeCache({ stdTTL: process.env.RATE_LIMITER_TIME_IN_SEC });

module.exports = rateLimitCache;
