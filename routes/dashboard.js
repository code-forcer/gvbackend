const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Contact = require("../model/Contact");
const Newsletter = require("../model/Newsletter");
const Consultation = require("../model/Consultation");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// Get user details route
router.get("/api/dashboard", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email role");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// New route to get dashboard statistics
router.get("/api/dashboard/stats", verifyToken, async (req, res) => {
  try {
    const contactCount = await Contact.countDocuments();
    const newsletterCount = await Newsletter.countDocuments();
    const consultationCount = await Consultation.countDocuments();

    res.json({
      contacts: contactCount,
      newsletters: newsletterCount,
      consultations: consultationCount,
      message: "Dashboard statistics retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
