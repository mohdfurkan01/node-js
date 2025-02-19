const express = require("express");
const path = require("path");

const { connectMongoDb } = require("./connection");
const urlRoute = require("./routes/urlRoute");

const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");
const exp = require("constants");

const app = express();
const PORT = process.env.PORT || 8082;

connectMongoDb("mongodb://127.0.0.1:27017/short-url-DB")
  .then(() => {
    console.log("MongoDb Connected");
  })
  .catch(() => {
    console.log("Not connected MongoDb", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitedHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry?.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
