Feature("Requests").tag("MoviesPage");

Before(({ I, loginAs, home }) => {
  loginAs("default");
  I.see("No data available in table");
  I.click(home.toolbar.movies);
  I.seeElement(home.movies.table);
  I.see("No data available in table");
});

After(({ I, home }) => {
  I.click(home.modals.requestMovie.first.cancel);
  I.dontSeeElement(home.modals.requestMovie.modal);
});

Scenario("Clicking request show button brings up modal", ({ I, home }) => {
  I.click(home.toolbar.requestShow);
  I.seeElement(home.modals.requestMovie.modal);
});

Scenario("Clicking request movie button brings up modal", ({ I, home }) => {
  I.click(home.toolbar.requestMovie);
  I.seeElement(home.modals.requestMovie.modal);
});
