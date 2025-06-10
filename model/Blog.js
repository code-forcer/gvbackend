const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true }, // Store Base64 string
    socialLinks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
