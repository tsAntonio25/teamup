import axios from "axios";

export const getRepoCommits = async (owner, repo, username) => {
    const githubAPI = axios.create({
        baseURL: "https://api.github.com",
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
        }
    });

    try {
        const response = await githubAPI.get(`/repos/${owner}/${repo}/commits`, {
            params: { author: username, per_page: 100 }
        });

        return response.data.length;

    } catch (error) {
        console.error("GitHub Service Error:", error.response?.data);
        throw error;
    }
};