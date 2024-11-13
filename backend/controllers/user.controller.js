import User from "../models/user.model.js"

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

export const likeProfile = async (req, res) => {
  try {
    const {username} = req.params;
    const user = await User.findById(req.user._id.toString());
    console.log(user, "auth user");
    const userToLike = await User.findOne({username: username});

    if(!userToLike){
      return res.status(404).json({error: "User is not a member"});
    }

    if(user.likedProfiles.includes(userToLike.username)){
      return res.status(400).json({error: "User already liked"});
    }

    userToLike.likedBy.push({username: user.username, avatarUrl: user.avatarUrl, likedData: Date.now()});
    user.likedProfiles.push(userToLike.username);

    // await userToLike.save();
    // await user.save();
    await Promise.all([userToLike.save(), user.save()]);

    res.status(200).json({message: "user liked"});

  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

export const getLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user_id.toString());
    res.status(200).json({likedBy: user.likedBy})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}