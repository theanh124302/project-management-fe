import React, { useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useNavigate } from 'react-router-dom';
import '../../public/css/Auth.css';
import NonLoginAppBar from '../navbar/NonLoginAppBar';

const SignUp = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !phoneNumber || !email || !username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await axiosInstance.post(
        `/api/v1/auth/signup`,
        {
          name: name,
          phoneNumber: phoneNumber,
          email: email,
          username: username,
          password: password,
        }
      );
      navigate('/login'); // Navigate to the login page after successful registration
    } catch (error) {
      setError('Registration failed. Please check your information.');
    }
  };

  return (
    <>
      <div className="page-container">
        <NonLoginAppBar />
        <div className="container">
          
          <form onSubmit={handleSignUp}>
            <div>
              <h2>Register</h2>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
