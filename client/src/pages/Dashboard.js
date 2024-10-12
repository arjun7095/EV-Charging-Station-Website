import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';  // Import CSS for styling

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="overlay">
        <div className="content">
          <h1>Welcome to EV Charging Slot Booking</h1>
          <p>
            The future of transportation is electric! Our EV charging app helps you find nearby charging stations,
            check slot availability, and ensure you never run out of charge during your journey.
          </p>
          <div className="buttons">
            <Link to="/login" className="btn user-btn">Sign in as User</Link>
            <Link to="/retailer/login" className="btn retailer-btn">Sign in as Retailer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
