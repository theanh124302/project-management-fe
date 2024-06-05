import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Box, Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import '../../public/css/ApiList.css';

const backendUrl = 'http://localhost:8080';

const ApiList = () => {
  const { projectId, folderId } = useParams();
  const [apis, setApis] = useState([]);
  const [newApi, setNewApi] = useState({
    name: '',
    description: '',
    url: '',
    method: '',
    status: '',
    bodyJson: '',
    token: '',
    lifeCycle: '',
  });
  const [editingApi, setEditingApi] = useState(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingApi) {
      setEditingApi({ ...editingApi, [name]: value });
    } else {
      setNewApi({ ...newApi, [name]: value });
    }
  };

  const handleAddApi = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/api/create`, { ...newApi, projectId, folderId });
      setApis([...apis, response.data.data]);
      setNewApi({
        name: '',
        description: '',
        url: '',
        method: '',
        status: '',
        bodyJson: '',
        token: '',
        lifeCycle: '',
      });
    } catch (error) {
      console.error('Error adding API:', error);
    }
  };

  const handleUpdateApi = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/api/update`, { ...editingApi });
      setApis(apis.map(api => (api.id === editingApi.id ? response.data.data : api)));
      setEditingApi(null);
    } catch (error) {
      console.error('Error updating API:', error);
    }
  };

  const handleDeleteApi = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/api/delete`, { data: { id } });
      setApis(apis.filter(api => api.id !== id));
    } catch (error) {
      console.error('Error deleting API:', error);
    }
  };

  const handleSendApi = async (apiId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/send/sendApi`, { params: { apiId } });
      setApiResponse(response.data);
      setResponseDialogOpen(true);
    } catch (error) {
      console.error('Error sending API request:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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
                      <IconButton onClick={() => setEditingApi(api)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteApi(api.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleSendApi(api.id)}>
                        <SendIcon />
                      </IconButton>
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
              name="name"
              value={editingApi ? editingApi.name : newApi.name}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={editingApi ? editingApi.description : newApi.description}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <TextField
              label="URL"
              name="url"
              value={editingApi ? editingApi.url : newApi.url}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <FormControl sx={{ mr: 2, minWidth: 120 }}>
              <InputLabel>Method</InputLabel>
              <Select
                name="method"
                value={editingApi ? editingApi.method : newApi.method}
                onChange={handleInputChange}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
                <MenuItem value="PATCH">PATCH</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Status"
              name="status"
              value={editingApi ? editingApi.status : newApi.status}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Body JSON"
              name="bodyJson"
              value={editingApi ? editingApi.bodyJson : newApi.bodyJson}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <TextField
              label="Token"
              name="token"
              value={editingApi ? editingApi.token : newApi.token}
              onChange={handleInputChange}
              sx={{ mr: 2 }}
            />
            <FormControl sx={{ mr: 2, minWidth: 120 }}>
              <InputLabel>Life Cycle</InputLabel>
              <Select
                name="lifeCycle"
                value={editingApi ? editingApi.lifeCycle : newApi.lifeCycle}
                onChange={handleInputChange}
              >
                <MenuItem value="DEFINE">DEFINE</MenuItem>
                <MenuItem value="DESIGN">DESIGN</MenuItem>
                <MenuItem value="DEVELOP">DEVELOP</MenuItem>
                <MenuItem value="TEST">TEST</MenuItem>
                <MenuItem value="DEPLOY">DEPLOY</MenuItem>
                <MenuItem value="MONITOR">MONITOR</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={editingApi ? handleUpdateApi : handleAddApi}>
              {editingApi ? 'Save' : 'Add'}
            </Button>
          </Box>
          <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)}>
            <DialogTitle>API Response</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {apiResponse}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResponseDialogOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ApiList;