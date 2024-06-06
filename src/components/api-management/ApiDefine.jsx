import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const ApiDefine = () => {
  const { projectId, folderId, apiId } = useParams();
  const [api, setApi] = useState(null);
  const [docs, setDocs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    userRequirements: '',
    technicalRequirements: '',
    businessProcess: '',
    useCaseDiagram: '',
    sequenceDiagram: '',
    activityDiagram: '',
    classDiagram: ''
  });
  const [showDocForm, setShowDocForm] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [newDoc, setNewDoc] = useState({ description: '', url: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: ''
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        setApi(response.data.data);
        setFormData({
          name: response.data.data.name,
          description: response.data.data.description,
          userRequirements: response.data.data.userRequirements,
          technicalRequirements: response.data.data.technicalRequirements,
          businessProcess: response.data.data.businessProcess,
          useCaseDiagram: response.data.data.useCaseDiagram,
          sequenceDiagram: response.data.data.sequenceDiagram,
          activityDiagram: response.data.data.activityDiagram,
          classDiagram: response.data.data.classDiagram
        });
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    const fetchDocs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
        setDocs(response.data.data);
      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    fetchApiDetails();
    fetchDocs();
  }, [apiId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoc({ ...newDoc, [name]: value });
  };

  const handleUpdateApi = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/api/update`, { id: apiId, folderId: folderId, ...formData });
      navigate(`/project/${projectId}/folder/${folderId}/apis`);
    } catch (error) {
      console.error('Error updating API:', error);
    }
  };

  const handleDeleteApi = async () => {
    try {
      await axios.delete(`${backendUrl}/api/v1/api/delete`, { data: { id: apiId } });
      navigate(`/project/${projectId}/folder/${folderId}/apis`);
    } catch (error) {
      console.error('Error deleting API:', error);
    }
  };

  const handleAddDoc = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/docs/create`, { ...newDoc, apiId });
      setShowDocForm(false);
      setNewDoc({ description: '', url: '' });
      const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
      setDocs(response.data.data);
    } catch (error) {
      console.error('Error adding doc:', error);
    }
  };

  const handleUpdateDoc = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/docs/update`, { id: currentDoc.id, apiId, ...newDoc });
      setShowDocForm(false);
      setNewDoc({ description: '', url: '' });
      setCurrentDoc(null);
      const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
      setDocs(response.data.data);
    } catch (error) {
      console.error('Error updating doc:', error);
    }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/docs/delete`, { params: { id: docId, deletedBy: userId } });
      const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
      setDocs(response.data.data);
    } catch (error) {
      console.error('Error deleting doc:', error);
    }
  };

  const handleEditDocClick = (doc) => {
    setNewDoc({ description: doc.description, url: doc.url });
    setCurrentDoc(doc);
    setShowDocForm(true);
  };

  const handleCloseDocForm = () => {
    setShowDocForm(false);
    setCurrentDoc(null);
    setNewDoc({ description: '', url: '' });
  };

  const getFormattedUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  const handleNavigateToDesign = () => {
    navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/design`);
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

    try {
      await axios.post(`${backendUrl}/api/v1/task/create`, {
        ...newTask,
        projectId: projectId,
        apiId: apiId,
        createdBy: userId,
      });
      setShowTaskForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '' });
  };

  if (!api) {
    return <p>Loading API details...</p>;
  }

  return (
    <Container fluid className="api-define-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Define: {api.name}</Card.Title>
              <Form>
                <Form.Group controlId="formApiName" className="mb-3">
                  <Form.Label>API Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formApiDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formUserRequirements" className="mb-3">
                  <Form.Label>User Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="userRequirements"
                    value={formData.userRequirements}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formTechnicalRequirements" className="mb-3">
                  <Form.Label>Technical Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="technicalRequirements"
                    value={formData.technicalRequirements}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formBusinessProcess" className="mb-3">
                  <Form.Label>Business Process</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="businessProcess"
                    value={formData.businessProcess}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formUseCaseDiagram" className="mb-3">
                  <Form.Label>Use Case Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="useCaseDiagram"
                    value={formData.useCaseDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formSequenceDiagram" className="mb-3">
                  <Form.Label>Sequence Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="sequenceDiagram"
                    value={formData.sequenceDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formActivityDiagram" className="mb-3">
                  <Form.Label>Activity Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="activityDiagram"
                    value={formData.activityDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formClassDiagram" className="mb-3">
                  <Form.Label>Class Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="classDiagram"
                    value={formData.classDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
              <Button variant="primary" onClick={handleUpdateApi} className="me-2">
                Update API
              </Button>
              <Button variant="danger" onClick={handleDeleteApi} className="me-2">
                Delete API
              </Button>
              <Button variant="secondary" onClick={handleNavigateToDesign} className="me-2">
                Design
              </Button>
              <Button variant="secondary" onClick={() => setShowTaskForm(true)} className="me-2">
                Create Task
              </Button>
              <h3 className="mt-4">Related Docs</h3>
              <ListGroup className="mb-3">
                {docs.map((doc) => (
                  <ListGroup.Item key={doc.id} className="d-flex justify-content-between align-items-center">
                    <a href={getFormattedUrl(doc.url)} target="_blank" rel="noopener noreferrer">
                      {doc.description}
                    </a>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditDocClick(doc)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDoc(doc.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="secondary" onClick={() => setShowDocForm(true)}>
                Add Doc
              </Button>
              <Modal show={showDocForm} onHide={handleCloseDocForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentDoc ? 'Edit Doc' : 'Add New Doc'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formDocDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={newDoc.description}
                        onChange={handleDocInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDocUrl" className="mb-3">
                      <Form.Label>URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="url"
                        value={newDoc.url}
                        onChange={handleDocInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDocForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentDoc ? handleUpdateDoc : handleAddDoc}>
                    {currentDoc ? 'Update Doc' : 'Add Doc'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showTaskForm} onHide={handleCloseTaskForm}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Task</Modal.Title>
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
                  <Button variant="secondary" onClick={handleCloseTaskForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleAddTask}>
                    Add Task
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiDefine;
