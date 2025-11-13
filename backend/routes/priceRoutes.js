const express = require("express");
const router = express.Router();
const priceFeed = require("../services/priceFeed");

router.get("/latest", (req, res) => {
  res.json({
    success: true,
    prices: priceFeed.getLatestPrices()
  });
});

module.exports = router;
