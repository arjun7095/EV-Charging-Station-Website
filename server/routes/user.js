// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Retailer = require('../models/Retailer');

router.get('/:id',  async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Exclude password field

        if (user) {
            res.json(user); // Send user data back to the frontend
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
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

module.exports = router;
