import jwt from "jsonwebtoken";

export const createJwtToken = user =>
  jwt.sign({ data: user }, process.env.JWT_SECRET_KEY || "", {
    algorithm: "HS256",
    expiresIn: process.env.JWT_MAX_AGE,
  });
