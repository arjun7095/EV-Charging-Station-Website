# EV Charging Slot Booking Application
    This project is a MERN stack web application that allows users to search for nearby EV charging bunks,
    view bunk details (such as available slots, location, and contact details), and book charging slots. 
    Retailers can manage their bunk details, including the number of available slots, and users can view their booking history and update their profiles.

# Table of Contents
- Features
- Technologies Used
- Installation
- Usage
- API Endpoints
- Project Structure
- Future Enhancements
## Features
# User Features:
    View Available EV Bunks: Users can see all nearby charging bunks along with the number of available slots.
    Booking Slots: Users can book a slot at a charging bunk.
    View Bookings: Users can view their booking history and cancel bookings if needed.
    Profile Management: Users can update their profile information, including name, email, mobile number, and address.
# Retailer Features:
    Manage Bunks: Retailers can add, edit, or delete EV bunk locations.
    Manage Slots: Retailers can manage the number of available slots for each bunk.
    Authentication:
    JWT-based authentication: Token-based secure login for users and retailers.
    Responsive Design:
    The application is responsive and works on various screen sizes.
## Technologies Used
    Frontend: React.js, CSS (custom styles)
    Backend: Node.js, Express.js
    Database: MongoDB (via Mongoose)
    Authentication: JWT (JSON Web Tokens)
    API Requests: Fetch API
    Version Control: Git and GitHub
## Installation
  To set up the project locally, follow these steps:
  
  Prerequisites:
  Node.js (version 12 or later)
  MongoDB
  # Clone the Repository:
      git clone https://github.com/your-username/ev-charging-slot-booking.git
      cd ev-charging-slot-booking
  # Install Dependencies:
    # Backend:
      Navigate to the backend folder:
         cd server
    # Frontend:
      Navigate to the frontend folder:
        cd client
      Install frontend dependencies:
        npm install

## Usage
    Sign Up/Login: Users and retailers can sign up or log in to access their respective dashboards.
    User Dashboard: Users can view available bunks, book a slot, manage their bookings, and update their profile.
    Retailer Dashboard: Retailers can add or update bunk information and manage slot availability.
    Logout: Users and retailers can log out of the system.

## API Endpoints
# User Routes:
    POST /api/users/register: Register a new user
    POST /api/users/login: User login
    GET /api/users/:userId: Get user profile details
    PUT /api/users/update/:userId: Update user profile
# Retailer Routes:
    GET /api/retailers: Get all bunks
    POST /api/retailers: Add new bunk (Retailer only)
    PUT /api/retailers/:id: Update bunk details (Retailer only)
    DELETE /api/retailers/:id: Delete a bunk (Retailer only)
# Booking Routes:
    GET /api/bookings: Get all bookings for the logged-in user
    POST /api/bookings: Create a new booking
    DELETE /api/bookings/:id: Cancel a booking
## Project Structure

      .
      ├── backend
      │   ├── controllers
      │   ├── models
      │   ├── routes
      │   ├── server.js
      │   └── .env
      ├── frontend
      │   ├── public
      │   ├── src
      │   │   ├── components
      │   │   ├── pages
      │   │   ├── styles
      │   │   ├── App.js
      │   │   └── index.js
      └── README.md
## Future Enhancements
    Payment Gateway: Integrate a payment gateway for booking payments.
    Notifications: Implement email or SMS notifications for booking confirmations.
    Real-Time Slot Updates: Use WebSocket for real-time slot updates.

