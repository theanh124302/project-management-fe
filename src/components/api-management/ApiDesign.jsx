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
  const [showParamForm, setShowParamForm] = useState(false);
  const [showBodyForm, setShowBodyForm] = useState(false);
  const [currentParam, setCurrentParam] = useState(null);
  const [currentBody, setCurrentBody] = useState(null);
  const [newParam, setNewParam] = useState({ paramKey: '', type: '', description: '', sample: '' });
  const [newBody, setNewBody] = useState({ bodyKey: '', type: '', description: '', sample: '' });

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

    fetchParams();
    fetchBodies();
  }, [apiId]);

  const handleParamInputChange = (e) => {
    const { name, value } = e.target;
    setNewParam({ ...newParam, [name]: value });
  };

  const handleBodyInputChange = (e) => {
    const { name, value } = e.target;
    setNewBody({ ...newBody, [name]: value });
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
              <Card.Title>API Params</Card.Title>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiDesign;
