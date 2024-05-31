import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import '../../public/css/ApiList.css';

const backendUrl = 'http://localhost:8080';

const ApiList = () => {
  const { projectId, folderId } = useParams();
  const [apis, setApis] = useState([]);
  const [newApi, setNewApi] = useState({ name: '', description: '', url: '', method: 'GET', status: 'inactive' });
  const [editingApi, setEditingApi] = useState(null);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findByFolderId?folderId=${folderId}`);
        setApis(response.data.data);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      }
    };

    fetchApis();
  }, [folderId]);

  const handleAddApi = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/api/create`, { ...newApi, projectId, folderId });
      setApis([...apis, response.data.data]);
      setNewApi({ name: '', description: '', url: '', method: 'GET', status: 'inactive' });
    } catch (error) {
      console.error('Error adding API:', error);
    }
  };

  const handleUpdateApi = async (api) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/api/update`, api);
      setApis(apis.map(a => (a.id === api.id ? response.data.data : a)));
      setEditingApi(null);
    } catch (error) {
      console.error('Error updating API:', error);
    }
  };

  const handleDeleteApi = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/api/delete`, { data: { id } });
      setApis(apis.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting API:', error);
    }
  };

  return (
    <div style={{padding: '20px'}}>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          <h2>API List</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apis.map((api) => (
                  <TableRow key={api.id}>
                    <TableCell>{api.name}</TableCell>
                    <TableCell>{api.description}</TableCell>
                    <TableCell>{api.url}</TableCell>
                    <TableCell>{api.method}</TableCell>
                    <TableCell>{api.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => setEditingApi(api)}>Edit</Button>
                      <Button onClick={() => handleDeleteApi(api.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3 }}>
            <h3>{editingApi ? 'Edit API' : 'Add API'}</h3>
            <TextField
              label="Name"
              value={editingApi ? editingApi.name : newApi.name}
              onChange={(e) => editingApi ? setEditingApi({ ...editingApi, name: e.target.value }) : setNewApi({ ...newApi, name: e.target.value })}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Description"
              value={editingApi ? editingApi.description : newApi.description}
              onChange={(e) => editingApi ? setEditingApi({ ...editingApi, description: e.target.value }) : setNewApi({ ...newApi, description: e.target.value })}
              sx={{ mr: 2 }}
            />
            <TextField
              label="URL"
              value={editingApi ? editingApi.url : newApi.url}
              onChange={(e) => editingApi ? setEditingApi({ ...editingApi, url: e.target.value }) : setNewApi({ ...newApi, url: e.target.value })}
              sx={{ mr: 2 }}
            />
            <FormControl sx={{ mr: 2 }}>
              <InputLabel>Method</InputLabel>
              <Select
                value={editingApi ? editingApi.method : newApi.method}
                onChange={(e) => editingApi ? setEditingApi({ ...editingApi, method: e.target.value }) : setNewApi({ ...newApi, method: e.target.value })}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={editingApi ? () => handleUpdateApi(editingApi) : handleAddApi}>
              {editingApi ? 'Save' : 'Add'}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ApiList;
