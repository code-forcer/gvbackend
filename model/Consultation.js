// models/Consultation.js
const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  contactMethod: { 
    type: String, 
    required: true, 
    enum: ['call', 'googleMeet'],
    default: 'call'
  },
  acceptedTerms: { type: Boolean, required: true, default: false },
  status: { 
    type: String, 
    enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String, default: '' }, // For admin to add notes later
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
consultationSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("Consultation", consultationSchema);