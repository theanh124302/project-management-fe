import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/ProjectList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    coverImage: ''
  });
  const [leaderId, setLeaderId] = useState(null);
  const [userName, setUserName] = useState('');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/project/findByUsername?username=${username}`);
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/user/findByUsername/${username}`);
        setUserName(response.data.data.name);
        setLeaderId(response.data.data.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchProjects();
    fetchUserInfo();
  }, [username]);

  const handleAddProject = async () => {
    if (!leaderId) {
      console.error('Leader ID not found');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/v1/project/create`, {
        ...newProject,
        leaderId
      });
      setShowForm(false);
      setNewProject({ name: '', description: '', coverImage: '' });
      const response = await axios.get(`${backendUrl}/api/v1/project/findByUsername?username=${username}`);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}?username=${username}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewProject({ name: '', description: '', coverImage: '' });
  };

  return (
    <Container>
      <CustomAppBar />
      <h2 className="my-4">Welcome, {userName}!</h2>
      <div className="text-end mb-3">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Project
        </Button>
      </div>
      <Row>
        {projects.map((project) => (
          <Col key={project.id} xs={12} sm={6} md={4} className="mb-4">
            <Card onClick={() => handleProjectClick(project.id)} style={{ cursor: 'pointer' }}>
              <Card.Img variant="top" src={project.coverImage || 'https://via.placeholder.com/150'} />
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text>{project.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProjectName" className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProjectDescription" className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProjectCoverImage" className="mb-3">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter cover image URL"
                value={newProject.coverImage}
                onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProject}>
            Add Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectList;
