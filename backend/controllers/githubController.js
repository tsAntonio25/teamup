import { getRepoCommits } from "../services/githubService.js";

// get commits for a specific quest
export const getQuestCommits = async (req, res) => {
    try {
        const { owner, repo, username } = req.params;
        const commits = await getRepoCommits(owner, repo, username);

        res.json({
            repo: `${owner}/${repo}`,
            user: username,
            commits
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch GitHub commits",
            error: error.message
        });
    }
};