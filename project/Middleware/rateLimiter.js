const rateLimitCache = require('../config/cache');

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const currentTime = Date.now();
  const timeWindow = process.env.RATE_LIMITER_TIME_IN_SEC * 1000;
  const maxRequests = process.env.RATE_LIMITER_MAX_REQ;

  let requests = rateLimitCache.get(ip) || { count: 0, firstRequestTime: currentTime };

  if (currentTime - requests.firstRequestTime > timeWindow) {
    requests = { count: 1, firstRequestTime: currentTime };
  } else {
    requests.count += 1;
  }

  rateLimitCache.set(ip, requests);

  if (requests.count > maxRequests) {
    res.status(429).send({msg:'Too Many Requests. Please try again later.'});
  } else {
    next();
  }
};

module.exports = rateLimiter;
