import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import '../../public/css/FolderList.css';

const backendUrl = 'http://localhost:8080';

const FolderList = () => {
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/folder/findByProjectId?projectId=${projectId}`);
        setFolders(response.data.data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFolders();
  }, [projectId]);

  const handleAddFolder = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/folder/create`, { name: newFolder, projectId });
      setFolders([...folders, response.data.data]);
      setNewFolder('');
    } catch (error) {
      console.error('Error adding folder:', error);
    }
  };

  const handleUpdateFolder = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/folder/update`, { ...editingFolder });
      setFolders(folders.map(f => (f.id === editingFolder.id ? response.data.data : f)));
      setEditingFolder(null);
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/folder/delete`, { params: { id } });
      setFolders(folders.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleFolderClick = (folderId) => {
    navigate(`/project/${projectId}/folder/${folderId}/apis`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          <h2>Folder List</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '80%' }}>Name</TableCell>
                  <TableCell style={{ width: '20%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {folders.map((folder) => (
                  <TableRow key={folder.id} onClick={() => handleFolderClick(folder.id)}>
                    <TableCell>{folder.name}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolder(folder);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3 }}>
            <h3>{editingFolder ? 'Edit Folder' : 'Add Folder'}</h3>
            <TextField
              label="Folder Name"
              value={editingFolder ? editingFolder.name : newFolder}
              onChange={(e) => editingFolder ? setEditingFolder({ ...editingFolder, name: e.target.value }) : setNewFolder(e.target.value)}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary" onClick={editingFolder ? handleUpdateFolder : handleAddFolder}>
              {editingFolder ? 'Save' : 'Add'}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default FolderList;
