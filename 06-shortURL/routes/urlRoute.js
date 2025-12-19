const express = require("express");
const {
  generateNewURL,
  getAnalytics,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/", generateNewURL);

router.get("/analytics/:shortId", getAnalytics);

// Add this route for direct URL access
router.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitedHistory: { timestamp: Date.now() } } }
  );
  if (entry) {
    res.redirect(entry.redirectURL);
  } else {
    res.status(404).send("URL not found");
  }
});
module.exports = router;
