// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bunk = require('../models/Bunk');


// Update the details from profile section
router.put('/update/:id',  async (req, res) => {
    const userId = req.params.id; // Get user ID from request parameters

    try {
        const { name, email, mobile, address } = req.body; // Destructure new values from request body

        // Find the user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, mobile, address },
            { new: true, runValidators: true } // Options: return the updated document and validate the update
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser); // Send updated user data back
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message }); // Handle errors
    }
});

//Fetching bunk details for booking form
router.get('/fetch/:bunkId', async (req, res) => {
    
    try {
        const bunkId = req.params.bunkId;

        // Find the bunk by ID
        const bunkDetails = await Bunk.findById(bunkId);
        
        if (!bunkDetails) {
            return res.status(404).json({ message: 'Bunk not found' });
        }

        // Respond with bunk details
        res.status(200).json(bunkDetails);
    } catch (error) {
        console.error('Error fetching bunk details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//Fetching user profile details
router.get('/data/:userId',  async (req, res) => {
    try {
        const userId = req.params.userId;
        // Find the user by userId
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
