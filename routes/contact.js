// routes/contact.js
const express = require('express');
const Contact = require('../model/Contact');
const nodemailer = require('nodemailer');
const router = express.Router();
const bodyParser = require('body-parser');

// Middleware to parse JSON
router.use(bodyParser.json());

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.GMAIL_USER, // your email
    pass: process.env.GMAIL_APP_PASSWORD  // your app password
  }
});

// HTML Email Template
const getEmailTemplate = (name, subject, message) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Us</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #16a085, #27ae60);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            .message-box {
                background-color: #f8f9fa;
                border-left: 4px solid #27ae60;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            .message-box h3 {
                color: #27ae60;
                margin: 0 0 10px 0;
                font-size: 16px;
            }
            .message-content {
                color: #555;
                font-style: italic;
            }
            .info-section {
                background-color: #e8f5e8;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .info-section h3 {
                color: #27ae60;
                margin: 0 0 15px 0;
            }
            .contact-info {
                color: #555;
                margin: 5px 0;
            }
            .contact-info strong {
                color: #2c3e50;
            }
            .footer {
                background-color: #2c3e50;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 14px;
            }
            .footer a {
                color: #27ae60;
                text-decoration: none;
            }
            .checkmark {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #27ae60;
                margin: 0 auto 20px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="checkmark">✓</div>
                <h1>Thank You for Reaching Out!</h1>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello <strong>${name}</strong>,
                </div>
                
                <p>Thank you for contacting us! We have successfully received your message and appreciate you taking the time to reach out to us.</p>
                
                <div class="message-box">
                    <h3>Your Message Summary:</h3>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div class="message-content">
                        "${message}"
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>What happens next?</h3>
                    <p>Our team will review your message and get back to you within <strong>24-48 hours</strong>. We strive to provide prompt and helpful responses to all inquiries.</p>
                </div>
                
                <div class="info-section">
                    <h3>Need immediate assistance?</h3>
                    <div class="contact-info">
                        <strong>Email:</strong> <a href="mailto:support@greenvisa.com">support@greenvisa.com</a>
                    </div>
                    <div class="contact-info">
                        <strong>WhatsApp:</strong> <a href="https://wa.me/13462448704">+1 (346) 244-8704</a>
                    </div>
                </div>
                
                <p>Thank you for choosing our services. We look forward to assisting you!</p>
                
                <p>Best regards,<br>
                <strong>The GreenVisa Team</strong></p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 GreenVisa. All rights reserved.</p>
                <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// POST route for handling contact form submissions
router.post('/api/contact/submit', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate the data
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Save the contact data to the database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Send confirmation email to the user
    const mailOptions = {
      from: `"GreenVisa Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting GreenVisa - We\'ve Received Your Message',
      html: getEmailTemplate(name, subject, message)
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send notification to admin
    const adminMailOptions = {
      from: `"GreenVisa Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message}
        </div>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ 
      message: 'Your message has been sent successfully! Please check your email for confirmation.' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // If database save succeeded but email failed
    if (error.code === 'EAUTH' || error.code === 'ECONNECTION') {
      res.status(200).json({ 
        message: 'Your message has been sent successfully! However, we couldn\'t send a confirmation email. We\'ll still get back to you soon.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send message. Please try again later.' 
      });
    }
  }
});

// GET route to fetch all contact messages
router.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to retrieve contact messages.' });
  }
});

// DELETE route to remove a contact by ID
router.delete('/api/contact/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact deleted successfully!' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact.' });
  }
});

module.exports = router;