import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal, Dropdown } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080';

const ApiDevelop = () => {
  const { projectId, folderId, apiId } = useParams();
  const [project, setProject] = useState(null);
  const [isEditable, setEditable] = useState(false);
  const [apiDetails, setApiDetails] = useState({ method: '', url: '', token: '', header: '', parameters: '', bodyJson: '', environmentId: 0, installationGuide: '', sourceCode: '' });
  const [environments, setEnvironments] = useState([]);
  const [environmentName, setEnvironmentName] = useState('None');
  const [response, setResponse] = useState('');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [param, setParam] = useState('');
  const [body, setBody] = useState('');
  const [installationGuide, setInstallationGuide] = useState('');
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
        const response = await axiosInstance.get(`/api/v1/api/findById?id=${apiId}`);
        const data = response.data.data;
        setApiDetails({
          name: data.name,
          method: data.method,
          url: data.url,
          token: data.token || '',
          header: data.header || '',
          parameters: data.parameters || '',
          bodyJson: data.bodyJson || '',
          environmentId: data.environmentId || 0,
          installationGuide: data.installationGuide || '',
          sourceCode: data.sourceCode || ''
        });
        setToken(data.token || '');
        setHeader(data.header || '');
        setParam(data.parameters || '');
        setBody(data.bodyJson || '');
        setInstallationGuide(data.installationGuide || '');
        const environmentResponse = await axiosInstance.get(`/api/v1/environment/findById?id=${data.environmentId}`);
        setEnvironmentName(environmentResponse.data.data.name);
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    fetchApiDetails();

    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/project/findById?id=${projectId}`);
        setProject(response.data.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    }
    fetchProjectDetails();

    const fetchEditable = async () => {
      try {
        const editableResponse = await axiosInstance.get(`/api/v1/project/checkEditable?projectId=${projectId}&userId=${userId}&apiId=${apiId}&lifeCycle=DEVELOP`);
        setEditable(editableResponse.data.data);
      } catch (error) {
        console.error('Error fetching editable:', error);
      }
    }
    fetchEditable();

    const fetchEnvironments = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/environment/findByProjectId`, {
          params: { projectId },
        });
        setEnvironments(response.data.data);
      } catch (error) {
        console.error('Error fetching environments:', error);
      }
    };

    fetchEnvironments();
  }, [apiId, projectId, userId]);

  const isLeader = project && project.leaderId === parseInt(userId, 10);

  const handleSendRequest = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/send/sendApi?apiId=${apiId}`);
      setResponse(response.data);
    } catch (error) {
      console.error('Error sending API request:', error);
      setResponse('Error sending request');
    }
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post(`/api/v1/api/updateParametersAndBodyAndTokenAndHeader`, null, {
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
      await axiosInstance.post(`/api/v1/task/create`, {
        ...newTask,
        name: taskName,
        projectId: projectId,
        apiId: apiId,
        createdBy: userId,
        lifeCycle: 'DEVELOP',
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

  const handleEnvironmentChange = async (eventKey) => {
    const environmentId = parseInt(eventKey, 10);
    try {
      await axiosInstance.post(`/api/v1/api/updateEnvironmentId`, null, {
        params: {
          id: apiId,
          environmentId: environmentId === 0 ? 0 : environmentId,
        },
      });
      setApiDetails((prevDetails) => ({
        ...prevDetails,
        environmentId: environmentId,
      }));
      const selectedEnvironment = environments.find((env) => env.id === environmentId);
      setEnvironmentName(environmentId === 0 ? 'None' : selectedEnvironment ? selectedEnvironment.name : 'Unknown');
    } catch (error) {
      console.error('Error updating environmentId:', error);
    }
  };

  const handleInstallationGuideChange = (e) => {
    setInstallationGuide(e.target.value);
  };

  const handleUpdateInstallationGuide = async () => {
    try {
      await axiosInstance.post(`/api/v1/api/updateInstallationGuide`, null, {
        params: {
          id: apiId,
          installationGuide: installationGuide,
        },
      });
      alert('Installation Guide updated successfully');
    } catch (error) {
      console.error('Error updating Installation Guide:', error);
    }
  };

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10} className='content-style'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Develop: {apiDetails.name}</Card.Title>
              <Form className="mb-3">
                <Row className="align-items-center">
                  <Col xs={12} md={2}>
                    <Form.Group>
                      <Form.Label><strong>Method:</strong></Form.Label>
                      <Form.Control type="text" value={apiDetails.method} readOnly />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={5}>
                    <Form.Group>
                      <Form.Label><strong>URL:</strong></Form.Label>
                      <Form.Control type="text" value={apiDetails.url} readOnly />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={2}>
                    <Form.Group>
                      <Form.Label><strong>Environment:</strong></Form.Label>
                      <Form.Control type="text" value={environmentName} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={2}>
                    <Dropdown onSelect={handleEnvironmentChange}>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {environmentName}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey={0}>None</Dropdown.Item>
                        {environments.map((env) => (
                          <Dropdown.Item key={env.id} eventKey={env.id}>
                            {env.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
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
                  {isEditable && (
                  <Col xs="auto">
                    <Button variant="success" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </Col>
                  )}
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
              <h3 className="mt-4">Source Code</h3>
              <Card className="mt-2">
                <Card.Body>
                  <a href={apiDetails.sourceCode} target="_blank" rel="noopener noreferrer">
                    {apiDetails.sourceCode}
                  </a>
                </Card.Body>
              </Card>
              <h3 className="mt-4"></h3>
              <Form>
                <Form.Group controlId="formInstallationGuide" className="mb-3">
                  <Form.Label>Installation Guide</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={installationGuide}
                    onChange={handleInstallationGuideChange}
                  />
                </Form.Group>
                {isLeader && (
                  <Button variant="success" onClick={handleUpdateInstallationGuide} className="me-2">
                    Update Installation Guide
                  </Button>
                )}
              </Form>
              <Row className="mt-4">
                {isLeader && (
                <Col xs="auto">
                  <Button variant="warning" onClick={() => setShowTaskForm(true)}>
                    Create Task
                  </Button>
                </Col>
                )}
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
                placeholder={`Develop: ${apiDetails.name} on ${new Date().toISOString().split('T')[0]}`}
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
          <Button variant="success" onClick={handleAddTask}>
            Add Task
          </Button>
          <Button variant="danger" onClick={handleCloseTaskForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApiDevelop;
