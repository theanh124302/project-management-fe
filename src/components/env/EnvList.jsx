import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField, Button, Box } from '@mui/material';
import '../../public/css/EnvList.css';

const EnvList = () => {
  const [environments, setEnvironments] = useState([]);
  const [newEnv, setNewEnv] = useState({ name: '', value: '', description: '', status: 'inactive' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnv, setCurrentEnv] = useState(null);
  const { projectId } = useParams();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/environment/findByProjectId?projectId=${projectId}`);
        setEnvironments(response.data.data);
      } catch (error) {
        console.error('Error fetching environments:', error);
      }
    };

    fetchEnvironments();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEnv({ ...newEnv, [name]: value });
  };

  const handleAddEnv = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/environment/create', {
        ...newEnv,
        projectId: projectId,
        createdBy: userId,
      });
      setEnvironments([...environments, response.data.data]);
      setNewEnv({ name: '', value: '', description: '', status: 'inactive' });
    } catch (error) {
      console.error('Error adding environment:', error);
    }
  };

  const handleUpdateEnv = async (env) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/environment/update', {
        ...env,
        projectId: projectId,
        createdBy: userId,
      });
      setEnvironments(
        environments.map((item) => (item.id === env.id ? response.data.data : item))
      );
    } catch (error) {
      console.error('Error updating environment:', error);
    }
  };

  const handleEditClick = (env) => {
    setCurrentEnv(env);
    setNewEnv(env);
    setIsEditing(true);
  };

  const handleDeleteEnv = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/environment/delete?id=${id}&userId=${userId}`);
      setEnvironments(environments.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting environment:', error);
    }
  };

  const handleStatusChange = async (env) => {
    const updatedEnv = { ...env, status: env.status === 'active' ? 'inactive' : 'active' };
    try {
      await handleUpdateEnv(updatedEnv);
    } catch (error) {
      console.error('Error updating environment status:', error);
    }
  };

  const handleSaveClick = () => {
    handleUpdateEnv({ ...currentEnv, ...newEnv });
    setIsEditing(false);
    setNewEnv({ name: '', value: '', description: '', status: 'inactive' });
    setCurrentEnv(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewEnv({ name: '', value: '', description: '', status: 'inactive' });
    setCurrentEnv(null);
  };

  return (
    <div style={{padding: '20px'}}>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          <h2>Environment List</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Key</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Desc</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {environments.map((env) => (
                  <TableRow key={env.id}>
                    <TableCell>
                      <Checkbox
                        checked={env.status === 'active'}
                        onChange={() => handleStatusChange(env)}
                      />
                    </TableCell>
                    <TableCell>{env.name}</TableCell>
                    <TableCell>{env.value}</TableCell>
                    <TableCell>{env.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditClick(env)}>Edit</Button>
                      <Button onClick={() => handleDeleteEnv(env.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3 }}>
            <h3>{isEditing ? 'Edit Environment' : 'Add Environment'}</h3>
            <TextField
              label="Key"
              name="name"
              value={newEnv.name}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Value"
              name="value"
              value={newEnv.value}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Desc"
              name="description"
              value={newEnv.description}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            {isEditing ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={handleSaveClick}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddEnv}
                sx={{ mt: 2 }}
              >
                Add
              </Button>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default EnvList;
