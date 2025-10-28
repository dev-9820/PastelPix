const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/search", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { term } = req.body;

    if (!term || term.trim() === "")
      return res.status(400).json({ message: "Search term is required." });

    await User.findByIdAndUpdate(
      userId,
      { $push: { searches: term.trim() } },
      { new: true }
    );

    res.status(200).json({ message: "Search term saved successfully." });
  } catch (err) {
    console.error("Error in /search:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("searches createdAt updatedAt");

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({
      searches: user.searches.reverse(), // for latest
    });
  } catch (err) {
    console.error("Error in /history:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/top-searches", async (req, res) => {
  try {
    // aggregate searches across all users
    const results = await User.aggregate([
      { $unwind: "$searches" },
      { $group: { _id: "$searches", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topSearches = results.map((r) => ({
      term: r._id,
      count: r.count,
    }));

    res.status(200).json(topSearches);
  } catch (err) {
    console.error("Error in /top-searches:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
