// Check if the user has admin privileges
$("#home-btn").on("click", () => {
  window.location = "main.html";
});

getSettings().then((settings) => {
  console.log(settings);
});
