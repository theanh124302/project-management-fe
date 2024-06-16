import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/ApiDevelop.css';

const backendUrl = 'http://localhost:8080';

const ApiDevelop = () => {
  const { projectId, folderId, apiId } = useParams();
  const [apiDetails, setApiDetails] = useState({ method: '', url: '', token: '', header: '', parameters: '', bodyJson: '' });
  const [response, setResponse] = useState('');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [param, setParam] = useState('');
  const [body, setBody] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: '',
    lifeCycle: 'DEVELOP'
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axiosInstance.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        const data = response.data.data;
        setApiDetails({
          name: data.name,
          method: data.method,
          url: data.url,
          token: data.token || '',
          header: data.header || '',
          parameters: data.parameters || '',
          bodyJson: data.bodyJson || ''
        });
        setToken(data.token || '');
        setHeader(data.header || '');
        setParam(data.parameters || '');
        setBody(data.bodyJson || '');
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    fetchApiDetails();
  }, [apiId]);

  const handleSendRequest = async () => {
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/v1/send/sendApi?apiId=${apiId}`);
      setResponse(response.data);
    } catch (error) {
      console.error('Error sending API request:', error);
      setResponse('Error sending request');
    }
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post(`${backendUrl}/api/v1/api/updateParametersAndBodyAndTokenAndHeader`, null, {
        params: {
          id: apiId,
          parameters: param,
          body: body,
          token: token,
          header: header,
        },
      });
      setResponse(response.data.message);
    } catch (error) {
      console.error('Error updating API details:', error);
      setResponse('Error updating API details');
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const taskName = `Develop: ${apiDetails.name} on ${currentDate}`;

    try {
      await axiosInstance.post(`${backendUrl}/api/v1/task/create`, {
        ...newTask,
        name: taskName,
        projectId: projectId,
        apiId: apiId,
        createdBy: userId,
        lifeCycle: 'DEVELOP',
        startDate: currentDate
      });
      setShowTaskForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'DEVELOP' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'DEVELOP' });
  };

  return (
    <Container fluid className="api-develop-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className='config'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Develop: {apiDetails.name}</Card.Title>
              <Form className="mb-3">
                <Row className="align-items-center">
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label><strong>Method:</strong></Form.Label>
                      <Form.Control type="text" value={apiDetails.method} readOnly />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label><strong>URL:</strong></Form.Label>
                      <Form.Control type="text" value={apiDetails.url} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Token</Form.Label>
                  <Form.Control type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder={apiDetails.token} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Header</Form.Label>
                  <Form.Control type="text" value={header} onChange={(e) => setHeader(e.target.value)} placeholder={apiDetails.header} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Param</Form.Label>
                  <Form.Control type="text" value={param} onChange={(e) => setParam(e.target.value)} placeholder={apiDetails.parameters} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Body</Form.Label>
                  <Form.Control as="textarea" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder={apiDetails.bodyJson} />
                </Form.Group>
                <Row className="mb-3">
                  <Col xs="auto">
                    <Button variant="success" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button variant="primary" size="sm" onClick={handleSendRequest}>
                      Send Request
                    </Button>
                  </Col>
                </Row>
              </Form>
              <h3 className="mt-4">Response</h3>
              <Card className="mt-2">
                <Card.Body>
                  <pre>{typeof response === 'object' ? JSON.stringify(response, null, 2) : response}</pre>
                </Card.Body>
              </Card>
              <Row className="mt-4">
                <Col xs="auto">
                  <Button variant="warning" onClick={() => setShowTaskForm(true)}>
                    Create Task
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button variant="primary" onClick={() => navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/design`)}>
                    Design
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button variant="primary" onClick={() => navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/test`)}>
                    Test
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showTaskForm} onHide={handleCloseTaskForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName" className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                name="name"
                value={newTask.name}
                onChange={handleTaskInputChange}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                name="description"
                value={newTask.description}
                onChange={handleTaskInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTaskPriority" className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newTask.priority}
                onChange={handleTaskInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTaskStartDate" className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newTask.startDate}
                onChange={handleTaskInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDueDate" className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleTaskInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseTaskForm}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApiDevelop;
