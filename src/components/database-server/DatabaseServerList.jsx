import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DatabaseServerList.css';

const backendUrl = 'http://localhost:8080'; // Update to your backend URL

const typeColors = {
  MySQL: '#ffc107',
  PostgreSQL: '#007bff',
  MongoDB: '#28a745',
  Oracle: '#dc3545',
  'SQL Server': '#6f42c1',
};

const DatabaseServerList = () => {
  const { projectId } = useParams();
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const userId = localStorage.getItem('userId');
  const [servers, setServers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    type: 'MySQL', // Default type
    url: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/v1/database-server/findAllByProjectId?projectId=${projectId}&page=0&size=100`);
      setServers(response.data.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const handleAddServer = async () => {
    try {
      await axiosInstance.post(`${backendUrl}/api/v1/database-server/create`, {
        ...newServer,
        projectId: projectId,
      });
      setShowForm(false);
      setNewServer({ name: '', description: '', type: 'MySQL', url: '', username: '', password: '' });
      fetchServers();
    } catch (error) {
      console.error('Error adding server:', error);
    }
  };

  const handleServerClick = (server) => {
    navigate(`/project/${projectId}/database-server/${server.id}/tables`, { state: { typeColor: typeColors[server.type] || typeColors['MySQL'] } });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewServer({ name: '', description: '', type: 'MySQL', url: '', username: '', password: '' });
  };

  return (
    <Container fluid className="server-list-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className="server-content">
          <h2>Database Server List</h2>
          <Row>
            {servers.map((server) => (
              <Col key={server.id} xs={12} md={6} lg={4} className="mb-3">
                <Card
                  onClick={() => handleServerClick(server)}
                  className="server-card"
                  style={{ 
                    cursor: 'pointer', 
                    borderColor: typeColors[server.type] || typeColors['MySQL'] // Default to MySQL color if type is not specified
                  }}
                >
                  <Card.Body>
                    <Card.Title>{server.name}</Card.Title>
                    <Card.Text>{server.description}</Card.Text>
                    <Card.Text>
                      <strong>Type:</strong> {server.type}
                    </Card.Text>
                    <Card.Text>
                      <strong>URL:</strong> {server.url}
                    </Card.Text>
                    <Card.Text>
                      <strong>Username:</strong> {server.username}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              {projectLeaderId === parseInt(userId, 10) && (
                <div>
                  <Card onClick={() => setShowForm(true)} className="server-card add-server-card" style={{ cursor: 'pointer' }}>
                    <Card.Body className="d-flex justify-content-center align-items-center">
                      <h1>+</h1>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Col>
          </Row>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Database Server</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formServerName" className="mb-3">
                  <Form.Label>Server Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter server name"
                    value={newServer.name}
                    onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formServerDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter server description"
                    value={newServer.description}
                    onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formServerType" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={newServer.type}
                    onChange={(e) => setNewServer({ ...newServer, type: e.target.value })}
                  >
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Oracle">Oracle</option>
                    <option value="SQL Server">SQL Server</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formServerUrl" className="mb-3">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter server URL"
                    value={newServer.url}
                    onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formServerUsername" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter server username"
                    value={newServer.username}
                    onChange={(e) => setNewServer({ ...newServer, username: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formServerPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter server password"
                    value={newServer.password}
                    onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddServer}>
                Add Server
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default DatabaseServerList;
