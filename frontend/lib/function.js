export const handleLoginWithGithub = () => {
  window.open("/api/auth/github", "_self");
};

// // Update handleLoginWithGithub to accept an action
// export const handleLoginWithGithub = (action) => {
//   const url = `http://localhost:5000/api/auth/github?action=${action}`;
//   window.open(url, "_self");
// };
