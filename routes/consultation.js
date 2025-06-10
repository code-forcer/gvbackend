const express = require("express");
const Consultation = require("../model/Consultation");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// Middleware to parse JSON
router.use(bodyParser.json());

// Email configuration (you'll need to set up your email service)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.GMAIL_USER, // Your email
      pass: process.env.GMAIL_APP_PASSWORD  // Your app password
    }
  });
};

// HTML Email Template
const createEmailTemplate = (consultationData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Green Card Visa Consultation Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #16a085, #27ae60); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .info-box { background: #f8f9fa; border-left: 4px solid #27ae60; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #16a085; }
        .cta-button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .contact-info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Consultation Request Received!</h1>
            <p>Thank you for choosing our Green Card Visa consultation services</p>
        </div>
        
        <div class="content">
            <div class="info-box">
                <h2 style="color: #16a085; margin-top: 0;">Hello ${consultationData.name}!</h2>
                <p>We have successfully received your consultation request. Our expert team will review your information and contact you within 24-48 hours.</p>
            </div>
            
            <h3 style="color: #16a085;">Your Consultation Details:</h3>
            
            <div class="detail-row">
                <span class="detail-label">Full Name:</span>
                <span>${consultationData.name}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span>${consultationData.email}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span>${consultationData.phone}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Preferred Contact Method:</span>
                <span>${consultationData.contactMethod === 'call' ? '📞 Phone Call' : '💻 Google Meet'}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Request Date:</span>
                <span>${new Date(consultationData.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
            </div>
            
            <div class="contact-info">
                <h3 style="margin-top: 0; color: #16a085;">What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Our immigration specialist will review your case</li>
                    <li>We'll contact you via your preferred method within 24-48 hours</li>
                    <li>We'll schedule a detailed consultation at your convenience</li>
                    <li>Receive personalized guidance for your Green Card journey</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="mailto:support@yourcompany.com" class="cta-button">Contact Us Directly</a>
            </div>
            
            <div class="info-box">
                <h3 style="color: #16a085; margin-top: 0;">Need Immediate Assistance?</h3>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Email:</strong> support@yourcompany.com</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Green Card Visa Consultation Services</strong></p>
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
            <p>If you have any questions, please contact us at support@yourcompany.com</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © 2025 Green Card Visa Services. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

// POST: Submit Consultation Form
router.post("/consultations/submit", async (req, res) => {
  const { name, email, phone, contactMethod, acceptedTerms } = req.body;

  // Validate input
  if (!name || !email || !phone || !contactMethod || !acceptedTerms) {
    return res.status(400).json({ 
      error: "All fields are required and terms must be accepted." 
    });
  }

  // Validate email format
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Validate phone format
  const phoneRegex = /^\+?[\d\s\-]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format." });
  }

  try {
    // Create new consultation
    const newConsultation = new Consultation({ 
      name, 
      email, 
      phone, 
      contactMethod, 
      acceptedTerms 
    });
    
    const savedConsultation = await newConsultation.save();

    // Send confirmation email
    try {
      const transporter = createEmailTransporter();
      const htmlContent = createEmailTemplate(savedConsultation);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '✅ Green Card Visa Consultation Request Confirmed',
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent to:', email);
      
      // Optional: Send notification to admin
      const adminMailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
        subject: '🔔 New Consultation Request Received',
        html: `
          <h2>New Consultation Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Contact Method:</strong> ${contactMethod}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      };
      
      await transporter.sendMail(adminMailOptions);
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the entire request if email fails
    }

    res.status(201).json({ 
      message: "Consultation request submitted successfully! Check your email for confirmation.",
      consultationId: savedConsultation._id
    });

  } catch (error) {
    console.error("Error saving consultation:", error);
    res.status(500).json({ error: "Failed to save consultation data." });
  }
});

// GET: Retrieve All Consultations (Admin)
router.get("/consultations/", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ error: "Failed to fetch consultations." });
  }
});

// PUT: Update consultation status (Admin)
router.put("/consultations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updatedConsultation = await Consultation.findByIdAndUpdate(
      id, 
      { status, notes, updatedAt: Date.now() }, 
      { new: true }
    );
    
    if (!updatedConsultation) {
      return res.status(404).json({ error: "Consultation not found." });
    }
    
    res.json({ 
      message: "Consultation updated successfully!", 
      consultation: updatedConsultation 
    });
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ error: "Failed to update consultation." });
  }
});

// DELETE: Remove a Consultation by ID (Admin)
router.delete("/consultations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConsultation = await Consultation.findByIdAndDelete(id);
    
    if (!deletedConsultation) {
      return res.status(404).json({ error: "Consultation not found." });
    }
    
    res.json({ message: "Consultation deleted successfully!" });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    res.status(500).json({ error: "Failed to delete consultation." });
  }
});

module.exports = router;