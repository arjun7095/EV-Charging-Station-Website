// models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    bunkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bunk', // Assuming you have a Bunk model
        required: true,
    },
    bunkName:{
        type:String,
        required:true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Booked','Not Available'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
