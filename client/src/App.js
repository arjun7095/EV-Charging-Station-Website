import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import Register from './pages/Register';
import RetailerLogin from './pages/RetailerLogin';
import RetailerRegister from './pages/RetailerRegister';
import Dashboard from './pages/Dashboard';
import RetailerForm from './components/RetailerForm';
import Retailer from './components/Retailer';
import User from './components/User';
import BookingForm from './components/BookingForm';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/form" element={<RetailerForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/retailer/login" element={<RetailerLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/retailer/register" element={<RetailerRegister />} />
          <Route path="/book/:bunkId" element={<BookingForm />} />
          <Route
            path="/retailer"
            element={
              <ProtectedRoute>
                <Retailer/>
              </ProtectedRoute>
            }
          />
          <Route path="/user"
            element={
              <ProtectedRoute>
                <User/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
