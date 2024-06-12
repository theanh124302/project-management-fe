import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DesignDocs.css';

const backendUrl = 'http://localhost:8080';

const DesignDocs = () => {
  const { projectId, folderId, apiId } = useParams();
  const [formData, setFormData] = useState({
    useCaseDiagram: '',
    sequenceDiagram: '',
    activityDiagram: '',
    classDiagram: ''
  });
  const [docs, setDocs] = useState([]);
  const [impacts, setImpacts] = useState([]);
  const [relatedTables, setRelatedTables] = useState([]);
  const [showImpactForm, setShowImpactForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showImpactDetail, setShowImpactDetail] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);
  const [currentImpact, setCurrentImpact] = useState(null);
  const [currentTable, setCurrentTable] = useState(null);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [newDoc, setNewDoc] = useState({ description: '', url: '' });
  const [newImpact, setNewImpact] = useState({
    impactApiId: '',
    apiImpactName: '',
    status: '',
    impactDescription: '',
    impactPriority: '',
    solution: ''
  });
  const [newTable, setNewTable] = useState({ description: '', databaseTableUuid: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        const data = response.data.data;
        setFormData({
          useCaseDiagram: data.useCaseDiagram,
          sequenceDiagram: data.sequenceDiagram,
          activityDiagram: data.activityDiagram,
          classDiagram: data.classDiagram
        });
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    const fetchApiImpacts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/impact/findByApiId`, {
          params: { apiId }
        });
        setImpacts(response.data.data);
      } catch (error) {
        console.error('Error fetching API impacts:', error);
      }
    };

    const fetchDocs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
        setDocs(response.data.data);
      } catch (error) {
        console.error('Error fetching docs:', error);
      }
    };

    const fetchRelatedTables = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/relatedDatabaseTable/findByApiId`, {
          params: { apiId }
        });
        setRelatedTables(response.data.data);
      } catch (error) {
        console.error('Error fetching related database tables:', error);
      }
    };

    fetchApiDetails();
    fetchApiImpacts();
    fetchDocs();
    fetchRelatedTables();
  }, [apiId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImpactInputChange = (e) => {
    const { name, value } = e.target;
    setNewImpact({ ...newImpact, [name]: value });
  };

  const handleDocInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoc({ ...newDoc, [name]: value });
  };

  const handleTableInputChange = (e) => {
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/api/updateUseCaseDiagramAndSequenceDiagramAndActivityDiagramAndClassDiagram`, null, {
        params: { id: apiId, ...formData }
      });
      navigate(`/project/${projectId}/folder/${folderId}/api/${apiId}/design`);
    } catch (error) {
      console.error('Error updating diagrams:', error);
    }
  };

  const handleAddImpact = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/impact/create`, { ...newImpact, apiId });
      setShowImpactForm(false);
      setNewImpact({
        impactApiId: '',
        apiImpactName: '',
        status: '',
        impactDescription: '',
        impactPriority: '',
        solution: ''
      });
      const response = await axios.get(`${backendUrl}/api/v1/impact/findByApiId`, {
        params: { apiId }
      });
      setImpacts(response.data.data);
    } catch (error) {
      console.error('Error adding impact:', error);
    }
  };

  const handleUpdateImpact = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/impact/update`, { id: currentImpact.id, ...newImpact, apiId });
      setShowImpactForm(false);
      setCurrentImpact(null);
      setNewImpact({
        impactApiId: '',
        apiImpactName: '',
        status: '',
        impactDescription: '',
        impactPriority: '',
        solution: ''
      });
      const response = await axios.get(`${backendUrl}/api/v1/impact/findByApiId`, {
        params: { apiId }
      });
      setImpacts(response.data.data);
    } catch (error) {
      console.error('Error updating impact:', error);
    }
  };

  const handleDeleteImpact = async (impactId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/impact/delete`, {
        params: { id: impactId }
      });
      const response = await axios.get(`${backendUrl}/api/v1/impact/findByApiId`, {
        params: { apiId }
      });
      setImpacts(response.data.data);
    } catch (error) {
      console.error('Error deleting impact:', error);
    }
  };

  const handleEditImpactClick = (impact) => {
    setNewImpact({
      impactApiId: impact.impactApiId,
      apiImpactName: impact.apiImpactName,
      status: impact.status,
      impactDescription: impact.impactDescription,
      impactPriority: impact.impactPriority,
      solution: impact.solution
    });
    setCurrentImpact(impact);
    setShowImpactForm(true);
  };

  const handleViewImpactDetailClick = (impact) => {
    setCurrentImpact(impact);
    setShowImpactDetail(true);
  };

  const handleCloseImpactForm = () => {
    setShowImpactForm(false);
    setCurrentImpact(null);
    setNewImpact({
      impactApiId: '',
      apiImpactName: '',
      status: '',
      impactDescription: '',
      impactPriority: '',
      solution: ''
    });
  };

  const handleCloseImpactDetail = () => {
    setShowImpactDetail(false);
    setCurrentImpact(null);
  };

  const handleAddDoc = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/docs/create`, { ...newDoc, apiId });
      setShowDocForm(false);
      setNewDoc({ description: '', url: '' });
      const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
      setDocs(response.data.data);
    } catch (error) {
      console.error('Error adding doc:', error);
    }
  };

  const handleUpdateDoc = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/docs/update`, { id: currentDoc.id, apiId, ...newDoc });
      setShowDocForm(false);
      setNewDoc({ description: '', url: '' });
      setCurrentDoc(null);
      const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
      setDocs(response.data.data);
    } catch (error) {
      console.error('Error updating doc:', error);
    }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/docs/delete`, { params: { id: docId } });
      const response = await axios.get(`${backendUrl}/api/v1/docs/findByApiId?apiId=${apiId}`);
      setDocs(response.data.data);
    } catch (error) {
      console.error('Error deleting doc:', error);
    }
  };

  const handleEditDocClick = (doc) => {
    setNewDoc({ description: doc.description, url: doc.url });
    setCurrentDoc(doc);
    setShowDocForm(true);
  };

  const handleCloseDocForm = () => {
    setShowDocForm(false);
    setCurrentDoc(null);
    setNewDoc({ description: '', url: '' });
  };

  const handleAddTable = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/relatedDatabaseTable/create`, { ...newTable, apiId });
      setShowTableForm(false);
      setNewTable({ description: '', databaseTableUuid: '' });
      const response = await axios.get(`${backendUrl}/api/v1/relatedDatabaseTable/findByApiId`, {
        params: { apiId }
      });
      setRelatedTables(response.data.data);
    } catch (error) {
      console.error('Error adding related table:', error);
    }
  };

  const handleUpdateTable = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/relatedDatabaseTable/update`, { id: currentTable.id, ...newTable, apiId });
      setShowTableForm(false);
      setCurrentTable(null);
      setNewTable({ description: '', databaseTableUuid: '' });
      const response = await axios.get(`${backendUrl}/api/v1/relatedDatabaseTable/findByApiId`, {
        params: { apiId }
      });
      setRelatedTables(response.data.data);
    } catch (error) {
      console.error('Error updating related table:', error);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/relatedDatabaseTable/delete`, { params: { id: tableId } });
      const response = await axios.get(`${backendUrl}/api/v1/relatedDatabaseTable/findByApiId`, {
        params: { apiId }
      });
      setRelatedTables(response.data.data);
    } catch (error) {
      console.error('Error deleting related table:', error);
    }
  };

  const handleEditTableClick = (table) => {
    setNewTable({ description: table.description, databaseTableUuid: table.databaseTableUuid });
    setCurrentTable(table);
    setShowTableForm(true);
  };

  const handleCloseTableForm = () => {
    setShowTableForm(false);
    setCurrentTable(null);
    setNewTable({ description: '', databaseTableUuid: '' });
  };

  const getFormattedUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  };

  return (
    <Container fluid className="design-docs-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}  className='config'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Update Diagrams for API</Card.Title>
              <Form>
                <Form.Group controlId="formUseCaseDiagram" className="mb-3">
                  <Form.Label>Use Case Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="useCaseDiagram"
                    value={formData.useCaseDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formSequenceDiagram" className="mb-3">
                  <Form.Label>Sequence Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="sequenceDiagram"
                    value={formData.sequenceDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formActivityDiagram" className="mb-3">
                  <Form.Label>Activity Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="activityDiagram"
                    value={formData.activityDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formClassDiagram" className="mb-3">
                  <Form.Label>Class Diagram</Form.Label>
                  <Form.Control
                    type="text"
                    name="classDiagram"
                    value={formData.classDiagram}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
              <Button variant="primary" onClick={handleSubmit}>
                Update Diagrams
              </Button>
              <Card.Title className="mt-4">Related APIs</Card.Title>
              <Row>
                {impacts.map((impact) => (
                  <Col xs={12} md={6} lg={4} key={impact.id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>{impact.apiImpactName}</Card.Title>
                        <Card.Text>Status: {impact.status}</Card.Text>
                        <Card.Text>Priority: {impact.impactPriority}</Card.Text>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditImpactClick(impact)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteImpact(impact.id)}>
                          Delete
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => handleViewImpactDetailClick(impact)}>
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Button variant="success" onClick={() => setShowImpactForm(true)}>
                Add Impact
              </Button>
              <Card.Title className="mt-4">Related Database Tables</Card.Title>
              <Row>
                {relatedTables.map((table) => (
                  <Col xs={12} md={6} lg={4} key={table.id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>{table.databaseTableName}</Card.Title>
                        <Card.Text>Description: {table.description}</Card.Text>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditTableClick(table)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTable(table.id)}>
                          Delete
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/project/${projectId}/database-server/table/${table.databaseTableId}/fields`)}>
                          Database Table Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Button variant="secondary" onClick={() => setShowTableForm(true)}>
                Add Table
              </Button>
              <Modal show={showDocForm} onHide={handleCloseDocForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentDoc ? 'Edit Doc' : 'Add New Doc'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formDocDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={newDoc.description}
                        onChange={handleDocInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDocUrl" className="mb-3">
                      <Form.Label>URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="url"
                        value={newDoc.url}
                        onChange={handleDocInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDocForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentDoc ? handleUpdateDoc : handleAddDoc}>
                    {currentDoc ? 'Update Doc' : 'Add Doc'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showImpactForm} onHide={handleCloseImpactForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentImpact ? 'Edit Impact' : 'Add New Impact'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formImpactApiId" className="mb-3">
                      <Form.Label>Impact API ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="impactApiId"
                        value={newImpact.impactApiId}
                        onChange={handleImpactInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formApiImpactName" className="mb-3">
                      <Form.Label>Impact API Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="apiImpactName"
                        value={newImpact.apiImpactName}
                        onChange={handleImpactInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formStatus" className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={newImpact.status}
                        onChange={handleImpactInputChange}
                      >
                        <option value="safe">Safe</option>
                        <option value="unsafe">Unsafe</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formImpactDescription" className="mb-3">
                      <Form.Label>Impact Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="impactDescription"
                        value={newImpact.impactDescription}
                        onChange={handleImpactInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formImpactPriority" className="mb-3">
                      <Form.Label>Impact Priority</Form.Label>
                      <Form.Control
                        as="select"
                        name="impactPriority"
                        value={newImpact.impactPriority}
                        onChange={handleImpactInputChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formSolution" className="mb-3">
                      <Form.Label>Solution</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="solution"
                        value={newImpact.solution}
                        onChange={handleImpactInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseImpactForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentImpact ? handleUpdateImpact : handleAddImpact}>
                    {currentImpact ? 'Update Impact' : 'Add Impact'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showTableForm} onHide={handleCloseTableForm}>
                <Modal.Header closeButton>
                  <Modal.Title>{currentTable ? 'Edit Table' : 'Add New Table'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formTableDescription" className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        value={newTable.description}
                        onChange={handleTableInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formTableUuid" className="mb-3">
                      <Form.Label>Database Table UUID</Form.Label>
                      <Form.Control
                        type="text"
                        name="databaseTableUuid"
                        value={newTable.databaseTableUuid}
                        onChange={handleTableInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseTableForm}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={currentTable ? handleUpdateTable : handleAddTable}>
                    {currentTable ? 'Update Table' : 'Add Table'}
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showImpactDetail} onHide={handleCloseImpactDetail}>
                <Modal.Header closeButton>
                  <Modal.Title>Impact Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {currentImpact && (
                    <div>
                      <p><strong>API Impact Name:</strong> {currentImpact.apiImpactName}</p>
                      <p><strong>Status:</strong> {currentImpact.status}</p>
                      <p><strong>Impact Priority:</strong> {currentImpact.impactPriority}</p>
                      <p><strong>Impact Description:</strong> {currentImpact.impactDescription}</p>
                      <p><strong>Solution:</strong> {currentImpact.solution}</p>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseImpactDetail}>
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

export default DesignDocs;
