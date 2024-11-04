import { useCallback, useEffect, useState } from "react";
import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import Spinner from "../components/Spinner"
import SortRepos from "../components/SortRepos";

const HomePage = () => {

  const [userProfile, setUserProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortType, setSortType] = useState("forks");

  const getUserProfileAndRepos = useCallback(async(username = "AyushIIITU") => {
    try {
      setLoading(true);
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const userProfile = await userRes.json();
      setUserProfile(userProfile);

      const repoRes = await fetch(userProfile.repos_url);
      const repos = await repoRes.json();
      setRepos(repos);

      // console.log("userProfile: ", userProfile);
      // console.log("repos: ", repos);

      return {userProfile, repos};

    } catch (error) {
      toast.error(error.message);
    } finally{
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    getUserProfileAndRepos();
  }, [getUserProfileAndRepos]);

  const onSearch = async (e, username) => {
    e.preventDefault();
    setLoading(true);
    setRepos([]);
    setUserProfile(null);

    const {userProfile, repos} = await getUserProfileAndRepos(username)

    console.log("repos from onSearch", repos)
    console.log("userProfile from onSearch", userProfile)

    setUserProfile(userProfile);
    setRepos(repos);
    setLoading(false);
  }

  return (
    <div className="m-4">
      <Search onSearch={onSearch}/>
      <SortRepos />
      <div className="flex gap-4 flex-col lg:flex-row justify-center items-start">
        {userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
        {!loading && <Repos repos={repos}/>}
        {loading && <Spinner />}
      </div>
    </div>
  );
}

export default HomePage;