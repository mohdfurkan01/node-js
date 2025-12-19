const shortid = require("shortid");
const URL = require("../models/url");

async function generateNewURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid(); //8 character
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitedHistory: [],
    createdBy: req.user._id,
  });
  //return res.status(201).json({ msg: "url is generated", id: shortID });
  // return res.render("home", {
  //   id: shortID,
  // });
  // Get updated URLs list
  const allUrls = await URL.find({ createdBy: req.user._id });

  return res.render("home", {
    id: shortID,
    user: req.user, // ✅ Pass user
    urls: allUrls, // ✅ Pass URLs
    success: "URL generated successfully!",
  });
}

async function getAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) {
    return res.status(404).json({ error: "URL not found" });
  }
  return res.status(200).json({
    msg: "success",
    totalCicks: result.visitedHistory.length,
    analytics: result.visitedHistory,
  });
}

module.exports = {
  generateNewURL,
  getAnalytics,
};
