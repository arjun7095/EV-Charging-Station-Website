import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookingForm.css';

const BookingForm = () => {
    const { bunkId } = useParams(); // Get the selected bunkId from the URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        date: '',
        timeSlot: '',
        status: 'Pending' // Default status is Pending
    });

    const [availableSlots, setAvailableSlots] = useState([]);

    // Fetch available time slots for the selected bunk (optional)
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bunks/${bunkId}/timeslots`);
                const slots = await response.json();
                setAvailableSlots(slots); // Assuming you receive available time slots from the backend
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        };

        fetchAvailableSlots();
    }, [bunkId]); // Add bunkId to the dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    bunkId, // Include the selected bunkId in the booking request
                }),
            });

            if (response.ok) {
                alert('Booking successful');
                navigate('/user'); // Redirect back to the user page after successful booking
            } else {
                alert('Booking failed');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <button className="back-btn" onClick={() => navigate('/user')}>Home</button>

            <div className="booking-form-container">
                <h2>Book a Slot for Bunk ID: {bunkId}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobileNumber">Mobile Number</label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            min={today} // Set the minimum date to today
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="timeSlot">Time Slot</label>
                        <select
                            id="timeSlot"
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Time Slot</option>
                            <option value="9:00AM - 10:00 AM">9:00AM - 10:00 AM</option>
                            <option value="10:00AM - 11:00AM">10:00AM - 11:00AM</option>
                            <option value="11:00AM - 12:00PM">11:00AM - 12:00PM</option>
                            <option value="12:00PM - 01:00PM">12:00PM - 01:00PM</option>
                            <option value="02:00PM - 03:00PM">02:00PM - 03:00PM</option>
                            <option value="03:00PM - 04:00PM">03:00PM - 04:00PM</option>
                            <option value="04:00PM - 05:00PM">04:00PM - 05:00PM</option>
                            <option value="05:00PM - 06:00PM">05:00PM - 06:00PM</option>
                            <option value="06:00PM - 07:00PM">06:00PM - 07:00PM</option>
                            <option value="07:00PM - 08:00PM">07:00PM - 08:00PM</option>
                            {availableSlots.map((slot, index) => (
                                <option key={index} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="submit-btn">Submit Booking</button>
                </form>
            </div>
        </>
    );
};

export default BookingForm;
