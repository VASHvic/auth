import { registerAs } from "@nestjs/config";

export default registerAs("config", () => {
  return {
    apiKey: process.env.API_KEY,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET_KEY,
    jwtExpiration: process.env.JWT_EXPIRATION_TIME,
  };
});
