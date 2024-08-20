const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Expense, Category, Budget, PaymentMethod } = require('../models');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/authMiddleware');


// Signup route for Rendering the Template and receiving Post Data
router.route('/signup')
  .get((req, res) => {
    // Render the signup template when the request method is GET
    res.render('signup');
  })
  .post(async (req, res) => {
    // Handle the signup form submission when the request method is POST
    const { username, email, password } = req.body;
    
    try {
      console.log('Received signup request:', { username, email, password });

      // Validate input
      if (!username || !email || !password) {
        console.log('Validation error: Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({ message: 'User already exists' });
      }
      // Create a new user
      const newUser = await User.create({
        username,
        email,
        password: password // Store the hashed password
      });

      console.log('Created new user:', newUser);
      // Redirect after successful user registration
      // Redirect after session is destroyed
      res.redirect('/api/user/login');
      
    } catch (error) {
      console.error('Error in signup route:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Login for Rendering the Template and receiving Post Data
router.route('/login')
  .get((req, res) => {
    // Render the login template when the request method is GET
    res.render('login');
  })
  .post(async (req, res) => {
    // Handle the login form submission when the request method is POST
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    try {
      const user = await User.findOne({ where: { email } });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      console.log('User pass:', user.password);
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed password:', hashedPassword);
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', passwordMatch ? 'Yes' : 'No');
      
      if (!passwordMatch) {
        console.log('Password does not match');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate a token
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION 
      });
      
      // Send the token as a cookie
      res.cookie('token', token, { httpOnly: true });
      console.log('Token generated and sent as cookie');
      req.session.userId = user.user_id;
      res.redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// User logout
// router.post('/logout', (req, res) => {
//   res.clearCookie('token');
//   res.json({ message: 'Logout successful' });
// });
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/api/user/login');
  });
});

// User Delete Account
router.get('/delete', isAuthenticated, async (req, res) => {
  const user_id = req.user.userId; // Access user ID
  console.log('User ID:', user_id);
  
  try {
    // Find the user by the ID from req.user.id
    const user = await User.findByPk(user_id);
    
    if (user) {
      // Delete associated data
      try {
        if (Budget) await Budget.destroy({ where: { user_id } });
      } catch (error) {
        console.warn('Budget model is not defined or an error occurred:', error.message);
      }
      
      try {
        if (Category) await Category.destroy({ where: { user_id } });
      } catch (error) {
        console.warn('Category model is not defined or an error occurred:', error.message);
      }
      
      try {
        if (Expense) await Expense.destroy({ where: { user_id } });
      } catch (error) {
        console.warn('Expense model is not defined or an error occurred:', error.message);
      }
      
      try {
        if (PaymentMethod) await PaymentMethod.destroy({ where: { user_id } });
      } catch (error) {
        console.warn('PaymentMethod model is not defined or an error occurred:', error.message);
      }
      // Delete user
      await user.destroy();
      // Clear the cookie and destroy the session
      res.clearCookie('token');
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ error: 'Server error' });
        }
        // Redirect after session is destroyed
        res.redirect('/api/user/login');
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', isAuthenticated, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: ['user_id', 'username', 'email', 'created_at', 'updated_at']
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;