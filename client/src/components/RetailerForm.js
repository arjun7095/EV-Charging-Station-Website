import React, { useState } from 'react';
import '../styles/RetailerForm.css';

function RetailerForm({ refreshBunks }) { // Add refreshBunks as a prop
    const [formData, setFormData] = useState({
        bunkName: '',
        email: '',
        mobileNumber: '',
        address: '',
        numberOfSlots: '',
        availableSlots: '',
        location: '',
    });

    const { bunkName, email, mobileNumber, address, numberOfSlots, availableSlots, location } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5000/api/retailers/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                alert('Bunk details added to the database');
                setFormData({
                    bunkName: '',
                    email: '',
                    mobileNumber: '',
                    address: '',
                    numberOfSlots: '',
                    availableSlots: '',
                    location: ''
                });
                refreshBunks(); // Refresh the bunk list
            } else {
                alert('Registration failed: ' + data.error); // Display the error message from the server
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        }
    };

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
                <label>Bunk Name:</label>
                <input type="text" name="bunkName" value={bunkName} onChange={handleChange} required />
                <label>Email:</label>
                <input type="text" name="email" value={email} onChange={handleChange} required />
                <label>Mobile Number:</label>
                <input type="text" name="mobileNumber" value={mobileNumber} onChange={handleChange} required />
                <label>Address:</label>
                <input type="text" name="address" value={address} onChange={handleChange} required />
                <label>Total Slots:</label>
                <input type="number" name="numberOfSlots" value={numberOfSlots} onChange={handleChange} required />
                <label>Available Slots:</label>
                <input type="number" name="availableSlots" value={availableSlots} onChange={handleChange} required />
                <label>Location:</label>
                <input type="url" name="location" value={location} onChange={handleChange} placeholder='Paste your Google Maps location' required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default RetailerForm;
