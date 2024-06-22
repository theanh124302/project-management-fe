// UserProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import '../../public/css/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8080/api/v1/user/findById/${userId}`);
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdateUser = async () => {
    try {
      await axiosInstance.post('http://localhost:8080/api/v1/user/update', user);
      setIsEditing(false);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBackClick = () => {
    navigate('/projectList');
  };

  return (
    <div>
      <CustomAppBar />
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar alt={user.name} src={user.avatar} sx={{ width: 100, height: 100, mb: 2 }} />
          <Typography component="h1" variant="h5">
            User Profile
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  value={user.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phoneNumber"
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  value={user.phoneNumber || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="age"
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  type="number"
                  value={user.age || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  value={user.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  value={user.username || ''}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
            </Grid>
            {isEditing ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleUpdateUser}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleBackClick}
            >
              Back to Project List
            </Button>
          </Box>
        </Box>

      </Container>
    </div>
  );
};

export default UserProfile;
