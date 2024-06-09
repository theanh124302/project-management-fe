import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
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
  const [dueDateTasks, setDueDateTasks] = useState([]);
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

    const fetchDueDateTasks = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/task/countDueDateByDayAndUserId`, {
          params: { userId }
        });
        setDueDateTasks(response.data.data);
      } catch (error) {
        console.error('Error fetching due date tasks:', error);
      }
    };

    fetchProjects();
    fetchUserInfo();
    fetchDueDateTasks();
  }, [username, userId]);

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
    navigate(`/project/${projectId}/dashboard`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewProject({ name: '', description: '', coverImage: '' });
  };

  return (
    <Container fluid className="project-list-container">
      <CustomAppBar />
      <div className="text-end mb-3">
        <Button variant="success" onClick={() => setShowForm(true)}>
          Add Project
        </Button>
      </div>
      <div className="d-flex justify-content-center mb-4">
        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}>
          <BarChart width={600} height={400} data={dueDateTasks}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="number" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
      <Row>
        {projects.map((project) => (
          <Col key={project.id} xs={12} sm={6} md={4} className="mb-4">
            <Card className="project-card" onClick={() => handleProjectClick(project.id)} style={{ cursor: 'pointer', border: '1px solid white' }}>
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
          <Button variant="success" onClick={handleAddProject}>
            Add Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectList;
