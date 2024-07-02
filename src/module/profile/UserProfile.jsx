import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import '../../public/css/Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/user/findById/${userId}`);
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
    <div className="page-container">
      <CustomAppBar />
      <Container className="mt-5">
        <div className="d-flex flex-column align-items-center">
          <Image
            src={user.avatar}
            roundedCircle
            alt={user.name}
            width={100}
            height={100}
            className="mb-2"
          />
          <h1>User Profile</h1>
          <Form className="w-100 mt-3">
            <Row>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={user.name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="age">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={user.age || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={user.username || ''}
                    onChange={handleInputChange}
                    disabled
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="avatar">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="text"
                    name="avatar"
                    value={user.avatar || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {isEditing ? (
              <div className="d-flex justify-content-between mt-3">
                <Button variant="success" onClick={handleUpdateUser}>
                  <FontAwesomeIcon icon={faSave} /> Save
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="success"
                className="w-100 mt-3 mb-2"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faEdit} /> Edit
              </Button>
            )}
            <Button
              variant="outline-success"
              className="w-100 mt-3 mb-2"
              onClick={handleBackClick}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Project List
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default UserProfile;
