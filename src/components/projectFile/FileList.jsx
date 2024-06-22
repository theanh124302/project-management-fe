import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Form, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const FileList = () => {
  const { projectId } = useParams();
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/v1/project-file/findByProjectId`, {
        params: { projectId, page: 0, size: 10 },
      });
      setFiles(response.data.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axiosInstance.delete(`${backendUrl}/api/v1/project-file/delete`, {
        params: { id: fileId },
      });
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleShowModal = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  const handleShowUploadModal = () => {
    setFile(null);
    setDescription('');
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('description', description);

    try {
      await axiosInstance.post(`${backendUrl}/api/v1/project-file/create`, formData);
      fetchFiles();
      handleCloseUploadModal();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
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
              <Button variant="success" onClick={handleShowUploadModal}>Add File</Button>
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td>{file.name}</td>
                      <td>{file.description}</td>
                      <td>{file.type}</td>
                      <td>
                        <Button onClick={() => handleShowModal(file)} className="me-2 button-style">
                          View
                        </Button>
                        <Button variant="danger" className="me-2" onClick={() => handleDelete(file.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>File Details</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                  {selectedFile && (
                    <div>
                      <p><strong>Name:</strong> {selectedFile.name}</p>
                      <p><strong>Description:</strong> {selectedFile.description}</p>
                      <p><strong>Type:</strong> {selectedFile.type}</p>
                      <p><strong>URL:</strong> <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">{selectedFile.url}</a></p>
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
                  <Modal.Title>Upload File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Upload File</Form.Label>
                      <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control type="text" value={description} onChange={handleDescriptionChange} />
                    </Form.Group>
                    <Button variant="primary" onClick={handleUpload}>
                      Upload
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

export default FileList;
