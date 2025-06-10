require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Increase the body size limit BEFORE other middlewares
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Serve the 'uploads' folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
const newsletterRoute = require('./routes/newsletter');
const contactRoute = require('./routes/contact');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const consultationRoute = require('./routes/consultation');
const dashboardRoute = require('./routes/dashboard');
const blogRoutes = require("./routes/blog");

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the GreenVisa backend!");
});

// Routes Middleware
app.use(consultationRoute);
app.use(newsletterRoute);
app.use(contactRoute);
app.use(registerRoute);
app.use(loginRoute);
app.use(dashboardRoute);
app.use(blogRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
