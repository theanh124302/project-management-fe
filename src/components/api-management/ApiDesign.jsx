import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskList.css';

const backendUrl = 'http://localhost:8080';

const ApiDesign = () => {
  const { projectId, folderId, apiId } = useParams();
  const [params, setParams] = useState([]);
  const [bodies, setBodies] = useState([]);
  const [authRoles, setAuthRoles] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [designResponses, setDesignResponses] = useState([]);
  const [api, setApi] = useState(null);
  const [showParamForm, setShowParamForm] = useState(false);
  const [showBodyForm, setShowBodyForm] = useState(false);
  const [showAuthRoleForm, setShowAuthRoleForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [showDesignResponseForm, setShowDesignResponseForm] = useState(false);
  const [showApiForm, setShowApiForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentParam, setCurrentParam] = useState(null);
  const [currentBody, setCurrentBody] = useState(null);
  const [currentAuthRole, setCurrentAuthRole] = useState(null);
  const [currentHeader, setCurrentHeader] = useState(null);
  const [currentDesignResponse, setCurrentDesignResponse] = useState(null);
  const [apiDetails, setApiDetails] = useState({ method: '', url: '' });
  const [newParam, setNewParam] = useState({ paramKey: '', type: '', description: '', sample: '' });
  const [newBody, setNewBody] = useState({ bodyKey: '', type: '', description: '', sample: '' });
  const [newAuthRole, setNewAuthRole] = useState({ role: '' });
  const [newHeader, setNewHeader] = useState({ headerKey: '', type: '', description: '', sample: '' });
  const [newDesignResponse, setNewDesignResponse] = useState({ description: '', value: '' });
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: '',
    lifeCycle: 'DESIGN'
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/param/findByApiId?apiId=${apiId}`);
        setParams(response.data.data);
      } catch (error) {
        console.error('Error fetching params:', error);
      }
    };

    const fetchBodies = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/body/findByApiId?apiId=${apiId}`);
        setBodies(response.data.data);
      } catch (error) {
        console.error('Error fetching bodies:', error);
      }
    };

    const fetchAuthRoles = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/auth-role/findByApiId?apiId=${apiId}`);
        setAuthRoles(response.data.data);
      } catch (error) {
        console.error('Error fetching auth roles:', error);
      }
    };

    const fetchHeaders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/header/findByApiId?apiId=${apiId}`);
        setHeaders(response.data.data);
      } catch (error) {
        console.error('Error fetching headers:', error);
      }
    };

    const fetchDesignResponses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/design-response/findByApiId?apiId=${apiId}`);
        setDesignResponses(response.data.data);
      } catch (error) {
        console.error('Error fetching design responses:', error);
      }
    };

    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        setApiDetails({ method: response.data.data.method, url: response.data.data.url });
        setApi(response.data.data);
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    fetchParams();
    fetchBodies();
    fetchAuthRoles();
    fetchHeaders();
    fetchDesignResponses();
    fetchApiDetails();
  }, [apiId]);

  const handleParamInputChange = (e) => {
    const { name, value } = e.target;
    setNewParam({ ...newParam, [name]: value });
  };

  const handleBodyInputChange = (e) => {
    const { name, value } = e.target;
    setNewBody({ ...newBody, [name]: value });
  };

  const handleApiInputChange = (e) => {
    const { name, value } = e.target;
    setApiDetails({ ...apiDetails, [name]: value });
  };

  const handleAuthRoleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAuthRole({ ...newAuthRole, [name]: value });
  };

  const handleHeaderInputChange = (e) => {
    const { name, value } = e.target;
    setNewHeader({ ...newHeader, [name]: value });
  };

  const handleDesignResponseInputChange = (e) => {
    const { name, value } = e.target;
    setNewDesignResponse({ ...newDesignResponse, [name]: value });
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddParam = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/param/create`, { ...newParam, apiId });
      setShowParamForm(false);
      setNewParam({ paramKey: '', type: '', description: '', sample: '' });
      const response = await axios.get(`${backendUrl}/api/v1/param/findByApiId?apiId=${apiId}`);
      setParams(response.data.data);
    } catch (error) {
      console.error('Error adding param:', error);
    }
  };

  const handleAddBody = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/body/create`, { ...newBody, apiId });
      setShowBodyForm(false);
      setNewBody({ bodyKey: '', type: '', description: '', sample: '' });
      const response = await axios.get(`${backendUrl}/api/v1/body/findByApiId?apiId=${apiId}`);
      setBodies(response.data.data);
    } catch (error) {
      console.error('Error adding body:', error);
    }
  };

  const handleAddAuthRole = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/auth-role/create`, { ...newAuthRole, apiId });
      setShowAuthRoleForm(false);
      setNewAuthRole({ role: '' });
      const response = await axios.get(`${backendUrl}/api/v1/auth-role/findByApiId?apiId=${apiId}`);
      setAuthRoles(response.data.data);
    } catch (error) {
      console.error('Error adding auth role:', error);
    }
  };

  const handleAddHeader = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/header/create`, { ...newHeader, apiId });
      setShowHeaderForm(false);
      setNewHeader({ headerKey: '', type: '', description: '', sample: '' });
      const response = await axios.get(`${backendUrl}/api/v1/header/findByApiId?apiId=${apiId}`);
      setHeaders(response.data.data);
    } catch (error) {
      console.error('Error adding header:', error);
    }
  };

  const handleAddDesignResponse = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/design-response/create`, { ...newDesignResponse, apiId });
      setShowDesignResponseForm(false);
      setNewDesignResponse({ description: '', value: '' });
      const response = await axios.get(`${backendUrl}/api/v1/design-response/findByApiId?apiId=${apiId}`);
      setDesignResponses(response.data.data);
    } catch (error) {
      console.error('Error adding design response:', error);
    }
  };

  const handleAddTask = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Ngày hiện tại
    const taskName = `Task for ${api.name} on ${currentDate}`; // Tên task dựa trên tiêu đề và ngày hiện tại

    try {
      await axios.post(`${backendUrl}/api/v1/task/create`, {
        ...newTask,
        name: taskName,
        projectId: projectId,
        apiId: apiId,
        createdBy: userId,
        lifeCycle: 'DESIGN',
        startDate: currentDate // Ngày tạo task
      });
      setShowTaskForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'DESIGN' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateParam = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/param/update`, { id: currentParam.id, apiId, ...newParam });
      setShowParamForm(false);
      setNewParam({ paramKey: '', type: '', description: '', sample: '' });
      setCurrentParam(null);
      const response = await axios.get(`${backendUrl}/api/v1/param/findByApiId?apiId=${apiId}`);
      setParams(response.data.data);
    } catch (error) {
      console.error('Error updating param:', error);
    }
  };

  const handleUpdateBody = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/body/update`, { id: currentBody.id, apiId, ...newBody });
      setShowBodyForm(false);
      setNewBody({ bodyKey: '', type: '', description: '', sample: '' });
      setCurrentBody(null);
      const response = await axios.get(`${backendUrl}/api/v1/body/findByApiId?apiId=${apiId}`);
      setBodies(response.data.data);
    } catch (error) {
      console.error('Error updating body:', error);
    }
  };

  const handleUpdateAuthRole = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/auth-role/update`, { id: currentAuthRole.id, apiId, ...newAuthRole });
      setShowAuthRoleForm(false);
      setNewAuthRole({ role: '' });
      setCurrentAuthRole(null);
      const response = await axios.get(`${backendUrl}/api/v1/auth-role/findByApiId?apiId=${apiId}`);
      setAuthRoles(response.data.data);
    } catch (error) {
      console.error('Error updating auth role:', error);
    }
  };

  const handleUpdateHeader = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/header/update`, { id: currentHeader.id, apiId, ...newHeader });
      setShowHeaderForm(false);
      setNewHeader({ headerKey: '', type: '', description: '', sample: '' });
      setCurrentHeader(null);
      const response = await axios.get(`${backendUrl}/api/v1/header/findByApiId?apiId=${apiId}`);
      setHeaders(response.data.data);
    } catch (error) {
      console.error('Error updating header:', error);
    }
  };

  const handleUpdateDesignResponse = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/design-response/update`, { id: currentDesignResponse.id, apiId, ...newDesignResponse });
      setShowDesignResponseForm(false);
      setNewDesignResponse({ description: '', value: '' });
      setCurrentDesignResponse(null);
      const response = await axios.get(`${backendUrl}/api/v1/design-response/findByApiId?apiId=${apiId}`);
      setDesignResponses(response.data.data);
    } catch (error) {
      console.error('Error updating design response:', error);
    }
  };

  const handleUpdateApiDetails = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/api/updateUrlAndMethod`, null, {
        params: { id: apiId, url: apiDetails.url, method: apiDetails.method },
      });
      setShowApiForm(false);
    } catch (error) {
      console.error('Error updating API details:', error);
    }
  };

  const handleDeleteParam = async (paramId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/param/delete`, { params: { id: paramId } });
      const response = await axios.get(`${backendUrl}/api/v1/param/findByApiId?apiId=${apiId}`);
      setParams(response.data.data);
    } catch (error) {
      console.error('Error deleting param:', error);
    }
  };

  const handleDeleteBody = async (bodyId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/body/delete`, { params: { id: bodyId } });
      const response = await axios.get(`${backendUrl}/api/v1/body/findByApiId?apiId=${apiId}`);
      setBodies(response.data.data);
    } catch (error) {
      console.error('Error deleting body:', error);
    }
  };

  const handleDeleteAuthRole = async (authRoleId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/auth-role/delete`, { params: { id: authRoleId } });
      const response = await axios.get(`${backendUrl}/api/v1/auth-role/findByApiId?apiId=${apiId}`);
      setAuthRoles(response.data.data);
    } catch (error) {
      console.error('Error deleting auth role:', error);
    }
  };

  const handleDeleteHeader = async (headerId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/header/delete`, { params: { id: headerId } });
      const response = await axios.get(`${backendUrl}/api/v1/header/findByApiId?apiId=${apiId}`);
      setHeaders(response.data.data);
    } catch (error) {
      console.error('Error deleting header:', error);
    }
  };

  const handleDeleteDesignResponse = async (designResponseId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/design-response/delete`, { params: { id: designResponseId } });
      const response = await axios.get(`${backendUrl}/api/v1/design-response/findByApiId?apiId=${apiId}`);
      setDesignResponses(response.data.data);
    } catch (error) {
      console.error('Error deleting design response:', error);
    }
  };

  const handleEditParamClick = (param) => {
    setNewParam({ paramKey: param.paramKey, type: param.type, description: param.description, sample: param.sample });
    setCurrentParam(param);
    setShowParamForm(true);
  };

  const handleEditBodyClick = (body) => {
    setNewBody({ bodyKey: body.bodyKey, type: body.type, description: body.description, sample: body.sample });
    setCurrentBody(body);
    setShowBodyForm(true);
  };

  const handleEditAuthRoleClick = (authRole) => {
    setNewAuthRole({ role: authRole.role });
    setCurrentAuthRole(authRole);
    setShowAuthRoleForm(true);
  };

  const handleEditHeaderClick = (header) => {
    setNewHeader({ headerKey: header.headerKey, type: header.type, description: header.description, sample: header.sample });
    setCurrentHeader(header);
    setShowHeaderForm(true);
  };

  const handleEditDesignResponseClick = (designResponse) => {
    setNewDesignResponse({ description: designResponse.description, value: designResponse.value });
    setCurrentDesignResponse(designResponse);
    setShowDesignResponseForm(true);
  };

  const handleEditApiClick = () => {
    setShowApiForm(true);
  };

  const handleCloseParamForm = () => {
    setShowParamForm(false);
    setCurrentParam(null);
    setNewParam({ paramKey: '', type: '', description: '', sample: '' });
  };

  const handleCloseBodyForm = () => {
    setShowBodyForm(false);
    setCurrentBody(null);
    setNewBody({ bodyKey: '', type: '', description: '', sample: '' });
  };

  const handleCloseAuthRoleForm = () => {
    setShowAuthRoleForm(false);
    setCurrentAuthRole(null);
    setNewAuthRole({ role: '' });
  };

  const handleCloseHeaderForm = () => {
    setShowHeaderForm(false);
    setCurrentHeader(null);
    setNewHeader({ headerKey: '', type: '', description: '', sample: '' });
  };

  const handleCloseDesignResponseForm = () => {
    setShowDesignResponseForm(false);
    setCurrentDesignResponse(null);
    setNewDesignResponse({ description: '', value: '' });
  };

  const handleCloseApiForm = () => {
    setShowApiForm(false);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '', lifeCycle: 'DESIGN' });
  };

  if (!api) {
    return <p>Loading API details...</p>;
  }

  return (
    <Container fluid className="api-design-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Design: {api.name}</Card.Title>
              <ListGroup className="mb-3">
                <ListGroup.Item>
                  <div>
                    <strong>Method:</strong> {apiDetails.method}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    <strong>URL:</strong> {apiDetails.url}
                  </div>
                </ListGroup.Item>
                <Button variant="outline-primary" size="sm" onClick={handleEditApiClick}>
                  Edit API Details
                </Button>
              </ListGroup>
              <Card.Title className="mt-4">API Params</Card.Title>
              <ListGroup className="mb-3">
                {params.map((param) => (
                  <ListGroup.Item key={param.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{param.paramKey}</strong>: {param.description} ({param.type}) - Sample: {param.sample}
                    </div>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditParamClick(param)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteParam(param.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="secondary" onClick={() => setShowParamForm(true)}>
                Add Param
              </Button>
              <Card.Title className="mt-4">API Bodies</Card.Title>
              <ListGroup className="mb-3">
                {bodies.map((body) => (
                  <ListGroup.Item key={body.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{body.bodyKey}</strong>: {body.description} ({body.type}) - Sample: {body.sample}
                    </div>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditBodyClick(body)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBody(body.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="secondary" onClick={() => setShowBodyForm(true)}>
                Add Body
              </Button>
              <Card.Title className="mt-4">API Access Roles</Card.Title>
              <ListGroup className="mb-3">
                {authRoles.map((authRole) => (
                  <ListGroup.Item key={authRole.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{authRole.role}</strong>
                    </div>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditAuthRoleClick(authRole)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAuthRole(authRole.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="secondary" onClick={() => setShowAuthRoleForm(true)}>
                Add Role
              </Button>
              <Card.Title className="mt-4">API Headers</Card.Title>
              <ListGroup className="mb-3">
                {headers.map((header) => (
                  <ListGroup.Item key={header.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{header.headerKey}</strong>: {header.description} ({header.type}) - Sample: {header.sample}
                    </div>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditHeaderClick(header)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteHeader(header.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="secondary" onClick={() => setShowHeaderForm(true)}>
                Add Header
              </Button>
              <Card.Title className="mt-4">Design Responses</Card.Title>
              <ListGroup className="mb-3">
                {designResponses.map((designResponse) => (
                  <ListGroup.Item key={designResponse.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{designResponse.description}</strong>: {designResponse.value}
                    </div>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditDesignResponseClick(designResponse)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDesignResponse(designResponse.id)}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button variant="secondary" onClick={() => setShowDesignResponseForm(true)}>
                Add Design Response
              </Button>
              <Button variant="secondary" onClick={() => setShowTaskForm(true)} className="me-2">
                Create Task
              </Button>
              <Modal show={showApiForm} onHide={handleCloseApiForm}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit API Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formApiMethod" className="mb-3">
                      <Form.Label>Method</Form.Label>
                      <Form.Control
                        as="select"
                        name="method"
                        value={apiDetails.method}
                        onChange={handleApiInputChange}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formApiUrl" className="mb-3">
                      <Form.Label>URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="url"
                        value={apiDetails.url}
                        onChange={handleApiInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseApiForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdateApiDetails}>
                    Update API Details
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showParamForm} onHide={handleCloseParamForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentParam ? 'Edit Param' : 'Add New Param'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formParamKey" className="mb-3">
                      <Form.Label>Param Key</Form.Label>
                      <Form.Control
                        type="text"
                        name="paramKey"
                        value={newParam.paramKey}
                        onChange={handleParamInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formParamType" className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="type"
                        value={newParam.type}
                        onChange={handleParamInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formParamDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={newParam.description}
                        onChange={handleParamInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formParamSample" className="mb-3">
                      <Form.Label>Sample</Form.Label>
                      <Form.Control
                        type="text"
                        name="sample"
                        value={newParam.sample}
                        onChange={handleParamInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseParamForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentParam ? handleUpdateParam : handleAddParam}>
                    {currentParam ? 'Update Param' : 'Add Param'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showBodyForm} onHide={handleCloseBodyForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentBody ? 'Edit Body' : 'Add New Body'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formBodyKey" className="mb-3">
                      <Form.Label>Body Key</Form.Label>
                      <Form.Control
                        type="text"
                        name="bodyKey"
                        value={newBody.bodyKey}
                        onChange={handleBodyInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBodyType" className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="type"
                        value={newBody.type}
                        onChange={handleBodyInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBodyDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={newBody.description}
                        onChange={handleBodyInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBodySample" className="mb-3">
                      <Form.Label>Sample</Form.Label>
                      <Form.Control
                        type="text"
                        name="sample"
                        value={newBody.sample}
                        onChange={handleBodyInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseBodyForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentBody ? handleUpdateBody : handleAddBody}>
                    {currentBody ? 'Update Body' : 'Add Body'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showAuthRoleForm} onHide={handleCloseAuthRoleForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentAuthRole ? 'Edit Auth Role' : 'Add New Auth Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formAuthRole" className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        name="role"
                        value={newAuthRole.role}
                        onChange={handleAuthRoleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAuthRoleForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentAuthRole ? handleUpdateAuthRole : handleAddAuthRole}>
                    {currentAuthRole ? 'Update Auth Role' : 'Add Auth Role'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showHeaderForm} onHide={handleCloseHeaderForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentHeader ? 'Edit Header' : 'Add New Header'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formHeaderKey" className="mb-3">
                      <Form.Label>Header Key</Form.Label>
                      <Form.Control
                        type="text"
                        name="headerKey"
                        value={newHeader.headerKey}
                        onChange={handleHeaderInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formHeaderType" className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="type"
                        value={newHeader.type}
                        onChange={handleHeaderInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formHeaderDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={newHeader.description}
                        onChange={handleHeaderInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formHeaderSample" className="mb-3">
                      <Form.Label>Sample</Form.Label>
                      <Form.Control
                        type="text"
                        name="sample"
                        value={newHeader.sample}
                        onChange={handleHeaderInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseHeaderForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentHeader ? handleUpdateHeader : handleAddHeader}>
                    {currentHeader ? 'Update Header' : 'Add Header'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showDesignResponseForm} onHide={handleCloseDesignResponseForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentDesignResponse ? 'Edit Design Response' : 'Add New Design Response'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formDesignResponseDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={newDesignResponse.description}
                        onChange={handleDesignResponseInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDesignResponseValue" className="mb-3">
                      <Form.Label>Value</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="value"
                        value={newDesignResponse.value}
                        onChange={handleDesignResponseInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDesignResponseForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentDesignResponse ? handleUpdateDesignResponse : handleAddDesignResponse}>
                    {currentDesignResponse ? 'Update Design Response' : 'Add Design Response'}
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

export default ApiDesign;
