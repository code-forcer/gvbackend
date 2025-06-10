const express = require("express");
const multer = require("multer");
const Blog = require("../model/Blog");

const router = express.Router();

// Set up Multer Storage
const storage = multer.memoryStorage(); // Store file in memory (or use diskStorage)
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit
router.post("/api/blogs/submit", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Image is required" });

    const { title, content, socialLinks } = req.body;
    const image = req.file.buffer.toString("base64"); // Convert to base64

    const newBlog = new Blog({ title, content, image, socialLinks });
    await newBlog.save();

    res.status(201).json({ success: true, message: "Blog created", blog: newBlog });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Error creating blog", error });
  }
});


// Get All Blogs
router.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blogs", error });
  }
});

module.exports = router;
