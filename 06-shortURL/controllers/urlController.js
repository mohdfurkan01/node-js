const shortid = require("shortid");
const URL = require("../models/url");

async function generateNewURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid(); //8 character
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
  });
  return res.status(201).json({ msg: "url is generated", id: shortID });
}

async function getAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
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
