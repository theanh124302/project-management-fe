import React, { useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { FaBuysellads } from 'react-icons/fa';
import NonLoginAppBar from '../navbar/NonLoginAppBar';
import '../../public/css/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `/api/v1/auth/signin`,
        {
          username: username,
          password: password,
        }
      );
      const { token, refreshToken } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      const userResponse = await axiosInstance.get(`/api/v1/user/findByUsername/${username}`);
      const userId = userResponse.data.data.id;
      localStorage.setItem('userId', userId);

      navigate(`/projectList`);
    } catch (error) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <>
      <div className="page-container">
        <NonLoginAppBar />
        <div className="container">
          <form onSubmit={handleLogin}>
            <h2>Login to <FaBuysellads /></h2>
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
            <button type="submit">Login</button>
            <p>Don't have an account? <Link to="/signup" style={{color: '#212631'} }>Register now</Link></p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
