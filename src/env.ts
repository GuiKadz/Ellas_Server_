import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  DB_URL: z.string().url().min(1),
  JWT_SECRET_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  AUTH_REDIRECT_URL: process.env.AUTH_REDIRECT_LINK,
  DB_URL:  process.env.DB_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY
});
