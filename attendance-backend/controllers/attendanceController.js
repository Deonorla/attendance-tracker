const User = require("../models/User");
const { isWithinRadius } = require("../utils/geoUtils");

// Office location from environment variables
const OFFICE_LOCATION = {
  lat: parseFloat(process.env.OFFICE_LAT),
  lng: parseFloat(process.env.OFFICE_LON),
  radius: parseFloat(process.env.OFFICE_RADIUS),
};

// signIn  to handle staff sign-in attendance
exports.signIn = async (req, res) => {
  try {
    console.log("Received sign-in request:", req.body); // Log incoming data

    const { latitude, longitude, accuracy } = req.body;

    // Validate required fields
    if (!latitude || !longitude) {
      console.error("Missing coordinates");
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verify office proximity
    if (
      !isWithinRadius(
        latitude,
        longitude,
        OFFICE_LOCATION.lat,
        OFFICE_LOCATION.lng,
        OFFICE_LOCATION.radius
      )
    ) {
      console.error("Outside office radius");
      return res.status(400).json({
        success: false,
        message: "You must be within the office premises to sign in.",
      });
    }

    // Check existing attendance
    const existing = await User.findOne({
      _id: req.user.id,
      "attendance.date": { $gte: today },
    });

    if (existing) {
      const lastSignIn = existing.attendance.find(
        (a) => a.date >= today && a.signIn
      )?.signIn?.time;

      return res.status(400).json({
        success: false,
        message: "Already signed in today",
        lastSignInTime: lastSignIn, // Add this
        code: "ALREADY_SIGNED_IN", // Add error code
      });
    }

    // Record attendance
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        attendance: {
          date: new Date(),
          signIn: {
            time: new Date(),
            location: { latitude, longitude, accuracy },
          },
          status: "partial",
        },
      },
    });

    console.log("Sign-in successful for user:", req.user.id);
    res.json({ success: true, message: "Signed in successfully" });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// signOut to handle staff sign-out attendance

exports.signOut = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verify if the user is within the office radius
    if (
      !isWithinRadius(
        latitude,
        longitude,
        OFFICE_LOCATION.lat,
        OFFICE_LOCATION.lng,
        OFFICE_LOCATION.radius
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "you must be within the office premises to sign out",
      });
    }
    // find the user's attendance record for today
    const user = await User.findOne({
      _id: req.user.id,
      "attendance.date": { $gte: today },
      "attendance.signOut": { $exists: false },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No active sign-in found for today",
      });
    }

    // Update the attendance record with sign-out details
    await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "attendance.date": { $gte: today },
      },
      {
        $set: {
          "attendance.$.signOut": {
            time: new Date(),
            location: { latitude, longitude, accuracy },
          },
          "attendance.$.status": "present", // Force status update
        },
      }
    );
    res.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// getAttendance History

exports.getHistory = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1); // First day of month
    const endDate = new Date(year, month, 0); // Last day of month

    const user = await User.findOne(
      { _id: req.user.id },
      {
        attendance: {
          $filter: {
            input: "$attendance",
            as: "record",
            cond: {
              $and: [
                { $gte: ["$$record.date", startDate] },
                { $lte: ["$$record.date", endDate] },
              ],
            },
          },
        },
      }
    );
    res.json({ success: true, attendance: user.attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
