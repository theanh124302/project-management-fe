import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const statusColors = {
  CANCELLED: 'danger',
  NOT_STARTED: 'secondary',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  BLOCKED: 'dark',
  ON_HOLD: 'warning',
  PENDING: 'primary',
};

const TaskList = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    dueDate: ''
  });
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchName, setSearchName] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchTasks();
  }, [projectId, page]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchTasks = async (name = '', status = '') => {
    setIsSearching(name !== '' || status !== '');
    const url = name
      ? `/api/v1/task/findByProjectIdAndName`
      : status
      ? `/api/v1/task/findByProjectIdAndStatus`
      : `/api/v1/task/findByProjectId`;

    const params = name
      ? { projectId, name, page: 0, size: 100 }
      : status
      ? { projectId, status, page: 0, size: 100 }
      : { projectId, page, size: 29 };

    try {
      const response = await axiosInstance.get(url, { params });
      setTasks(response.data.data);
      if (!name && !status) {
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      await axiosInstance.post(`/api/v1/task/create`, {
        ...newTask,
        projectId: projectId,
        createdBy: userId,
      });
      setShowForm(false);
      setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/project/${projectId}/task/${taskId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentTask(null);
    setNewTask({ name: '', description: '', priority: '', startDate: '', dueDate: '' });
  };

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    fetchTasks(searchName, selectedStatus);
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    fetchTasks(e.target.value, statusFilter);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10} className='content-style'>
          <h2>Task List</h2>
          <div>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by task name"
                value={searchName}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </div>
          <div className="d-flex justify-content-end mb-3">
            <Form.Group controlId="formStatusFilter" className="d-flex align-items-center me-3">
              <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange} className="w-auto">
                <option value="">All</option>
                {Object.keys(statusColors).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <Row>
            {tasks.map((task) => (
              <Col key={task.id} xs={12} md={6} lg={4} className="mb-3">
                <Card onClick={() => handleTaskClick(task.id)} className={`card-style border-${statusColors[task.status]}`} style={{ cursor: 'pointer' }}>
                  <Card.Body>
                    <Card.Title>{task.name}</Card.Title>
                    <Card.Text>{task.description}</Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> <span className={`text-${statusColors[task.status]}`}>{task.status}</span>
                    </Card.Text>
                    <Card.Text>
                      <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Priority:</strong> {task.priority}
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
              <Modal.Title>{currentTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTaskName" className="mb-3">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter task name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTaskDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTaskPriority" className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTaskStartDate" className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formTaskDueDate" className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleAddTask}>
                {currentTask ? 'Update Task' : 'Add Task'}
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

export default TaskList;
