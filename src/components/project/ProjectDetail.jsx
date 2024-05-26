import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, TextField, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '../../public/css/ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ username: '', role: '' });
  const [editingMember, setEditingMember] = useState(null);
  const deleterId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axios.get(`http://localhost:8080/api/v1/project/findById?id=${projectId}`);
        setProject(projectResponse.data.data);
        
        const membersResponse = await axios.get(`http://localhost:8080/api/v1/user/findByProjectId/${projectId}`);
        setMembers(membersResponse.data.data);
      } catch (error) {
        console.error('Error fetching project details or members:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleAddOrEditMember = async () => {
    try {
      await axios.post(`http://localhost:8080/api/v1/project/assignUserByUsername`, null, {
        params: {
          projectId,
          username: newMember.username,
          role: newMember.role,
        },
      });
      setNewMember({ username: '', role: '' });
      setEditingMember(null);
      const membersResponse = await axios.get(`http://localhost:8080/api/v1/user/findByProjectId/${projectId}`);
      setMembers(membersResponse.data.data);
    } catch (error) {
      console.error('Error adding or editing member:', error);
    }
  };

  const handleDeleteMember = async (username) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/project/removeUserByUsername`, null, {
        params: {
          projectId,
          username,
          deleterId,
        },
      });
      const membersResponse = await axios.get(`http://localhost:8080/api/v1/user/findByProjectId/${projectId}`);
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

  return (
    <div>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          {project ? (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h2">{project.name}</Typography>
                <Typography variant="body1" component="p">{project.description}</Typography>
                <Typography variant="body1" component="p"><strong>Status:</strong> {project.status}</Typography>
                <Typography variant="body1" component="p"><strong>Leader ID:</strong> {project.leaderId}</Typography>
                <Typography variant="body1" component="p"><strong>Creation Date:</strong> {project.creationDate}</Typography>
                <Typography variant="body1" component="p"><strong>Start Date:</strong> {project.startDate}</Typography>
                <Typography variant="body1" component="p"><strong>Expected End Date:</strong> {project.expectedEndDate}</Typography>
                <Typography variant="body1" component="p"><strong>Notes:</strong> {project.notes}</Typography>
                <Typography variant="body1" component="p"><strong>Version:</strong> {project.version}</Typography>
                <Typography variant="body1" component="p"><strong>Platform:</strong> {project.platform}</Typography>
                <Typography variant="body1" component="p"><strong>Copyright:</strong> {project.copyright}</Typography>
                <Typography variant="body1" component="p"><strong>Tags:</strong> {project.tags}</Typography>
                <Typography variant="body1" component="p"><strong>Number of Members:</strong> {project.numberOfMembers}</Typography>
                <Typography variant="body1" component="p"><strong>Source Code:</strong> <a href={project.sourceCode} target="_blank" rel="noopener noreferrer">{project.sourceCode}</a></Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h3">Add or Edit Member</Typography>
                <TextField
                  label="Username"
                  name="username"
                  value={newMember.username}
                  onChange={handleInputChange}
                  sx={{ mr: 2 }}
                />
                <FormControl sx={{ mr: 2, minWidth: 200 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="LEADER">LEADER</MenuItem>
                    <MenuItem value="BE">BE</MenuItem>
                    <MenuItem value="FE">FE</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                    <MenuItem value="BA">BA</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleAddOrEditMember}>
                  {editingMember ? 'Edit Member' : 'Add Member'}
                </Button>
              </Box>
              <Box>
                <Typography variant="h5" component="h3">Project Members</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEditClick(member)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteMember(member.username)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          ) : (
            <Typography variant="h6" component="p">Loading project details...</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
