import express from "express";
import { getQuestCommits } from "../controllers/githubController.js";

const router = express.Router();

router.get("/commits/:owner/:repo/:username", getQuestCommits);

export default router;
