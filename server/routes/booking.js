// routes/booking.js
const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Bunk = require('../models/Bunk'); 

const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
    const { bunkId, name, email, mobileNumber, date, timeSlot } = req.body;

    try {
        // Create a new booking
        const newBooking = new Booking({
            bunkId,
            name,
            email,
            mobileNumber,
            date,
            timeSlot,
        });

        // Save the booking
        await newBooking.save();
        
        // Optionally update available slots in Bunk model
        await Bunk.findByIdAndUpdate(bunkId, { $inc: { availableSlots: -1 } });

        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
});

// Get all bookings (optional)
router.get('/', async (req, res) => {
    const { bunkId } = req.query;  // Extract the bunkId from query parameters
    
    
    try {
        if (!bunkId) {
            return res.status(400).json({ message: 'Bunk ID is required' });
        }

        // Find bookings related to the bunkId
        const bookings = await Booking.find({ bunkId });
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this bunk.' });
        }

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find the booking and remove it
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Optional: Update the available slots in the corresponding bunk if needed
        // Assuming you have a Bunk model to update
        const bunk = await Bunk.findById(deletedBooking.bunkId);
        if (bunk) {
            bunk.availableSlots += 1; // Increment available slots
            await bunk.save();
        }

        return res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
router.patch('/update/:id', async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true }); // Ensure 'new' returns the updated doc
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Error updating booking' });
    }
});
// Route for cancelling a booking
router.delete('/:bookingId', cancelBooking);
router.get('/get/', async (req, res) => {
    const { email } = req.query;
    try {
        const bookings = await Booking.find({ email }); // Fetch bookings by email
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});
module.exports = router;
