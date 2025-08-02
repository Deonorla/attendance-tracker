const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
    req.user = await User.findById(decoded.id).select("-password"); // Fetch user without password
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;
