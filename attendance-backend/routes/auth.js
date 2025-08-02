const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { isWithinRadius } = require("../utils/geoUtils");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Get from environment variables
const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT);
const OFFICE_LON = parseFloat(process.env.OFFICE_LON);
const OFFICE_RADIUS = parseInt(process.env.OFFICE_RADIUS); // in meters

// Register a new staff
router.post("/register", async (req, res) => {
  const { name, email, password, location } = req.body;

  // Validate location
  if (!location || !location.latitude || !location.longitude) {
    return res
      .status(400)
      .json({ success: false, message: "Location data required" });
  }

  // Verify location
  if (
    !isWithinRadius(
      location.latitude,
      location.longitude,
      OFFICE_LAT,
      OFFICE_LON,
      OFFICE_RADIUS
    )
  ) {
    return res.status(403).json({
      success: false,
      message: "Must be within office premises to register",
    });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists, pls login" });
    }

    const user = await User.create({
      name,
      email,
      password,
      signupLocation: location,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login staff
router.post("/login", async (req, res) => {
  const { email, password, location } = req.body;

  // Validate location
  if (!location || !location.latitude || !location.longitude) {
    return res
      .status(400)
      .json({ success: false, message: "Location data required" });
  }

  // Verify location
  if (
    !isWithinRadius(
      location.latitude,
      location.longitude,
      OFFICE_LAT,
      OFFICE_LON,
      OFFICE_RADIUS
    )
  ) {
    return res.status(403).json({
      success: false,
      message: "Must be within office premises to login",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Update last login location
    user.lastLoginLocation = location;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
