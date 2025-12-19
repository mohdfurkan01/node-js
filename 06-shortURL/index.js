require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectMongoDb } = require("./connection");

const {
  checkForAuthentication,
  restrictTo,
} = require("./middleware/middleware");
const URL = require("./models/url");

const urlRoute = require("./routes/urlRoute");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT || 8082;
const MONGODB_URI = process.env.MONGODB_URI;

//middleware runs on every route, including /favicon.ico
// REDIRECT LOOP (INFINITE REDIRECT LOOP) — NOT AN ERROR IN LOGIN LOGIC.
//app is working fine, but browser keeps requesting /favicon.ico → middleware redirects → again → again → infinite loop → ERR_TOO_MANY_REDIRECTS.
//This is a very common issue in Express apps using authentication middleware.
app.get("/favicon.ico", (req, res) => res.status(204).end());

console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
console.log(`📡 Port: ${PORT}`);
//console.log(MONGODB_URI);

connectMongoDb(MONGODB_URI)
  .then(() => {
    console.log("MongoDb Connected");
  })
  .catch((err) => {
    console.log("Not connected MongoDb", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
//app.set("views", path.resolve("./views/auth"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/", staticRoute);
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);

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
