const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const protect = require("../middleware/authMiddleware");

// protected route for staff sign-in
router.post("/sign-in", protect, attendanceController.signIn);
router.post("/sign-out", protect, attendanceController.signOut);
router.get("/history", protect, attendanceController.getHistory);

module.exports = router;
