import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card, Button, Table, Form, FormControl, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const backendUrl = 'http://localhost:8080'; // Cập nhật URL backend cố định ở đây

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ username: '', role: '' });
  const [editingMember, setEditingMember] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDates, setEditingDates] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    coverImage: ''
  });
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axiosInstance.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
        setProject(projectResponse.data.data);
        setStartDate(projectResponse.data.data.startDate.split('T')[0]); // Chỉ lấy phần ngày tháng năm
        setExpectedEndDate(projectResponse.data.data.expectedEndDate.split('T')[0]); // Chỉ lấy phần ngày tháng năm

        const leaderResponse = await axiosInstance.get(`${backendUrl}/api/v1/user/findById/${projectResponse.data.data.leaderId}`);
        setLeaderName(leaderResponse.data.data.name);
        
        const membersResponse = await axiosInstance.get(`${backendUrl}/api/v1/user/findByProjectId/${projectId}`);
        setMembers(membersResponse.data.data);
      } catch (error) {
        console.error('Error fetching project details or members:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleAddOrEditMember = async () => {
    try {
      await axiosInstance.post(`${backendUrl}/api/v1/project/assignUserByUsername`, null, {
        params: {
          projectId,
          username: newMember.username,
          role: newMember.role,
        },
      });
      setNewMember({ username: '', role: '' });
      setEditingMember(null);
      const membersResponse = await axiosInstance.get(`${backendUrl}/api/v1/user/findByProjectId/${projectId}`);
      setMembers(membersResponse.data.data);
    } catch (error) {
      console.error('Error adding or editing member:', error);
    }
  };

  const handleDeleteMember = async (username) => {
    try {
      await axiosInstance.post(`${backendUrl}/api/v1/project/removeUserByUsername`, null, {
        params: {
          projectId,
          username,
          deleterId: userId,
        },
      });
      const membersResponse = await axiosInstance.get(`${backendUrl}/api/v1/user/findByProjectId/${projectId}`);
      setMembers(membersResponse.data.data);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleEditClick = (member) => {
    setNewMember({ username: member.username, role: member.role });
    setEditingMember(member);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleUpdateProjectDates = async () => {
    try {
      const updatedProject = { ...project, startDate, expectedEndDate };
      const response = await axiosInstance.post(`${backendUrl}/api/v1/project/update`, updatedProject, {
        params: { userId }
      });
      setProject(response.data.data);
      setEditingDates(false);
    } catch (error) {
      console.error('Error updating project dates:', error);
    }
  };

  const handleLeaveProject = async () => {
    try {
      await axiosInstance.post(`${backendUrl}/api/v1/project/leaveProject`, null, {
        params: {
          projectId,
          userId,
        },
      });
      navigate('/projectList');
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  };

  const handleEditProject = () => {
    setNewProject({
      name: project.name,
      description: project.description,
      coverImage: project.coverImage
    });
    setShowForm(true);
  };

  const handleDeleteProject = async () => {
    try {
      await axiosInstance.delete(`${backendUrl}/api/v1/project/delete`, { params: { id: project.id, userId } });
      navigate('/projectList');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const updatedProject = { ...project, ...newProject };
      const response = await axiosInstance.post(`${backendUrl}/api/v1/project/update`, updatedProject, {
        params: { userId }
      });
      setProject(response.data.data);
      setShowForm(false);
      setNewProject({ name: '', description: '', coverImage: '' });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewProject({ name: '', description: '', coverImage: '' });
  };

  const isLeader = project && project.leaderId === parseInt(userId, 10);

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10}  className='content-style'>
          <Card className="mt-4 card-style">
            <Card.Body>
              {project ? (
                <>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <Card.Text><strong>Status:</strong> {project.status}</Card.Text>
                  <Card.Text><strong>Leader:</strong> {leaderName}</Card.Text>
                  {isLeader ? (
                    <>
                      {editingDates ? (
                        <>
                          <Card.Text><strong>Start Date:</strong> 
                            <FormControl
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </Card.Text>
                          <Card.Text><strong>Expected End Date:</strong>
                            <FormControl
                              type="date"
                              value={expectedEndDate}
                              onChange={(e) => setExpectedEndDate(e.target.value)}
                            />
                          </Card.Text>
                          <Button variant="success" className="mt-2" onClick={handleUpdateProjectDates}>
                            Save Dates
                          </Button>
                          <Button variant="secondary" className="mt-2 ms-2" onClick={() => setEditingDates(false)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Card.Text><strong>Start Date:</strong> {startDate}</Card.Text>
                          <Card.Text><strong>Expected End Date:</strong> {expectedEndDate}</Card.Text>
                          <Button variant="success" className="mt-2" onClick={() => setEditingDates(true)}>
                            Update Dates
                          </Button>
                        </>
                      )}
                      <Button variant="success" className="mt-2 ms-2" onClick={handleEditProject}>
                        Edit Project
                      </Button>
                      <Button variant="danger" className="mt-2 ms-2" onClick={handleDeleteProject}>
                        Delete Project
                      </Button>
                    </>
                  ) : (
                    <Button variant="danger" className="mt-2" onClick={handleLeaveProject}>
                      Leave Project
                    </Button>
                  )}
                  <Card.Text><strong>Version:</strong> {project.version}</Card.Text>
                  <Card.Text><strong>Number of Members:</strong> {project.numberOfMembers}</Card.Text>

                  {isLeader && (
                    <Card className="mt-4">
                      <Card.Body>
                        <Card.Title>Add or Edit Member</Card.Title>
                        <Form className="d-flex">
                          <FormControl
                            placeholder="Username"
                            name="username"
                            value={newMember.username}
                            onChange={handleInputChange}
                            className="me-2"
                          />
                          <FormControl
                            as="select"
                            name="role"
                            value={newMember.role}
                            onChange={handleInputChange}
                            className="me-2"
                          >
                            <option value="">Select Role</option>
                            <option value="BE">BE</option>
                            <option value="FE">FE</option>
                            <option value="QA">QA</option>

                            <option value="BA">BA</option>
                            <option value="TL">TL</option>
                            <option value="TESTER">TESTER</option>
                            <option value="DEVOPS">DEVOPS</option>
                          </FormControl>
                          <Button variant="success" onClick={handleAddOrEditMember}>
                            {editingMember ? 'Edit Member' : 'Add Member'}
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  )}

                  <Card className="mt-4">
                    <Card.Body>
                      <Card.Title>Project Members</Card.Title>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((member) => (
                            <tr key={member.id}>
                              <td>{member.name}</td>
                              <td>{member.email}</td>
                              <td>{member.role}</td>
                              <td>
                                {isLeader && (
                                  <>
                                    <Button variant="outline-success" className="me-2" onClick={() => handleEditClick(member)}>
                                      <FaEdit />
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => handleDeleteMember(member.username)}>
                                      <FaTrashAlt />
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <Card.Text>Loading project details...</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Update Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProjectName" className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProjectDescription" className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProjectCoverImage" className="mb-3">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter cover image URL"
                value={newProject.coverImage}
                onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateProject}>
            Update Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectDetail;
