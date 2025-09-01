import { Router, Response } from "express";
import { z, ZodError } from "zod";
import Note from "../models/Note";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

// ---------------- Get Notes ----------------
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Create Note ----------------
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = noteSchema.parse(req.body);
    const note = await Note.create({ userId: req.user?.id, title, content });
    return res.status(201).json(note);
  } catch (err) {
    if (err instanceof ZodError) return res.status(400).json({ errors: err.issues });
    console.error("Create note error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Update Note ----------------
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = noteSchema.partial().parse(req.body);
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { title, content },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.json(note);
  } catch (err) {
    if (err instanceof ZodError) return res.status(400).json({ errors: err.issues });
    console.error("Update note error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Delete Note ----------------
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
