import axios from "axios";

// get num of commits on specific repo
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

// get total num of commits across all repos
export const getUserTotalCommits = async (username) => {

    const githubAPI = axios.create({
        baseURL: "https://api.github.com",
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json"
        }
    });

    // get all repos
    try {
        const reposResponse = await githubAPI.get(`/users/${username}/repos`, {
            params: { per_page: 100 }
        });

        // count commit for all repos
        const repos = reposResponse.data;
        const repoPromises = repos.map(repo =>
            countRepoCommits(githubAPI, repo.owner.login, repo.name, username)
        );

        // parallel + summation
        const results = await Promise.all(repoPromises);
        return results.reduce((sum, count) => sum + count, 0);

    } catch (error) {
        console.error("GitHub Contribution Error:", error.response?.data || error.message);
        throw error;
    }
};

// helper func
const countRepoCommits = async (api, owner, repo, username) => {

    let page = 1;
    let total = 0;

    while (true) {
        const response = await api.get(`/repos/${owner}/${repo}/commits`, {
            params: {
                author: username,
                per_page: 100,
                page
            }
        });

        const commits = response.data.length;
        total += commits;

        if (commits < 100) break;
        page++;
    }
    return total;
};
