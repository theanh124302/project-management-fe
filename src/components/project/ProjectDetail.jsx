import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card, Button, Table, Form, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/ProjectDetail.css';

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
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axios.get(`${backendUrl}/api/v1/project/findById?id=${projectId}`);
        setProject(projectResponse.data.data);
        setStartDate(projectResponse.data.data.startDate);
        setExpectedEndDate(projectResponse.data.data.expectedEndDate);

        const leaderResponse = await axios.get(`${backendUrl}/api/v1/user/findById/${projectResponse.data.data.leaderId}`);
        setLeaderName(leaderResponse.data.data.name);
        
        const membersResponse = await axios.get(`${backendUrl}/api/v1/user/findByProjectId/${projectId}`);
        setMembers(membersResponse.data.data);
      } catch (error) {
        console.error('Error fetching project details or members:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleAddOrEditMember = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/project/assignUserByUsername`, null, {
        params: {
          projectId,
          username: newMember.username,
          role: newMember.role,
        },
      });
      setNewMember({ username: '', role: '' });
      setEditingMember(null);
      const membersResponse = await axios.get(`${backendUrl}/api/v1/user/findByProjectId/${projectId}`);
      setMembers(membersResponse.data.data);
    } catch (error) {
      console.error('Error adding or editing member:', error);
    }
  };

  const handleDeleteMember = async (username) => {
    try {
      await axios.post(`${backendUrl}/api/v1/project/removeUserByUsername`, null, {
        params: {
          projectId,
          username,
          deleterId: userId,
        },
      });
      const membersResponse = await axios.get(`${backendUrl}/api/v1/user/findByProjectId/${projectId}`);
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
      const response = await axios.post(`${backendUrl}/api/v1/project/update`, updatedProject, {
        params: { userId }
      });
      setProject(response.data.data);
    } catch (error) {
      console.error('Error updating project dates:', error);
    }
  };

  const isLeader = project && project.leaderId === parseInt(userId, 10);

  return (
    <Container fluid className="project-detail-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              {project ? (
                <>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <Card.Text><strong>Status:</strong> {project.status}</Card.Text>
                  <Card.Text><strong>Leader:</strong> {leaderName}</Card.Text>
                  {isLeader && (
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
                      <Button variant="primary" className="mt-2" onClick={handleUpdateProjectDates}>
                        Update Dates
                      </Button>
                    </>
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
                            <option value="LEADER">LEADER</option>
                            <option value="BE">BE</option>
                            <option value="FE">FE</option>
                            <option value="PM">PM</option>
                            <option value="BA">BA</option>
                          </FormControl>
                          <Button onClick={handleAddOrEditMember}>
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
                                    <Button variant="outline-primary" className="me-2" onClick={() => handleEditClick(member)}>
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
    </Container>
  );
};

export default ProjectDetail;
