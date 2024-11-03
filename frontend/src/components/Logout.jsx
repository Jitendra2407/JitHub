import { MdLogout } from "react-icons/md";
// Todo Implement Logout functionality

const Logout = () => {
  return (
    <>
      <img
        src={"/user.jpg"}
        className="w-10 h-10 rounded-full border border-gray-800"
      />
      <div className="cursor-pointer flex items-center p-2 rounded-lg bg-glass mt-auto border border-gray-800">
        <MdLogout size={22} />
      </div>
    </>
  );
}

export default Logout