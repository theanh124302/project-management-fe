import React, { useState } from 'react';
import axios from 'axios';
import '../../public/css/DeleteProject.css';

const DeleteProject = () => {
  const [projectId, setProjectId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:8080/api/v1/project/delete', {
        data: { id: projectId }
      });
      setMessage('Project deleted successfully');
    } catch (error) {
      setMessage('Failed to delete project');
    }
  };

  return (
    <div className="container">
      <h2>Delete Project</h2>
      <input
        type="text"
        placeholder="Enter Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete Project</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteProject;
