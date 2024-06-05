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
  const [showParamForm, setShowParamForm] = useState(false);
  const [currentParam, setCurrentParam] = useState(null);
  const [newParam, setNewParam] = useState({ paramKey: '', type: '', description: '', sample: '' });

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/param/findByApiId?apiId=${apiId}`);
        setParams(response.data.data);
      } catch (error) {
        console.error('Error fetching params:', error);
      }
    };

    fetchParams();
  }, [apiId]);

  const handleParamInputChange = (e) => {
    const { name, value } = e.target;
    setNewParam({ ...newParam, [name]: value });
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

  const handleDeleteParam = async (paramId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/param/delete`, { params: { id: paramId } });
      const response = await axios.get(`${backendUrl}/api/v1/param/findByApiId?apiId=${apiId}`);
      setParams(response.data.data);
    } catch (error) {
      console.error('Error deleting param:', error);
    }
  };

  const handleEditParamClick = (param) => {
    setNewParam({ paramKey: param.paramKey, type: param.type, description: param.description, sample: param.sample });
    setCurrentParam(param);
    setShowParamForm(true);
  };

  const handleCloseParamForm = () => {
    setShowParamForm(false);
    setCurrentParam(null);
    setNewParam({ paramKey: '', type: '', description: '', sample: '' });
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiDesign;
