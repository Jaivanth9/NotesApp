import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { z, ZodError } from "zod";
import User from "../models/User";
import OtpToken from "../models/OtpToken";
import { generateOtp } from "../utils/otp";
import { sendMail } from "../utils/mailer";
import { ENV } from "../config/env";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

// ----------------- Schemas -----------------
const sendOtpSchema = z.object({ email: z.string().email() });
const verifyOtpSchema = z.object({ email: z.string().email(), code: z.string().length(6) });
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  otp: z.string().length(6),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
const googleSchema = z.object({ idToken: z.string().min(1) });

// ----------------- JWT Helper -----------------
const makeJwt = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (ENV.JWT_EXPIRES_IN as StringValue) || "1h", // 👈 cast here
  };

  return jwt.sign(payload, ENV.JWT_SECRET, options);
};

// ----------------- Routes -----------------

// Send OTP
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { email } = sendOtpSchema.parse(req.body);
    console.log("Parsed email:", email);

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + ENV.OTP_TTL_MINUTES * 60 * 1000);

    const tokenDoc = await OtpToken.create({ email, code, expiresAt });
    console.log("OTP saved:", tokenDoc);

    await sendMail(email, "Your OTP", `Your OTP is ${code} (valid ${ENV.OTP_TTL_MINUTES} min)`);
    console.log("Email sent successfully");

    return res.json({ message: "OTP sent" });
  } catch (err: any) {
    console.error("Send OTP failed:", err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    return res.status(500).json({ error: "Server error: " + err.message });
  }
});


// Verify OTP
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, code } = verifyOtpSchema.parse(req.body);

    const tokenDoc = await OtpToken.findOne({ email, code });
    if (!tokenDoc) return res.status(400).json({ error: "Invalid OTP" });
    if (tokenDoc.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });

    await tokenDoc.deleteOne();
    return res.json({ message: "OTP verified" });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Register with OTP
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, otp } = registerSchema.parse(req.body);

    const tokenDoc = await OtpToken.findOne({ email, code: otp });
    if (!tokenDoc) return res.status(400).json({ error: "Invalid OTP" });
    if (tokenDoc.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });

    await tokenDoc.deleteOne();

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    const userId = String(user._id);
    const token = makeJwt({ id: userId, email: user.email });

    return res.status(201).json({
      token,
      user: { id: userId, email: user.email, name: user.name },
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const userId = String(user._id);
    const token = makeJwt({ id: userId, email: user.email });

    return res.json({
      token,
      user: { id: userId, email: user.email, name: user.name },
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Google login / signup
router.post("/google", async (req: Request, res: Response) => {
  try {
    const { idToken } = googleSchema.parse(req.body);

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Invalid Google token" });
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const userId = String(user._id);
    const token = makeJwt({ id: userId, email: user.email });

    return res.json({
      token,
      user: { id: userId, email: user.email, name: user.name },
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ errors: err.issues });
    }
    console.error("Google login error:", err);
    return res.status(500).json({ error: "Google login failed" });
  }
});

export default router;
