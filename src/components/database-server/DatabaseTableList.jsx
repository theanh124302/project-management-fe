import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DatabaseTableList.css';

const backendUrl = 'http://localhost:8080'; // Update to your backend URL

const DatabaseTableList = () => {
  const { projectId, serverId } = useParams();
  const location = useLocation();
  const typeColor = location.state?.typeColor || '#ffffff';
  const [tables, setTables] = useState([]);
  const [serverDetails, setServerDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [newTable, setNewTable] = useState({
    name: '',
    description: '',
    databaseServerId: serverId
  });
  const [editServer, setEditServer] = useState({
    name: '',
    description: '',
    type: 'MySQL',
    url: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
    fetchServerDetails();
  }, [serverId]);

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/database-table/findAllByDatabaseServerId?databaseServerId=${serverId}&page=0&size=100`);
      setTables(response.data.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchServerDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/database-server/findById?id=${serverId}`);
      setServerDetails(response.data.data);
      setEditServer(response.data.data);
    } catch (error) {
      console.error('Error fetching server details:', error);
    }
  };

  const handleAddTable = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/database-table/create`, {
        ...newTable
      });
      setShowForm(false);
      setNewTable({ name: '', description: '', databaseServerId: serverId });
      fetchTables();
    } catch (error) {
      console.error('Error adding table:', error);
    }
  };

  const handleEditServer = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/database-server/update`, {
        ...editServer,
        id: serverId
      });
      setEditForm(false);
      fetchServerDetails();
    } catch (error) {
      console.error('Error editing server:', error);
    }
  };

  const handleDeleteServer = async () => {
    try {
      await axios.delete(`${backendUrl}/api/v1/database-server/delete`, {
        params: { id: serverId }
      });
      navigate(`/project/${projectId}/database`);
    } catch (error) {
      console.error('Error deleting server:', error);
    }
  };

  const handleTableClick = (tableId) => {
    navigate(`/project/${projectId}/database-server/${serverId}/table/${tableId}/fields`, { state: { typeColor: typeColor } });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewTable({ name: '', description: '', databaseServerId: serverId });
  };

  const handleCloseEditForm = () => {
    setEditForm(false);
  };

  return (
    <Container fluid className="table-list-container" >
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className="table-content" style={{ backgroundColor: typeColor }}>
          {serverDetails && (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title><strong>{serverDetails.name}</strong></Card.Title>
                <Card.Text><strong>Description:</strong> {serverDetails.description}</Card.Text>
                <Card.Text><strong>Type:</strong> {serverDetails.type}</Card.Text>
                <Card.Text><strong>URL:</strong> {serverDetails.url}</Card.Text>
                <Card.Text><strong>Username:</strong> {serverDetails.username}</Card.Text>
                <Button variant="success" className="me-2" onClick={() => setEditForm(true)}>Edit</Button>
                <Button variant="danger" onClick={handleDeleteServer}>Delete</Button>
              </Card.Body>
            </Card>
          )}
          <Row>
            {tables.map((table) => (
              <Col key={table.id} xs={12} md={6} lg={4} className="mb-3">
                <Card
                  onClick={() => handleTableClick(table.id)}
                  className="table-card"
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title>{table.name}</Card.Title>
                    <Card.Text>{table.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card onClick={() => setShowForm(true)} className="table-card add-table-card" style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1>+</h1>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Database Table</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTableName" className="mb-3">
                  <Form.Label>Table Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter table name"
                    value={newTable.name}
                    onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTableDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter table description"
                    value={newTable.description}
                    onChange={(e) => setNewTable({ ...newTable, description: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleAddTable}>
                Add Table
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={editForm} onHide={handleCloseEditForm}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Database Server</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formEditServerName" className="mb-3">
                  <Form.Label>Server Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter server name"
                    value={editServer.name}
                    onChange={(e) => setEditServer({ ...editServer, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEditServerDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter server description"
                    value={editServer.description}
                    onChange={(e) => setEditServer({ ...editServer, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEditServerType" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={editServer.type}
                    onChange={(e) => setEditServer({ ...editServer, type: e.target.value })}
                  >
                    <option value="MySQL">MySQL</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Oracle">Oracle</option>
                    <option value="SQL Server">SQL Server</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formEditServerUrl" className="mb-3">
                  <Form.Label>URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter server URL"
                    value={editServer.url}
                    onChange={(e) => setEditServer({ ...editServer, url: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEditServerUsername" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter server username"
                    value={editServer.username}
                    onChange={(e) => setEditServer({ ...editServer, username: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formEditServerPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter server password"
                    value={editServer.password}
                    onChange={(e) => setEditServer({ ...editServer, password: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditForm}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleEditServer}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default DatabaseTableList;
