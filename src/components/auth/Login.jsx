  import React, { useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';

  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/signin',
          {
              "username": username,
              "password": password
            }
        );
        const { token, refreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        navigate('/home');
      } catch (error) {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
      }
    };

    return (
      <div>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    );
  };

  export default Login;