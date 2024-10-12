import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/User.css';

const User = () => {
    const [bunks, setBunks] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeSection, setActiveSection] = useState('home'); // To handle side menu navigation
    const [showLogoutModal, setShowLogoutModal] = useState(false); // To control logout confirmation
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchBunks();
        fetchBookings();
        fetchUserDetails();
    }, []);

    const fetchBunks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/retailers');
            const data = await response.json();
            setBunks(data);
        } catch (error) {
            console.error('Error fetching bunks:', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const userEmail = localStorage.getItem('userEmail'); // Assuming email is stored during login
            alert(userEmail)
            if (!userEmail) {
                console.error('No user email found in localStorage');
                return;
            }
    
            const response = await fetch(`http://localhost:5000/api/bookings/get?email=${userEmail}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId'); // Retrieve the userId from local storage

            if (!userId) {
                console.error('No user ID found in localStorage');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm("Do you really want to cancel this booking?");
        if (confirmCancel) {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Booking cancelled successfully');
                    fetchBookings();
                    fetchBunks();
                } else {
                    alert('Failed to cancel booking');
                }
            } catch (error) {
                console.error('Error cancelling booking:', error);
            }
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true); // Show the logout confirmation modal
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setShowLogoutModal(false);
    };

    const handleBookNow = (bunkId) => {
        navigate(`/book/${bunkId}`); // Redirect to the booking form and pass bunkId
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleUpdateProfile = async () => {
        
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

            const response = await fetch(`http://localhost:5000/api/users/update/${userId}`, {
                method: 'PUT', // PUT for updating data
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user), // Send updated user data
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully');
                // Optionally re-fetch user data or redirect
                fetchUserDetails(); // Re-fetch updated user data
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="user-page-container">
            {/* Side Menu */}
            <div className="side-menu">
                <button onClick={() => setActiveSection('home')}>Home</button>
                <button onClick={() => setActiveSection('mybookings')}>My Bookings</button>
                <button onClick={() => setActiveSection('profile')}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Content Area */}
            <div className="content-area">
                {/* Home Section: Displays Bunks */}
                {activeSection === 'home' && (
                    <>
                    <h2 className='welcome'>Welcome to EV Charging Application</h2>
                        <h2>Available EV Bunk Locations</h2>
                        <table className="bunk-table">
                            <thead>
                                <tr>
                                    <th>Bunk Name</th>
                                    <th>Address</th>
                                    <th>Mobile Number</th>
                                    <th>Total Slots</th>
                                    <th>Available Slots</th>
                                    <th>Location</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bunks.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">No bunks available at the moment.</td>
                                    </tr>
                                ) : (
                                    bunks.map((bunk) => (
                                        <tr key={bunk._id}>
                                            <td>{bunk.bunkName}</td>
                                            <td>{bunk.address}</td>
                                            <td>{bunk.mobileNumber}</td>
                                            <td>{bunk.numberOfSlots}</td>
                                            <td>{bunk.availableSlots}</td>
                                            <td>
                                                <a href={bunk.location} target="_blank" rel="noopener noreferrer">
                                                    View on Google Maps
                                                </a>
                                            </td>
                                            <td>
                                                {bunk.availableSlots > 0 ? (
                                                    <button onClick={() => handleBookNow(bunk._id)} className="book-btn">
                                                        Book Now
                                                    </button>
                                                ) : (
                                                    <span className="no-slots">No Slots Available</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}

                {/* My Bookings Section */}
                {activeSection === 'mybookings' && (
                    <>
                        <h2>My Bookings</h2>
                        <table className="bunk-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile Number</th>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">No bookings found.</td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id}>
                                            <td>{booking.name}</td>
                                            <td>{booking.email}</td>
                                            <td>{booking.mobileNumber}</td>
                                            <td>{booking.date}</td>
                                            <td>{booking.timeSlot}</td>
                                            <td>{booking.status}</td>
                                            <td>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="cancel-btn">
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Profile Section */}
                {activeSection === 'profile' && (
                    <>
                        <h2>My Profile</h2>
                        <div className="profile-section">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={user.name || ''}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={user.email || ''}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />

                            <label>Mobile Number:</label>
                            <input
                                type="text"
                                value={user.mobile || ''}
                                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                            />
                            <label>Address:</label>
                            <input
                                type="text"
                                value={user.address || ''}
                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                            />
                            
                            <button onClick={handleUpdateProfile} className="update-btn">Update Profile</button>
                        </div>
                    </>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to log out?</h3>
                        <button onClick={confirmLogout} className="confirm-btn">Yes, Logout</button>
                        <button onClick={cancelLogout} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
