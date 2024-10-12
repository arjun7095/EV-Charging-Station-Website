const express = require('express');
const router = express.Router();
const Bunk = require('../models/Bunk');

// Save retailer details
router.post('/add', async (req, res) => {
    const { bunkName, email, mobileNumber, address, numberOfSlots, availableSlots, location } = req.body;
    console.log('Received bunk name:', bunkName);
    
    try {
        // Check if a retailer with the same email already exists
        const existingBunk = await Bunk.findOne({ email });
        if (existingBunk) {
            return res.status(400).send({ success: false, error: 'Email already exists. Please use a different email.' });
        }

        // If no existing bunk found, create a new one
        const newUser = new Bunk({ bunkName, email, mobileNumber, address, numberOfSlots, availableSlots, location }); 
        await newUser.save();
        
        res.status(201).send({ success: true, message: 'Bunk added successfully!' });
        console.log('Bunk added successfully');
    } catch (error) {
        console.error('Error while adding bunk:', error);
        res.status(500).send({ success: false, error: 'Error registering user.' });
    }
});

// Get all bunks
router.get('/specific/', async (req, res) => {
    const email = req.query.email; // Get email from query parameters
    try {
        // Find retailer by email
        const bunks = await Bunk.find({ email: email });
        res.status(200).json(bunks);
    } catch (error) {
        console.error('Error fetching bunks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Update bunk details
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const updatedBunk = await Bunk.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedBunk) {
          return res.status(404).send({ error: 'Bunk not found.' });
      }
      res.status(200).send({ success: true, message: 'Bunk updated successfully!', data: updatedBunk });
  } catch (error) {
      res.status(400).send({ error: 'Error updating bunk.' });
  }
});

// Delete bunk
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await Bunk.findByIdAndDelete(id);
      res.status(200).send({ success: true, message: 'Bunk deleted successfully!' });
  } catch (error) {
      res.status(500).send({ error: 'Error deleting bunk.' });
  }
});
router.get('/', async (req, res) => {
    try {
        const retailers = await Bunk.find(); // Fetch all bunks
        res.json(retailers);
    } catch (error) {
        console.error('Error fetching retailers:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
module.exports = router;

