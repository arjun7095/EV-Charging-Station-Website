const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Retailer = require('../models/Retailer');

const router = express.Router();

/// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found');
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          console.log('Password mismatch');
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
      res.json({
          token,
          user: {
              _id: user._id,
              name: user.name,
              email: user.email,
          },
          
      });
     
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


router.post('/retailer/login', async (req, res) => {
  const { email, password } = req.body;

try {
    const admin = await Retailer.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token ,email});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password,address, mobile } = req.body;
  try {
    const newUser = new User({ name, email, password,address, mobile}); 
    await newUser.save();
    res.status(201).send({ message: 'User registered successfully!' });
    console.log('User Added successfully');
  } catch (error) {
    res.status(400).send({ error: 'Error registering user.' });
  }
});
router.post('/retailer/register', async (req, res) => {
    const { name, email, password,address, mobile } = req.body;
    try {
      const newUser = new Retailer({ name, email, password,address, mobile}); 
      await newUser.save();
      res.status(201).send({ message: 'User registered successfully!' });
      console.log('User Added successfully');
    } catch (error) {
      res.status(400).send({ error: 'Error registering user.' });
    }
  });

module.exports = router;
