import React, { useState, useEffect } from 'react';
import '../styles/Retailer.css';
import RetailerForm from './RetailerForm';
import { useNavigate } from 'react-router-dom';

const Retailer = () => {
    const [bunks, setBunks] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const navigate = useNavigate();
    
    const [editingBunkId, setEditingBunkId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        bunkName: '',
        email: '',
        mobileNumber: '',
        address: '',
        numberOfSlots: '',
        availableSlots: '',
        location: ''
    });

    useEffect(() => {
        fetchBunks();
    },); // Add dependency array to avoid infinite loop

    const fetchBunks = async () => {
        const email = localStorage.getItem('email');
        
        try {
            const response = await fetch(`http://localhost:5000/api/retailers/specific?email=${email}`);
            const data = await response.json();
            setBunks(data);

            if (data.length > 0) {
                fetchBookings(`${data[0]._id}`);
            } else {
                alert('No bunks found.');
            }
        } catch (error) {
            console.error('Error fetching bunks:', error);
        }
    };
    
    const fetchBookings = async (bunkId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bookings?bunkId=${bunkId}`);
            if (!response.ok) {
                console.error(`Error fetching bookings: ${response.statusText}`);
                return;
            }
            const data = await response.json();
            setBookings(data);
            setFilteredBookings(data); // Initialize filtered bookings
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bunk?')) {
            try {
                await fetch(`http://localhost:5000/api/retailers/delete/${id}`, {
                    method: 'DELETE',
                });
                fetchBunks();
                alert('Bunk deleted successfully.');
            } catch (error) {
                console.error('Error deleting bunk:', error);
            }
        }
    };

    const handleEdit = (bunk) => {
        setEditingBunkId(bunk._id);
        setEditFormData({
            bunkName: bunk.bunkName,
            email: bunk.email,
            mobileNumber: bunk.mobileNumber,
            address: bunk.address,
            numberOfSlots: bunk.numberOfSlots,
            availableSlots: bunk.availableSlots,
            location: bunk.location
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleEditSubmit = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/retailers/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            });
            setEditingBunkId(null);
            fetchBunks();
        } catch (error) {
            console.error('Error updating bunk:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingBunkId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/');
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            await fetch(`http://localhost:5000/api/bookings/update/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            fetchBookings(bunks[0]._id); // Refresh bookings
            alert(`Booking status updated to ${status} successfully.`);
        } catch (error) {
            console.error(`Error updating booking status to ${status}:`, error);
        }
    };

    const handleDateChange = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);

        if (selected) {
            const filtered = bookings.filter((booking) =>
                new Date(booking.date).toLocaleDateString() === new Date(selected).toLocaleDateString()
            );
            setFilteredBookings(filtered);
        } else {
            setFilteredBookings(bookings);
        }
    };

    return (
        <div className="retailer-container">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <header>
                <h2>Welcome to EV Charging Retailer</h2>
            </header>
            {bunks.length === 0 ? (
                <RetailerForm refreshBunks={fetchBunks} />
            ) : (
                <>
                    <h3>Bunk List</h3>
                    <table className="bunk-table">
                        <thead>
                            <tr>
                                <th>Bunk Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Address</th>
                                <th>Total Slots</th>
                                <th>Available Slots</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bunks.map((bunk) => (
                                <tr key={bunk._id}>
                                    {editingBunkId === bunk._id ? (
                                        <>
                                            <td><input type="text" name="bunkName" value={editFormData.bunkName} onChange={handleEditChange} /></td>
                                            <td><input type="text" name="email" value={editFormData.email} onChange={handleEditChange} /></td>
                                            <td><input type="text" name="mobileNumber" value={editFormData.mobileNumber} onChange={handleEditChange} /></td>
                                            <td><input type="text" name="address" value={editFormData.address} onChange={handleEditChange} /></td>
                                            <td><input type="number" name="numberOfSlots" value={editFormData.numberOfSlots} onChange={handleEditChange} /></td>
                                            <td><input type="number" name="availableSlots" value={editFormData.availableSlots} onChange={handleEditChange} /></td>
                                            <td><input type="url" name="location" value={editFormData.location} onChange={handleEditChange} /></td>
                                            <td>
                                                <button onClick={() => handleEditSubmit(bunk._id)}>Save</button>
                                                <button onClick={handleCancelEdit}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{bunk.bunkName}</td>
                                            <td>{bunk.email}</td>
                                            <td>{bunk.mobileNumber}</td>
                                            <td>{bunk.address}</td>
                                            <td>{bunk.numberOfSlots}</td>
                                            <td>{bunk.availableSlots}</td>
                                            <td><a href={bunk.location} target="_blank" rel="noopener noreferrer">View</a></td>
                                            <td>
                                                <button onClick={() => handleEdit(bunk)}>Edit</button>
                                                <button onClick={() => handleDelete(bunk._id)}>Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Display bookings related to the selected bunk */}
                    <h3 style={{fontSize:'30px',textAlign:'center',color:'yellow',marginTop:'100px'}}>Bookings for Selected Bunk</h3>
                    {/* Date Filter */}
                    <div align='center' className="date-filter" style={{ width: '200px' }}>
                        <label htmlFor="date">Filter Bookings by Date:</label>
                        <input 
                            type="date" 
                            id="date" 
                            value={selectedDate} 
                            onChange={handleDateChange} 
                        />
                    </div>
                    {filteredBookings.length === 0 ? (
                        <p style={{ color: 'red', fontSize: '60px' }}>No bookings available for this bunk.</p>
                    ) : (
                        <table className="bunk-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                            <th>Actions</th> {/* New column for actions */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking._id}>
                                                <td>{booking.name}</td>
                                                <td>{booking.mobileNumber}</td>
                                                <td>{new Date(booking.date).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}</td>
                                                <td>{booking.timeSlot}</td>
                                                <td>{booking.status}</td>
                                                <td>
                                                    {booking.status === 'Pending' ? (
                                                        <>
                                                            <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} style={{width:'auto'}}>Confirm</button>
                                                    <button onClick={() => updateBookingStatus(booking._id, 'not available')} style={{width:'auto'}}>Not Available</button>
                                                </>
                                            ) : (
                                                <span>{booking.status}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default Retailer;
