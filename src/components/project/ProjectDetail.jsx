import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import '../../public/css/ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);

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

  return (
    <div style={{padding: '20px'}}>
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
              <Box>
                <Typography variant="h5" component="h3">Project Members</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.role}</TableCell>
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
