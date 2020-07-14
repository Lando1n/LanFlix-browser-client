let settings;

firebase.auth().onAuthStateChanged(async (user) => {
  if (user && user.emailVerified) {
    $("#logged-in-username").text(user.email);
    $("#login-modal").hide();
    $("#banner").show();
    $("#topbar").show();
    $("#main").show();

    selectPage(null, "shows-page");
    // Check if the user exists yet, add it to list if not.
    const users = await getAllUsers();
    settings = await getSettings();
    console.log(settings);

    if (!users.includes(user.email)) {
      initializeUser();
    }
    console.log(`Successfully loggged in as ${JSON.stringify(user.email)}`);

    populateSubTable("#movies-tbl", "movies");
    populateSubTable("#shows-tbl", "shows");
  } else if (user) {
    window.location = "index.html";
    firebase.auth().signOut();
  } else {
    destroyTable("#movies-tbl");
    destroyTable("#shows-tbl");
    window.location = "index.html";
  }
});

$("#admin-select-btn").on("click", () => {
  window.location = "admin.html";
});

$("#movies-tbl").DataTable({
  iDisplayLength: 15,
  order: [[0, "asc"]],
  columns: [
    {
      data: "name",
      title: "Type",
    },
    {
      data: "subscribers",
      title: "Total Subscribers",
      searchable: false,
    },
    {
      data: "logo",
      title: "Subbed",
      className: "dt-right",
      searchable: false,
    },
    {
      data: "subbed",
      visible: false,
    },
  ],
  lengthChange: false,
  bFilter: false,
});

$("#shows-tbl").DataTable({
  iDisplayLength: 15,
  order: [[0, "asc"]],
  columns: [
    {
      data: "name",
      title: "Show Name",
    },
    {
      data: "subscribers",
      title: "Total Subscribers",
      searchable: false,
    },
    {
      data: "logo",
      title: "Subbed",
      className: "dt-right",
      searchable: false,
    },
    {
      data: "subbed",
      title: "Subbed",
      visible: false,
    },
  ],
  lengthChange: false,
});
