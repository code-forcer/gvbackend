const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../model/User');

const router = express.Router();

// Gmail transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not regular password)
  }
});

// Welcome email HTML template
const getWelcomeEmailHTML = (userName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to GreenVisa</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .header {
      background: linear-gradient(135deg, #28a745, #20c997);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .logo {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .tagline {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-title {
      font-size: 28px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }
    .welcome-text {
      font-size: 16px;
      color: #555;
      margin-bottom: 30px;
      text-align: center;
    }
    .features {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 25px;
      margin: 30px 0;
    }
    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px 0;
    }
    .feature-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #28a745, #20c997);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      color: white;
      font-weight: bold;
    }
    .feature-text {
      flex: 1;
      font-size: 14px;
      color: #555;
    }
    .cta-section {
      text-align: center;
      margin: 30px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      text-decoration: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
      transition: transform 0.2s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer-links {
      margin-bottom: 20px;
    }
    .footer-links a {
      color: #28a745;
      text-decoration: none;
      margin: 0 15px;
      font-size: 14px;
    }
    .contact-info {
      font-size: 12px;
      color: #888;
      margin-bottom: 20px;
    }
    .social-icons {
      margin-top: 20px;
    }
    .social-icon {
      display: inline-block;
      width: 35px;
      height: 35px;
      background: #28a745;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 35px;
      margin: 0 5px;
      text-decoration: none;
      font-size: 14px;
    }
    @media (max-width: 600px) {
      .container {
        margin: 20px;
        border-radius: 8px;
      }
      .header {
        padding: 30px 20px;
      }
      .content {
        padding: 30px 20px;
      }
      .welcome-title {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌿 GreenVisa</div>
      <p class="tagline">Your Gateway to Global Green Solutions</p>
    </div>
    
    <div class="content">
      <h1 class="welcome-title">Welcome aboard, ${userName}! 🎉</h1>
      <p class="welcome-text">
        Thank you for joining GreenVisa! We're thrilled to have you as part of our community dedicated to making visa processes smoother and more sustainable.
      </p>
      
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">✓</div>
          <div class="feature-text">
            <strong>Fast Processing:</strong> Get your visa applications processed quickly and efficiently
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🌍</div>
          <div class="feature-text">
            <strong>Global Coverage:</strong> Access visa services for destinations worldwide
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <div class="feature-text">
            <strong>Digital First:</strong> Manage everything from your dashboard - paperless and convenient
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔒</div>
          <div class="feature-text">
            <strong>Secure & Safe:</strong> Your documents and data are protected with enterprise-grade security
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <a href="https://greenvisa.com/dashboard" class="cta-button">
          Get Started Now →
        </a>
      </div>
      
      <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
        Need help getting started? Our support team is here to assist you every step of the way.
      </p>
    </div>
    
    <div class="footer">
      <div class="footer-links">
        <a href="https://greenvisa.com/help">Help Center</a>
        <a href="https://greenvisa.com/contact">Contact Us</a>
        <a href="https://greenvisa.com/privacy">Privacy Policy</a>
      </div>
      
      <div class="contact-info">
        📧 support@greenvisa.com | 📞 +1 (555) 123-4567<br>
        GreenVisa Inc. | Making Global Travel Sustainable
      </div>
      
      <div class="social-icons">
        <a href="#" class="social-icon">f</a>
        <a href="#" class="social-icon">t</a>
        <a href="#" class="social-icon">in</a>
        <a href="#" class="social-icon">@</a>
      </div>
      
      <p style="font-size: 11px; color: #aaa; margin-top: 20px;">
        This email was sent to you because you registered for a GreenVisa account.<br>
        If you didn't create an account, please contact our support team immediately.
      </p>
    </div>
  </div>
</body>
</html>`;
};

// Function to send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: {
      name: 'GreenVisa Team',
      address: process.env.GMAIL_USER
    },
    to: userEmail,
    subject: '🌿 Welcome to GreenVisa - Your Journey Begins Now!',
    html: getWelcomeEmailHTML(userName),
    text: `Welcome to GreenVisa, ${userName}!

Thank you for joining our community. We're excited to help you with your visa needs.

What you can do with GreenVisa:
- Fast visa processing
- Global coverage for destinations worldwide  
- Digital-first approach - manage everything online
- Secure document handling

Get started at: https://greenvisa.com/dashboard

Need help? Contact us at support@greenvisa.com

Best regards,
The GreenVisa Team`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// POST route for user registration
router.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Simple validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already in use' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Send welcome email
    const emailResult = await sendWelcomeEmail(email, name);
    
    if (emailResult.success) {
      console.log(`Welcome email sent to ${email} with message ID: ${emailResult.messageId}`);
    } else {
      console.error(`Failed to send welcome email to ${email}:`, emailResult.error);
      // Note: We don't fail registration if email fails - just log the error
    }

    // Send success response
    res.status(201).json({ 
      message: 'Registration successful!',
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;