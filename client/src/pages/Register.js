import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Register.css'; // Add styles for the Register component
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  


  const { name, email, mobile, address, password, confirmPassword, userType } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptcha(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captcha) {
      setError('Please complete the CAPTCHA.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Add additional validation if needed

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(' Registration successful!');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          address: '',
          password: '',
          confirmPassword: ''
         
        });
        setError('');
        navigate('/login')
      } else {
        setError(data.message);
        setSuccess('');
        navigate('/login')
        alert('registration success')
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Registration failed. Please try again.');
    }
  };
  const goToHome=()=>{
    navigate("/")
  }

  return (
    <>
    <div>
    <button  className='home-btn' onClick={goToHome}> Home</button>
    </div>
    <div className="register-container">
      <h2>User Registration</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{userType}{success}</div>}
      <form onSubmit={handleSubmit} className='register-form'>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile No."
          value={mobile}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={address}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleChange}
          required
        />
        <ReCAPTCHA
          sitekey="6LdfwVMqAAAAACPJG3OrSSml2PEqSivFS4yB4Got" // Replace with your site key
          onChange={handleCaptchaChange}
        />
        <button type="submit">Register</button>
        Already have an account? <a href='/login'>Login</a>
      </form>
    </div>
    </>);
};

export default Register;
