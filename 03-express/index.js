const express = require("express");

const app = express();

//The expression 8000 || PORT will always evaluate to 8000 because the || operator returns the first truthy value it encounters.
//Even if an environment variable PORT is set, it will be ignored because 8000 is a hardcoded truthy value.

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  return res.send("hello from Home page");
});

app.get("/about", (req, res) => {
  const name = req.query.name || "Guest";
  const age = req.query.age || "unknown";
  return res.send(`Hello from about page. Hey ${name}, you are ${age}`);
});
app.get("/contact", (req, res) => {
  res.send(`Hey ${req.query.name}`);
});

app.listen(PORT, () => console.log(`Server started at port no ${PORT}`));
