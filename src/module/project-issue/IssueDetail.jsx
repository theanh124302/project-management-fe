import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080';

const statusColors = {
  OPEN: 'danger',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'secondary',
};

const IssueDetail = () => {
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const { issueId, projectId } = useParams();
  const [issue, setIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newIssue, setNewIssue] = useState({
    description: '',
    content: '',
    url: '',
    status: 'OPEN',
    priority: 'Low',
  });
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    startDate: '',
    dueDate: '',
    lifeCycle: 'DEVELOP',
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchIssueDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/issue/findById`, {
          params: { id: issueId }
        });
        const issueData = response.data.data;
        setIssue(issueData);
        setNewStatus(issueData.status);
        setNewIssue({
          description: issueData.description,
          content: issueData.content,
          url: issueData.url,
          status: issueData.status,
          priority: issueData.priority,
        });
        setNewTask({
          ...newTask,
          priority: issueData.priority, // Gán priority của issue cho task
        });
      } catch (error) {
        console.error('Error fetching issue detail:', error);
      }
    };
    fetchIssueDetail();
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/project/findById?id=${projectId}`);
        setProjectLeaderId(response.data.data.leaderId);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchProjectDetails();
  }, [issueId, projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const updatedIssue = { ...issue, status: newStatus };
      const response = await axiosInstance.post(`/api/v1/issue/update`, updatedIssue);
      setIssue(response.data.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEditIssue = () => {
    setShowForm(true);
  };

  const handleUpdateIssue = async () => {
    try {
      await axiosInstance.post(`/api/v1/issue/update`, {
        ...issue,
        ...newIssue,
      });
      setShowForm(false);
      const response = await axiosInstance.get(`/api/v1/issue/findById`, {
        params: { id: issueId }
      });
      setIssue(response.data.data);
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const handleDeleteIssue = async () => {
    try {
      await axiosInstance.delete(`/api/v1/issue/delete`, { params: { id: issueId } });
      navigate(`/project/${projectId}/issue`);
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
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
    const taskName = `Issue: ${issue.description}`;

    try {
      await axiosInstance.post(`/api/v1/task/create`, {
        ...newTask,
        name: taskName,
        projectId: projectId,
        issueId: issueId,
        createdBy: userId,
        startDate: currentDate,
      });
      setShowTaskForm(false);
      setNewTask({ name: '', description: '', startDate: '', dueDate: '', lifeCycle: 'DEVELOP', priority: issue.priority });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setNewTask({ name: '', description: '', startDate: '', dueDate: '', lifeCycle: 'DEVELOP', priority: issue.priority });
  };

  if (!issue) {
    return <p>Loading issue details...</p>;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10}  className='content-style'>
          <Card className="mt-4 card-style">
            <Card.Body>
              <Card.Title>{issue.description}</Card.Title>
              <Card.Text><strong>Content:</strong> {issue.content}</Card.Text>
              <Card.Text><strong>URL:</strong> <a href={issue.url} target="_blank" rel="noopener noreferrer">{issue.url}</a></Card.Text>
              <Card.Text>
                <strong>Status:</strong>
                <Form.Select
                  value={newStatus}
                  onChange={handleStatusChange}
                  className={`text-${statusColors[newStatus]}`}
                >
                  <option value="OPEN" className="text-danger">OPEN</option>
                  <option value="IN_PROGRESS" className="text-warning">IN_PROGRESS</option>
                  <option value="SOLVED" className="text-success">SOLVED</option>
                  <option value="CLOSED" className="text-secondary">CLOSED</option>
                </Form.Select>
                {projectLeaderId === parseInt(userId, 10) && (
                  <div>
                    <Button variant="success" className="mt-2" onClick={handleUpdateStatus}>
                      Update Status
                    </Button>
                  </div>
                )}
              </Card.Text>
              <Card.Text><strong>Priority:</strong> {issue.priority}</Card.Text>
{/*              <Card.Text><strong>Created By:</strong> {issue.createdBy}</Card.Text> */}
              <Card.Text><strong>Created At:</strong> {formatDate(issue.createdAt)}</Card.Text>
              <Card.Text><strong>Solved At:</strong> {issue.solvedAt ? formatDate(issue.solvedAt) : 'N/A'}</Card.Text>
              {projectLeaderId === parseInt(userId, 10) && (
                  <div>
                    <Button variant="success" className="mt-3 me-2" onClick={handleEditIssue}>
                      Edit Issue
                    </Button>
                    <Button variant="danger" className="mt-3 me-2" onClick={handleDeleteIssue}>
                      Delete Issue
                    </Button>
                    <Button variant="warning" className="mt-3 me-2" onClick={() => setShowTaskForm(true)}>
                      Create Task
                    </Button>
                  </div>
                )}
              <Button variant="secondary" className="mt-3 me-2" onClick={() => navigate(`/project/${projectId}/issue`)}>
                Back to Issue List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue</Modal.Title>
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formIssueUrl" className="mb-3">
              <Form.Label>Detail</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter issue URL"
                name="url"
                value={newIssue.url}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formIssueStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newIssue.status}
                onChange={handleInputChange}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formIssuePriority" className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newIssue.priority}
                onChange={handleInputChange}
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
          <Button variant="success" onClick={handleUpdateIssue}>
            Update Issue
          </Button>
          <Button variant="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
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

export default IssueDetail;
