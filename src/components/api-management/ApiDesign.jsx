import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
  const [showParamForm, setShowParamForm] = useState(false);
  const [showBodyForm, setShowBodyForm] = useState(false);
  const [showAuthRoleForm, setShowAuthRoleForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [showApiForm, setShowApiForm] = useState(false);
  const [currentParam, setCurrentParam] = useState(null);
  const [currentBody, setCurrentBody] = useState(null);
  const [currentAuthRole, setCurrentAuthRole] = useState(null);
  const [currentHeader, setCurrentHeader] = useState(null);
  const [apiDetails, setApiDetails] = useState({ method: '', url: '' });
  const [newParam, setNewParam] = useState({ paramKey: '', type: '', description: '', sample: '' });
  const [newBody, setNewBody] = useState({ bodyKey: '', type: '', description: '', sample: '' });
  const [newAuthRole, setNewAuthRole] = useState({ role: '' });
  const [newHeader, setNewHeader] = useState({ headerKey: '', type: '', description: '', sample: '' });

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

    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        setApiDetails({ method: response.data.data.method, url: response.data.data.url });
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    fetchParams();
    fetchBodies();
    fetchAuthRoles();
    fetchHeaders();
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

  const handleCloseApiForm = () => {
    setShowApiForm(false);
  };

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
              <Card.Title>API Details</Card.Title>
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
                  <Modal.Title>{currentAuthRole ? 'Edit Role' : 'Add New Role'}</Modal.Title>
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
                    {currentAuthRole ? 'Update Role' : 'Add Role'}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiDesign;
