const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Helper validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidMobile(mobile) {
  // Matches optional +, followed by 7 to 15 digits. Allows spaces, hyphens, and parentheses for formatting.
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  // Ensure we have at least 7 digits in the string
  const digitsOnly = mobile.replace(/\D/g, '');
  return phoneRegex.test(mobile) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

// API Route: Submit lead capture form
app.post('/api/submissions', (req, res) => {
  const { full_name, mobile_number, email, city, message } = req.body;
  
  const errors = {};

  // Clean inputs
  const cleanName = (full_name || '').trim();
  const cleanMobile = (mobile_number || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanCity = (city || '').trim();
  const cleanMessage = (message || '').trim();

  // Server-side validation
  if (!cleanName) {
    errors.full_name = 'Full Name is required.';
  } else if (cleanName.length < 2 || cleanName.length > 100) {
    errors.full_name = 'Full Name must be between 2 and 100 characters.';
  } else if (!/^[a-zA-Z\s\-'.]+$/.test(cleanName)) {
    errors.full_name = 'Full Name contains invalid characters.';
  }

  if (!cleanMobile) {
    errors.mobile_number = 'Mobile Number is required.';
  } else if (!isValidMobile(cleanMobile)) {
    errors.mobile_number = 'Please enter a valid mobile number (7-15 digits).';
  }

  if (!cleanEmail) {
    errors.email = 'Email Address is required.';
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!cleanCity) {
    errors.city = 'City is required.';
  } else if (cleanCity.length < 2 || cleanCity.length > 50) {
    errors.city = 'City must be between 2 and 50 characters.';
  }

  if (!cleanMessage) {
    errors.message = 'Message is required.';
  } else if (cleanMessage.length < 10 || cleanMessage.length > 1000) {
    errors.message = 'Message must be between 10 and 1000 characters.';
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors
    });
  }

  try {
    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO submissions (full_name, mobile_number, email, city, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(cleanName, cleanMobile, cleanEmail, cleanCity, cleanMessage);
    
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your lead request has been captured successfully.',
      submissionId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Database insertion error:', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while saving your submission. Please try again.'
    });
  }
});

// API Route: Get all submissions (for admin validation and walkthrough)
app.get('/api/submissions', (req, res) => {
  try {
    const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
    return res.json({
      success: true,
      data: submissions
    });
  } catch (err) {
    console.error('Database fetch error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve submissions.'
    });
  }
});

// Serve static files from client build in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Fallback to React router
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
