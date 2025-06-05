const dotenv = require("dotenv");
dotenv.config();

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_KEY: process.env.JWT_KEY as string,
  NODE_ENV: process.env.NODE_ENV,
  RATE_LIMIT_REDIS_URL: process.env.RATE_LIMIT_REDIS_URL,
  API_KEY: process.env.API_KEY,
};
export default env;
