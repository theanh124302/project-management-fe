import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const checkValidUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/auth/checkValidUser`, {
          params: { projectId, userId }
        });
        if (response.data.data) {
          setIsValid(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking valid user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkValidUser();
  }, [projectId, userId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isValid ? <Component {...rest} /> : null;
};

export default ProtectedRoute;
