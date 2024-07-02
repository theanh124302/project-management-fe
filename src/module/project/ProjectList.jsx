import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import Paper from '@mui/material/Paper';
import CustomAppBar from '../navbar/CustomAppBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Auth.css';

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
  const [tasks, setTasks] = useState([]);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/project/findByUsername?username=${username}`);
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/user/findByUsername/${username}`);
        setUserName(response.data.data.name);
        setLeaderId(response.data.data.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/task/findByUserId`, {
          params: { userId }
        });
        const tasks = response.data.data;
        const formattedTasks = tasks.map(task => ({
          startDate: task.startDate,
          endDate: task.dueDate,
          title: task.name,
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchProjects();
    fetchUserInfo();
    fetchTasks();
  }, [username, userId]);

  const handleAddProject = async () => {
    if (!leaderId) {
      console.error('Leader ID not found');
      return;
    }

    try {
      await axiosInstance.post(`/api/v1/project/create`, {
        ...newProject,
        leaderId
      });
      setShowForm(false);
      setNewProject({ name: '', description: '', coverImage: '' });
      const response = await axiosInstance.get(`/api/v1/project/findByUsername?username=${username}`);
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

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <Container fluid>
      <CustomAppBar />
      <div className="d-flex justify-content-center mb-4">
        <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px', marginTop: '15px', width: '100%' }}>
          <Paper>
            <Scheduler data={tasks}>
              <ViewState currentDate={currentDate} />
              <MonthView />
              <Appointments />
            </Scheduler>
          </Paper>
        </div>
      </div>
      <div className="text-end mb-3">
        <Button variant="success" onClick={() => setShowForm(true)}>
          Add Project
        </Button>
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
          <Button variant="success" onClick={handleAddProject}>
            Add Project
          </Button>
          <Button variant="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectList;
