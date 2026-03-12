import express from "express";
import { getQuestCommits } from "../controllers/githubController.js";

const router = express.Router();

// github routes
router.get("/commits/:owner/:repo/:username", getQuestCommits);

export default router;
