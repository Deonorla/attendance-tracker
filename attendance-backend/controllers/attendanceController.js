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
    const { latitude, longitude, accuracy } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
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
      return res.status(400).json({
        success: false,
        message: "You must be within the office premises to sign in.",
      });
    }
    //    check if staff has already signed in today
    const existing = await User.findOne({
      _id: req.user.id,
      "attendance.date": { $gte: today },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already signed in today",
      });
    }

    // Record attendance
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        attendance: {
          date: new Date(),
          signIn: {
            time: new Date(),
            location: {
              latitude,
              longitude,
              accuracy,
            },
          },
          status: "partial", // Set status to partial if only signIn is recorded
        },
      },
    });

    res.json({ success: true, message: "Signed in successfully" });
  } catch (error) {
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
    await User.updateOne(
      { _id: req.user.id, "attendance.date": { $gte: today } },
      {
        $set: {
          "attendance.$.signOut": {
            time: new Date(),
            location: { latitude, longitude, accuracy },
          },
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
    const { month, week } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

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
