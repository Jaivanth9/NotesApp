import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;  // 👈 force it as string
  EMAIL_HOST: string;
  EMAIL_PORT?: number;
  EMAIL_SECURE: boolean;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  GOOGLE_CLIENT_ID: string;
  OTP_TTL_MINUTES: number;
}

export const ENV: EnvConfig = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesdb",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",  // ✅ now TS sees string only
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined,
  EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
  EMAIL_USER: process.env.EMAIL_USER || "jaivanthkoppula999@gmail.com",
  EMAIL_PASS: process.env.EMAIL_PASS || "oiuh qkip skdu iatr",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "83609030322-89bpmr0ue5vrjhckd88ql94of3mm44ih.apps.googleusercontent.com",
  OTP_TTL_MINUTES: Number(process.env.OTP_TTL_MINUTES || 5),
};
