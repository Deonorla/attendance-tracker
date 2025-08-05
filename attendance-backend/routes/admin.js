// routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all staff attendance within date range
router.get("/attendance", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const staff = await User.aggregate([
      {
        $unwind: "$attendance",
      },
      {
        $match: {
          "attendance.date": {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          attendance: { $push: "$attendance" },
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    res.json(staff);
  } catch (error) {
    console.error("Admin attendance error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
