export const getUserProfileAndRepos = async (req, res) => {

  const {username} = req.params;
  try {
    // 60 requests per hour, 5000 requests per hour for authenticated requests
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    });

    if (!userRes.ok) {
      return res
        .status(userRes.status)
        .json({ error: `Failed to fetch user profile: ${userRes.statusText}` });
    }

    const userProfile = await userRes.json();

    // Ensure repos_url is available
    if (!userProfile.repos_url) {
      return res
        .status(404)
        .json({ error: "Repositories URL not found in user profile" });
    }

    const repoRes = await fetch(userProfile.repos_url, {
      headers: {
        authorization: `token ${process.env.GITHUB_API_KEY}`,
      },
    });

    if (!repoRes.ok) {
      return res
        .status(repoRes.status)
        .json({ error: `Failed to fetch repositories: ${repoRes.statusText}` });
    }

    const repos = await repoRes.json();

    res.status(200).json({ userProfile, repos });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}