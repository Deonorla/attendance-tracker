require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const attendanceRoutes = require("./routes/attendance");

const app = express(); // Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Required for cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  })
);

// Use auth routes
app.use("/api/auth", authRoutes);

// Use attendance routes
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
