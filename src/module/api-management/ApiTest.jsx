import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const ApiTest = () => {
  const { projectId, folderId, apiId } = useParams();
  const [project, setProject] = useState(null);
  const [isEditable, setEditable] = useState(false);
  const [apiDetails, setApiDetails] = useState({ name: '', method: '', url: '', installationGuide: '', testCases: '', testScenarios: '', testScripts: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: '',
    lifeCycle: 'TEST'
  });
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [newIssue, setNewIssue] = useState({
    description: '',
    content: '',
    url: '',
    status: 'OPEN',
    priority: 'Low',
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
          installationGuide: data.installationGuide || '',
          testCases: data.testCases || '',
          testScenarios: data.testScenarios || '',
          testScripts: data.testScripts || ''

        });
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
        const editableResponse = await axiosInstance.get(`/api/v1/project/checkEditable?projectId=${projectId}&userId=${userId}&apiId=${apiId}&lifeCycle=TEST`);
        setEditable(editableResponse.data.data);
      } catch (error) {
        console.error('Error fetching editable:', error);
      }
    }
    fetchEditable();
  }, [apiId, projectId, userId]);

  const isLeader = project && project.leaderId === parseInt(userId, 10);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiDetails({ ...apiDetails, [name]: value });
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleIssueInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const handleAddTask = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const taskName = `Test: ${apiDetails.name} on ${currentDate}`;

    try {
      await axiosInstance.post(`/api/v1/task/create`, {
        ...newTask,
        name: taskName,
        projectId: projectId,
        apiId: apiId,
        createdBy: userId,
        lifeCycle: 'TEST',
      });
      setShowTaskForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'TEST' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddIssue = async () => {
    try {
      await axiosInstance.post(`/api/v1/issue/create`, {
        ...newIssue,
        projectId,
        apiId,
        createdBy: userId,
      });
      setShowIssueForm(false);
      setNewIssue({ description: '', content: '', url: '', status: 'OPEN', priority: 'Low' });
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'TEST' });
  };

  const handleCloseIssueForm = () => {
    setShowIssueForm(false);
    setNewIssue({ description: '', content: '', url: '', status: 'OPEN', priority: 'Low' });
  };

  const handleUpdateApi = async () => {
    try {
      await axiosInstance.post(`/api/v1/api/updateTestCasesAndTestScenariosAndTestScriptsAndInstallationGuide`, null, {
        params: {
          id: apiId,
          installationGuide: apiDetails.installationGuide,
          testCases: apiDetails.testCases,
          testScenarios: apiDetails.testScenarios,
          testScripts: apiDetails.testScripts
        }
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
              <Card.Title>Test: {apiDetails.name}</Card.Title>
              <Form>
                <Form.Group controlId="formInstallationGuide" className="mb-3">
                  <Form.Label>Installation Guide</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="installationGuide"
                    value={apiDetails.installationGuide}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTestCases" className="mb-3">
                  <Form.Label>Test Cases</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="testCases"
                    value={apiDetails.testCases}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTestScenarios" className="mb-3">
                  <Form.Label>Test Scenarios</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="testScenarios"
                    value={apiDetails.testScenarios}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTestScripts" className="mb-3">
                  <Form.Label>Test Scripts</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="testScripts"
                    value={apiDetails.testScripts}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
              {isLeader && (
                <Button variant="success" onClick={handleUpdateApi} className="me-2">
                  Update
                </Button>
              )}
              <Row className="mt-4">
                {isEditable && (
                  <Col xs="auto">
                    <Button variant="warning" onClick={() => setShowTaskForm(true)}>
                      Create Task
                    </Button>
                  </Col>
                )}
                {isEditable && (
                  <Col xs="auto">
                    <Button variant="danger" onClick={() => setShowIssueForm(true)}>
                      Create Issue
                    </Button>
                  </Col>
                )}
                <Col xs="auto">
                  <Button variant="primary" onClick={() => navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/develop`)}>
                    Develop
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
                placeholder={`Test: ${apiDetails.name} on ${new Date().toISOString().split('T')[0]}`}
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
      <Modal show={showIssueForm} onHide={handleCloseIssueForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formIssueDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter issue description"
                name="description"
                value={newIssue.description}
                onChange={handleIssueInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formIssueContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter issue content"
                name="content"
                value={newIssue.content}
                onChange={handleIssueInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formIssueUrl" className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter issue URL"
                name="url"
                value={newIssue.url}
                onChange={handleIssueInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formIssueStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newIssue.status}
                onChange={handleIssueInputChange}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formIssuePriority" className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newIssue.priority}
                onChange={handleIssueInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAddIssue}>
            Add Issue
          </Button>
          <Button variant="danger" onClick={handleCloseIssueForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApiTest;
