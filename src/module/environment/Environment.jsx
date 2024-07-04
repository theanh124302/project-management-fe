import React, { useState, useEffect } from 'react';
import axiosInstance from '../AxiosInstance';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Form, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import '../../public/css/Styles.css';

const EnvironmentList = () => {
  const { projectId } = useParams();
  const [environments, setEnvironments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchEnvironments();
  }, []);

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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/environment/delete`, {
        params: { id },
      });
      fetchEnvironments();
    } catch (error) {
      console.error('Error deleting environment:', error);
    }
  };

  const handleShowModal = (environment) => {
    setSelectedEnvironment(environment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEnvironment(null);
  };

  const handleShowUploadModal = () => {
    setName('');
    setDescription('');
    setUrl('');
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleUpload = async () => {
    const environment = {
      projectId,
      name,
      description,
      url,
    };

    try {
      await axiosInstance.post(`/api/v1/environment/create`, environment);
      fetchEnvironments();
      handleCloseUploadModal();
    } catch (error) {
      console.error('Error creating environment:', error);
      alert('Failed to create environment');
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
          <Card className="mt-4 project-card">
            <Card.Body>
              <Button variant="success" onClick={handleShowUploadModal}>Add Environment</Button>
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {environments.map((environment) => (
                    <tr key={environment.id}>
                      <td>{environment.name}</td>
                      <td>{environment.description}</td>
                      <td>{environment.url}</td>
                      <td>
                        <Button onClick={() => handleShowModal(environment)} className="me-2 button-style">
                          View
                        </Button>
                        <Button variant="danger" className="me-2" onClick={() => handleDelete(environment.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Environment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedEnvironment && (
                    <div>
                      <p><strong>Name:</strong> {selectedEnvironment.name}</p>
                      <p><strong>Description:</strong> {selectedEnvironment.description}</p>
                      <p><strong>URL:</strong> <a href={selectedEnvironment.url} target="_blank" rel="noopener noreferrer">{selectedEnvironment.url}</a></p>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Create Environment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" value={name} onChange={handleNameChange} />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control type="text" value={description} onChange={handleDescriptionChange} />
                    </Form.Group>
                    <Form.Group controlId="formUrl" className="mb-3">
                      <Form.Label>URL</Form.Label>
                      <Form.Control type="text" value={url} onChange={handleUrlChange} />
                    </Form.Group>
                    <Button variant="success" onClick={handleUpload}>
                      Create
                    </Button>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseUploadModal}>
                    Close
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

export default EnvironmentList;
