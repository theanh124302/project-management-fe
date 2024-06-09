import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DailyReportList.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const DailyReportList = () => {
  const { projectId } = useParams();
  const [dailyReports, setDailyReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [newReport, setNewReport] = useState({
    description: '',
    date: ''
  });
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const [userName, setUserName] = useState('');
  const [searchName, setSearchName] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectDetails();
    fetchDailyReports();
    fetchUserName();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchDailyReports = async (name = '') => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/daily-report/findAllByProjectIdAndName`, {
        params: { projectId, name }
      });
      setDailyReports(response.data.data);
    } catch (error) {
      console.error('Error fetching daily reports:', error);
    }
  };

  const fetchUserName = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/user/findById/${userId}`);
      setUserName(response.data.data.name);
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handleAddReport = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const reportName = `${currentDate} - ${userName}`;

    try {
      await axios.post(`${backendUrl}/api/v1/daily-report/create`, {
        ...newReport,
        name: reportName,
        date: currentDate,
        projectId: projectId,
        createdBy: userId,
      });
      setShowForm(false);
      setNewReport({ description: '', date: '' });
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
    setNewReport({ description: report.description, date: report.date });
    setShowForm(true);
  };

  const handleUpdateReport = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/daily-report/update`, { id: currentReport.id, ...newReport, projectId });
      setShowForm(false);
      setNewReport({ description: '', date: '' });
      setCurrentReport(null);
      fetchDailyReports();
    } catch (error) {
      console.error('Error updating daily report:', error);
    }
  };

  const handleReportClick = (report) => {
    setCurrentReport(report);
    setShowDetail(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentReport(null);
    setNewReport({ description: '', date: '' });
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentReport(null);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    fetchDailyReports(e.target.value);
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
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search by report name"
              value={searchName}
              onChange={handleSearchChange}
            />
          </InputGroup>
          <Row>
            {dailyReports.map((report) => (
              <Col key={report.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleReportClick(report)} className="daily-report-card" style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{report.name}</Card.Title>
                    <Card.Text>{report.description}</Card.Text>
                    <Card.Text>
                      <strong>Date:</strong> {new Date(report.date).toLocaleString()}
                    </Card.Text>
                    {report.createdBy === parseInt(userId, 10) && (
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

          <Modal show={showDetail} onHide={handleCloseDetail}>
            <Modal.Header closeButton>
              <Modal.Title>Daily Report Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {currentReport && (
                <>
                  <p><strong>Name:</strong> {currentReport.name}</p>
                  <p><strong>Description:</strong> {currentReport.description}</p>
                  <p><strong>Date:</strong> {new Date(currentReport.date).toLocaleString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetail}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default DailyReportList;
