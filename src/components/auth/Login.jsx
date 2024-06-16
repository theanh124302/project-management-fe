import React, { useState } from 'react';
import axiosInstance from '../AxiosInstance'; // Import axiosInstance
import { useNavigate, Link } from 'react-router-dom';
import '../../public/css/Login.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

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

      // Fetch user data to get userId
      const userResponse = await axiosInstance.get(`/api/v1/user/findByUsername/${username}`);
      const userId = userResponse.data.data.id;
      localStorage.setItem('userId', userId);

      navigate(`/projectList`);
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
    }
  };

  return (
    <div className="container">
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Đăng nhập</button>
      </form>
      <p>Bạn chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link></p>
    </div>
  );
};

export default Login;
