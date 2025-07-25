import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const sign = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
export const verify = (token) => jwt.verify(token, process.env.JWT_SECRET);
