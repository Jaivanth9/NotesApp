import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db/mongo";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";

const app = express();

app.use(cors({ origin: "https://notesappzz.vercel.app", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

const start = async () => {
  await connectDB();
  app.listen(Number(ENV.PORT), () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
};

start().catch((err) => console.error("Failed to start server:", err));
