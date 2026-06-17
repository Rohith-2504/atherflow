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

// API Route: Auth Signup
app.post('/api/auth/signup', (req, res) => {
  const { username, password, full_name, role } = req.body;
  if (!username || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const cleanUsername = username.trim().toLowerCase();
  const cleanFullName = full_name.trim();
  const selectedRole = role === 'admin' ? 'admin' : 'user';

  try {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username is already taken.' });
    }
    const stmt = db.prepare('INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)');
    stmt.run(cleanUsername, password, cleanFullName, selectedRole);

    return res.status(201).json({
      success: true,
      message: 'Signup successful!',
      user: { username: cleanUsername, full_name: cleanFullName, role: selectedRole }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// API Route: Auth Signin
app.post('/api/auth/signin', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }
  const cleanUsername = username.trim().toLowerCase();
  const requestedRole = role === 'admin' ? 'admin' : 'user';

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(cleanUsername);
    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    }

    // Security check: Verify user role matches the gate role they are entering
    if (user.role !== requestedRole) {
      return res.status(403).json({ 
        success: false, 
        message: `Unauthorized. This account does not have ${requestedRole} privileges.` 
      });
    }

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      user: { username: user.username, full_name: user.full_name, role: user.role }
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ success: false, message: 'Server error during signin.' });
  }
});

// API Route: Submit hypercar reservation allocation
app.post('/api/submissions', (req, res) => {
  const { full_name, mobile_number, email, city, message, tier } = req.body;
  
  const errors = {};

  // Clean inputs
  const cleanName = (full_name || '').trim();
  const cleanMobile = (mobile_number || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanCity = (city || '').trim();
  const cleanMessage = (message || '').trim();
  const cleanTier = (tier || 'standard').trim().toLowerCase();

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
    errors.message = 'Bespoke specifications are required.';
  } else if (cleanMessage.length < 10 || cleanMessage.length > 1000) {
    errors.message = 'Bespoke specifications must be between 10 and 1000 characters.';
  }

  if (!['standard', 'track', 'bespoke'].includes(cleanTier)) {
    errors.tier = 'Invalid allocation configuration spec selected.';
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
      INSERT INTO submissions (full_name, mobile_number, email, city, message, tier, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `);
    
    const result = stmt.run(cleanName, cleanMobile, cleanEmail, cleanCity, cleanMessage, cleanTier);
    
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your allocation request has been captured successfully.',
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

// API Route: Get all submissions (for admin registry inspection)
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

// API Route: Update reservation status (Admins only)
app.put('/api/submissions/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending', 'sold'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value.' });
  }
  try {
    const stmt = db.prepare('UPDATE submissions SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }
    return res.json({ success: true, message: 'Status updated successfully.' });
  } catch (err) {
    console.error('Status update error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
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
