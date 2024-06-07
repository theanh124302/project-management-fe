import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DatabaseFieldList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend của bạn

const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
};

const DatabaseFieldList = () => {
  const location = useLocation();
  const typeColor = location.state?.typeColor
  const { projectId, serverId, tableId } = useParams();
  const [fields, setFields] = useState([]);
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
  }, [tableId]);

  const fetchFields = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/database-field/findByDatabaseTableId?databaseTableId=${tableId}&page=0&size=100`);
      setFields(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu các trường:', error);
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
      console.error('Lỗi khi thêm trường:', error);
    }
  };

  const handleFieldClick = (fieldId) => {
    // Thêm logic khi nhấn vào một trường, nếu cần thiết
    console.log(`Xem chi tiết của trường: ${fieldId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewField({ fieldName: '', type: '', description: '', databaseTableId: tableId, sample: '' });
  };

  return (
    <Container fluid className="field-list-container" >
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className="field-content" style={{ backgroundColor: typeColor }}>
          <h2>Field List</h2>
          <Row>
            {fields.map((field) => (
              <Col key={field.id} xs={12} md={6} lg={4} className="mb-3">
                <Card
                  onClick={() => handleFieldClick(field.id)}
                  className="field-card"
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title>{field.fieldName}</Card.Title>
                    <Card.Text>{field.description}</Card.Text>
                    <Card.Text><strong>Type:</strong> {field.type}</Card.Text>
                    <Card.Text><strong>Sample:</strong> {field.sample}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card onClick={() => setShowForm(true)} className="field-card add-field-card" style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1>+</h1>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
                    placeholder="Nhập tên trường"
                    value={newField.fieldName}
                    onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formFieldType" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập loại trường"
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formFieldDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập mô tả trường"
                    value={newField.description}
                    onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formFieldSample" className="mb-3">
                  <Form.Label>Sample</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mẫu dữ liệu"
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
        </Col>
      </Row>
    </Container>
  );
};

export default DatabaseFieldList;
