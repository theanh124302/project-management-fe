import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Table } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DatabaseFieldList.css';

const backendUrl = 'http://localhost:8080'; // Update your backend URL

const DatabaseFieldList = () => {
  const location = useLocation();
  const typeColor = location.state?.typeColor;
  const { projectId, serverId, tableId } = useParams();
  const [fields, setFields] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newField, setNewField] = useState({
    fieldName: '',
    type: '',
    description: '',
    databaseTableId: tableId,
    sample: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFields();
    fetchTable();
  }, [tableId]);

  const fetchFields = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/database-field/findByDatabaseTableId?databaseTableId=${tableId}&page=0&size=100`);
      setFields(response.data.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const fetchTable = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/database-table/findById?id=${tableId}`);
      setTableData(response.data.data);
    } catch (error) {
      console.error('Error fetching table:', error);
    }
  };

  const handleAddField = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/database-field/create`, {
        ...newField
      });
      setShowForm(false);
      setNewField({ fieldName: '', type: '', description: '', databaseTableId: tableId, sample: '' });
      fetchFields();
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };

  const handleFieldClick = (fieldId) => {
    console.log(`Viewing details of field: ${fieldId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewField({ fieldName: '', type: '', description: '', databaseTableId: tableId, sample: '' });
  };

  return (
    <Container fluid className="field-list-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className="field-content" style={{ backgroundColor: typeColor }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 class="title-background">{tableData.name}</h2>
            <Button variant="success" onClick={() => setShowForm(true)} className="mb-3">
              Add Field
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Field Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Sample</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} onClick={() => handleFieldClick(field.id)} style={{ cursor: 'pointer' }}>
                    <td>{index + 1}</td>
                    <td>{field.fieldName}</td>
                    <td>{field.type}</td>
                    <td>{field.description}</td>
                    <td>{field.sample}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Modal show={showForm} onHide={handleCloseForm}>
              <Modal.Header closeButton>
                <Modal.Title>Add Field</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="formFieldName" className="mb-3">
                    <Form.Label>Field Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter field name"
                      value={newField.fieldName}
                      onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFieldType" className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter field type"
                      value={newField.type}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFieldDescription" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter field description"
                      value={newField.description}
                      onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFieldSample" className="mb-3">
                    <Form.Label>Sample</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter field sample data"
                      value={newField.sample}
                      onChange={(e) => setNewField({ ...newField, sample: e.target.value })}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button variant="success" onClick={handleAddField}>
                  Add Field
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default DatabaseFieldList;
