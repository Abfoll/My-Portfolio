const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Register (for initial setup)
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({message:"All fields are required."})
    }
    
    if(!validator.isEmail(email)){
      return res.status(400).json({message:"Please enter valid email address."})
    }

    if(!validator.isStrongPassword(password)){
      return res.status(400).json({message:"Please enter strong password."})
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user', auth ,async (req, res) => {
  try {

   
    return res.json({user:req.user})
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user's email/password (admin uses this to update credentials)
router.put('/me', auth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) {
      if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email' });
      user.email = email;
    }
    if (password) {
      if (!validator.isStrongPassword(password)) return res.status(400).json({ message: 'Password not strong enough' });
      const hashed = await bcrypt.hash(password, 12);
      user.password = hashed;
    }

    await user.save();
    return res.json({ message: 'Profile updated', user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
