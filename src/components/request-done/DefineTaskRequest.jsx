import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const DefineTaskRequest = () => {
  const { taskId, projectId } = useParams();
  const [defineRequests, setDefineRequests] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [newDefineRequest, setNewDefineRequest] = useState({
    description: '',
    content: '',
    projectId: projectId,
    taskId: taskId,
    userId: localStorage.getItem('userId')
  });

  useEffect(() => {
    fetchTaskName();
    fetchDefineRequests();
  }, []);

  const fetchTaskName = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/task/findById`, {
        params: { id: taskId }
      });
      const taskData = response.data.data;
      setTaskName(taskData.name);
      setNewDefineRequest(prevState => ({
        ...prevState,
        description: `Request done for task ${taskData.name}`
      }));
    } catch (error) {
      console.error('Error fetching task name:', error);
    }
  };

  const fetchDefineRequests = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/define-request/findByTaskId`, {
        params: { taskId }
      });
      setDefineRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching define requests:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/define-request/create`, newDefineRequest);
      fetchDefineRequests();
      setNewDefineRequest({
        description: `Request done for task ${taskName}`,
        content: '',
        projectId: projectId,
        taskId: taskId,
        userId: localStorage.getItem('userId')
      });
    } catch (error) {
      console.error('Error creating define request:', error);
    }
  };

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Create Define Request</Card.Title>
              <Form>
                <Form.Group controlId="formDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={newDefineRequest.description}
                    onChange={(e) => setNewDefineRequest({ ...newDefineRequest, description: e.target.value })}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="formContent" className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter content"
                    value={newDefineRequest.content}
                    onChange={(e) => setNewDefineRequest({ ...newDefineRequest, content: e.target.value })}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleCreate}>
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Previous Define Requests</Card.Title>
              <ListGroup>
                {defineRequests.map(request => (
                  <ListGroupItem key={request.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Description:</strong> {request.description}
                      <br />
                      <strong>Content:</strong> {request.content}
                      <br />
                      <strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DefineTaskRequest;
