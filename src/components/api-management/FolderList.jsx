import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const FolderList = () => {
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolder, setNewFolder] = useState({ name: '' });
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/project/findById?id=${projectId}`);
        setProjectLeaderId(response.data.data.leaderId);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    const fetchFolders = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/folder/findByProjectId?projectId=${projectId}`);
        setFolders(response.data.data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchProjectDetails();
    fetchFolders();
  }, [projectId]);

  const handleAddFolder = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      await axiosInstance.post(`/api/v1/folder/create`, { name: newFolder.name, projectId });
      setShowForm(false);
      setNewFolder({ name: '' });
      const response = await axiosInstance.get(`/api/v1/folder/findByProjectId?projectId=${projectId}`);
      setFolders(response.data.data);
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/folder/delete`, { params: { id } });
      const response = await axiosInstance.get(`/api/v1/folder/findByProjectId?projectId=${projectId}`);
      setFolders(response.data.data);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleEditFolder = (folder) => {
    setCurrentFolder(folder);
    setNewFolder({ name: folder.name });
    setShowForm(true);
  };

  const handleUpdateFolder = async () => {
    try {
      await axiosInstance.post(`/api/v1/folder/update`, { id: currentFolder.id, name: newFolder.name, projectId });
      setShowForm(false);
      setNewFolder({ name: '' });
      setCurrentFolder(null);
      const response = await axiosInstance.get(`/api/v1/folder/findByProjectId?projectId=${projectId}`);
      setFolders(response.data.data);
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleFolderClick = (folderId) => {
    navigate(`/project/${projectId}/folder/${folderId}/apis`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentFolder(null);
    setNewFolder({ name: '' });
  };

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10} className='content-style'>
          <h2>Folder List</h2>
          <Row>
            {folders.map((folder) => (
              <Col key={folder.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleFolderClick(folder.id)} className="card-style" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{folder.name}</Card.Title>
                    {projectLeaderId === parseInt(userId, 10) && (
                      <div className="buttons-style">
                        <Button variant="light" onClick={(e) => { e.stopPropagation(); handleEditFolder(folder); }} className="me-2">
                          Edit
                        </Button>
                        <Button variant="light" onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card onClick={() => setShowForm(true)} className="card-style" style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1>+</h1>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>{currentFolder ? 'Edit Folder' : 'Add New Folder'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formFolderName" className="mb-3">
                  <Form.Label>Folder Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter folder name"
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={currentFolder ? handleUpdateFolder : handleAddFolder}>
                {currentFolder ? 'Update Folder' : 'Add Folder'}
              </Button>
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default FolderList;
