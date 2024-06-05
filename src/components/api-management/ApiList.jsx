import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const ApiList = () => {
  const { projectId, folderId } = useParams();
  const [apis, setApis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentApi, setCurrentApi] = useState(null);
  const [newApi, setNewApi] = useState({
    name: '',
    description: '',
    url: '',
    method: ''
  });
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
        setProjectLeaderId(response.data.data.leaderId);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    const fetchApis = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findByFolderId?folderId=${folderId}`);
        setApis(response.data.data);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      }
    };

    fetchProjectDetails();
    fetchApis();
  }, [projectId, folderId]);

  const handleAddApi = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/v1/api/create`, {
        ...newApi,
        projectId: projectId,
        folderId: folderId,
        createdBy: userId
      });
      setShowForm(false);
      setNewApi({ name: '', description: '', url: '', method: '' });
      const response = await axios.get(`${backendUrl}/api/v1/api/findByFolderId?folderId=${folderId}`);
      setApis(response.data.data);
    } catch (error) {
      console.error('Error adding API:', error);
    }
  };

  const handleApiClick = (apiId) => {
    navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentApi(null);
    setNewApi({ name: '', description: '', url: '', method: '' });
  };

  return (
    <Container fluid className="task-list-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <h2>API List</h2>
          <Row>
            {apis.map((api) => (
              <Col key={api.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleApiClick(api.id)} className="task-card" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{api.name}</Card.Title>
                    <Card.Text>{api.description}</Card.Text>
                    <Card.Text>
                      <strong>Method:</strong> {api.method}
                    </Card.Text>
                    <Card.Text>
                      <strong>URL:</strong> {api.url}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card onClick={() => setShowForm(true)} className="task-card add-task-card" style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1>+</h1>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>{currentApi ? 'Edit API' : 'Add New API'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formApiName" className="mb-3">
                  <Form.Label>API Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter API name"
                    value={newApi.name}
                    onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formApiDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter API description"
                    value={newApi.description}
                    onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formApiUrl" className="mb-3">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter API URL"
                    value={newApi.url}
                    onChange={(e) => setNewApi({ ...newApi, url: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formApiMethod" className="mb-3">
                  <Form.Label>Method</Form.Label>
                  <Form.Control
                    as="select"
                    value={newApi.method}
                    onChange={(e) => setNewApi({ ...newApi, method: e.target.value })}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddApi}>
                Add API
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiList;
