import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080';

const statusColors = {
  OPEN: 'danger',
  IN_PROGRESS: 'warning',
  RESOLVED: 'success',
  CLOSED: 'secondary',
};

const IssueList = () => {
  const { projectId } = useParams();
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [newIssue, setNewIssue] = useState({
    description: '',
    content: '',
    url: '',
    status: 'OPEN',
    priority: 'Low',
  });
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchIssues();
  }, [projectId, page]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchIssues = async (name = '') => {
    setIsSearching(name !== '');
    const url = name
      ? `/api/v1/issue/findByNameAndProjectId`
      : `/api/v1/issue/findByProjectId`;

    const params = name
      ? { projectId, name, page: 0, size: 100 }
      : { projectId, page, size: 29 };

    try {
      const response = await axiosInstance.get(url, { params });
      setIssues(response.data.data);
      if (!name) {
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const handleAddIssue = async () => {
    try {
      await axiosInstance.post(`/api/v1/issue/create`, {
        ...newIssue,
        projectId,
        createdBy: userId,
      });
      setShowForm(false);
      setNewIssue({ description: '', content: '', url: '', status: 'OPEN', priority: 'Low' });
      fetchIssues();
    } catch (error) {
      console.error('Error adding issue:', error);
    }
  };

  const handleEditIssue = async () => {
    try {
      await axiosInstance.post(`/api/v1/issue/update`, {
        ...currentIssue,
        projectId,
        createdBy: userId,
      });
      setShowForm(false);
      setCurrentIssue(null);
      fetchIssues();
    } catch (error) {
      console.error('Error editing issue:', error);
    }
  };

  const handleDeleteIssue = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/issue/delete`, { params: { id } });
      fetchIssues();
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  const handleFormSubmit = () => {
    if (currentIssue) {
      handleEditIssue();
    } else {
      handleAddIssue();
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentIssue(null);
    setNewIssue({ description: '', content: '', url: '', status: 'OPEN', priority: 'Low' });
  };

  const handleIssueClick = (issueId) => {
    navigate(`/project/${projectId}/issue/${issueId}`);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    fetchIssues(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
    if (currentIssue) {
      setCurrentIssue({ ...currentIssue, [name]: value });
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
          <h2>Issue List</h2>
          <div>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by issue name"
                value={searchName}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </div>
          <Row>
            {issues.map((issue) => (
              <Col key={issue.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleIssueClick(issue.id)} className={`card-style border-${statusColors[issue.status]}`} style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{issue.description}</Card.Title>
                    <Card.Text>{issue.content}</Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> <span className={`text-${statusColors[issue.status]}`}>{issue.status}</span>
                    </Card.Text>
                    <Card.Text>
                      <strong>Priority:</strong> {issue.priority}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={12} md={6} lg={4} className="mb-3">
              {projectLeaderId === parseInt(userId, 10) && (
                <div>
                  <Card onClick={() => setShowForm(true)} className="card-style" style={{ cursor: 'pointer' }}>
                    <Card.Body className="d-flex justify-content-center align-items-center">
                      <h1>+</h1>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Col>
          </Row>
          {!isSearching && (
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
              <Pagination.Item active>{page + 1}</Pagination.Item>
              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
            </Pagination>
          )}

          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>{currentIssue ? 'Edit Issue' : 'Add New Issue'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formIssueDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter issue description"
                    name="description"
                    value={currentIssue ? currentIssue.description : newIssue.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formIssueContent" className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter issue content"
                    name="content"
                    value={currentIssue ? currentIssue.content : newIssue.content}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formIssueUrl" className="mb-3">
                  <Form.Label>Detail</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter issue URL"
                    name="url"
                    value={currentIssue ? currentIssue.url : newIssue.url}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formIssueStatus" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={currentIssue ? currentIssue.status : newIssue.status}
                    onChange={handleInputChange}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formIssuePriority" className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    name="priority"
                    value={currentIssue ? currentIssue.priority : newIssue.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleFormSubmit}>
                {currentIssue ? 'Update Issue' : 'Add Issue'}
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

export default IssueList;
