import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DailyReportList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const DailyReportList = () => {
  const { projectId } = useParams();
  const [dailyReports, setDailyReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    date: ''
  });
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    fetchDailyReports();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchDailyReports = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/daily-report/findAllByProjectId?projectId=${projectId}`);
      setDailyReports(response.data.data);
    } catch (error) {
      console.error('Error fetching daily reports:', error);
    }
  };

  const handleAddReport = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      await axios.post(`${backendUrl}/api/v1/daily-report/create`, {
        ...newReport,
        projectId: projectId,
        createdBy: userId,
      });
      setShowForm(false);
      setNewReport({ name: '', description: '', date: '' });
      fetchDailyReports();
    } catch (error) {
      console.error('Error adding daily report:', error);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/daily-report/delete`, { params: { id } });
      fetchDailyReports();
    } catch (error) {
      console.error('Error deleting daily report:', error);
    }
  };

  const handleEditReport = (report) => {
    setCurrentReport(report);
    setNewReport({ name: report.name, description: report.description, date: report.date });
    setShowForm(true);
  };

  const handleUpdateReport = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/daily-report/update`, { id: currentReport.id, ...newReport, projectId });
      setShowForm(false);
      setNewReport({ name: '', description: '', date: '' });
      setCurrentReport(null);
      fetchDailyReports();
    } catch (error) {
      console.error('Error updating daily report:', error);
    }
  };

  const handleReportClick = (reportId) => {
    navigate(`/project/${projectId}/daily-report/${reportId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentReport(null);
    setNewReport({ name: '', description: '', date: '' });
  };

  return (
    <Container fluid className="daily-report-list-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className="daily-report-content">
          <h2>Daily Report List</h2>
          <Row>
            {dailyReports.map((report) => (
              <Col key={report.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleReportClick(report.id)} className="daily-report-card" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{report.name}</Card.Title>
                    <Card.Text>{report.description}</Card.Text>
                    <Card.Text>
                      <strong>Date:</strong> {new Date(report.date).toLocaleString()}
                    </Card.Text>
                    {projectLeaderId === parseInt(userId, 10) && (
                      <div className="daily-report-buttons">
                        <Button variant="light" onClick={(e) => { e.stopPropagation(); handleEditReport(report); }} className="me-2">
                          Edit
                        </Button>
                        <Button variant="light" onClick={(e) => { e.stopPropagation(); handleDeleteReport(report.id); }}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card onClick={() => setShowForm(true)} className="daily-report-card add-daily-report-card" style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <h1>+</h1>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>{currentReport ? 'Edit Daily Report' : 'Add New Daily Report'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formDailyReportName" className="mb-3">
                  <Form.Label>Daily Report Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter daily report name"
                    value={newReport.name}
                    onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formDailyReportDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter daily report description"
                    value={newReport.description}
                    onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formDailyReportDate" className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button variant="primary" onClick={currentReport ? handleUpdateReport : handleAddReport}>
                {currentReport ? 'Update Daily Report' : 'Add Daily Report'}
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default DailyReportList;
