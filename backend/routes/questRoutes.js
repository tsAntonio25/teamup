import express from "express";
import { createQuest, listQuests, getQuestById, updateQuest } from "../controllers/questController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// quest routes
router.post("/", protect, createQuest);
router.get("/", listQuests);
router.get("/:id", getQuestById);
router.put("/:id", protect, updateQuest);

export default router;