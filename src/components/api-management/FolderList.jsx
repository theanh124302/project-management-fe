import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/FolderList.css';

const backendUrl = 'http://localhost:8080';

const FolderList = () => {
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axios.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
        const leaderId = projectResponse.data.data.leaderId;
        setIsLeader(parseInt(userId, 10) === leaderId);

        const folderResponse = await axios.get(`${backendUrl}/api/v1/folder/findByProjectId?projectId=${projectId}`);
        setFolders(folderResponse.data.data);
      } catch (error) {
        console.error('Error fetching project or folders:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId, userId]);

  const handleAddFolder = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/folder/create`, { name: newFolder, projectId });
      setFolders([...folders, response.data.data]);
      setNewFolder('');
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  };

  const handleUpdateFolder = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/folder/update`, { ...editingFolder });
      setFolders(folders.map(f => (f.id === editingFolder.id ? response.data.data : f)));
      setEditingFolder(null);
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/folder/delete`, { params: { id } });
      setFolders(folders.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleFolderClick = (folderId) => {
    navigate(`/project/${projectId}/folder/${folderId}/apis`);
  };

  return (
    <Container fluid className="folder-list-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Folder List</Card.Title>
              <ListGroup className="mb-3">
                {folders.map((folder) => (
                  <ListGroupItem key={folder.id} className="d-flex justify-content-between align-items-center">
                    <div onClick={() => handleFolderClick(folder.id)} style={{ cursor: 'pointer' }}>
                      {folder.name}
                    </div>
                    {isLeader && (
                      <div>
                        <Button
                          variant="outline-primary"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolder(folder);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                        >
                          <FaTrashAlt />
                        </Button>
                      </div>
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
              {isLeader && (
                <div className="mt-4">
                  <h3>{editingFolder ? 'Edit Folder' : 'Add Folder'}</h3>
                  <Form className="d-flex">
                    <FormControl
                      placeholder="Folder Name"
                      value={editingFolder ? editingFolder.name : newFolder}
                      onChange={(e) => editingFolder ? setEditingFolder({ ...editingFolder, name: e.target.value }) : setNewFolder(e.target.value)}
                      className="me-2"
                    />
                    <Button variant="primary" onClick={editingFolder ? handleUpdateFolder : handleAddFolder}>
                      {editingFolder ? 'Save' : 'Add'}
                    </Button>
                  </Form>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FolderList;
