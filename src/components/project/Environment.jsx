import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../../public/css/Environment.css'; // Import file CSS cho layout

const Environment = () => {
  const [environments, setEnvironments] = useState([]);
  const [error, setError] = useState('');
  const [newEnv, setNewEnv] = useState({ name: '', description: '', value: '', status: 'NonActive' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnv, setCurrentEnv] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchEnvironments = async () => {
      const query = new URLSearchParams(location.search);
      const projectId = query.get('projectId');

      if (!projectId) {
        setError('Project ID không tồn tại.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/environment/findByProjectId?projectId=${projectId}`);
        setEnvironments(response.data.data);
      } catch (error) {
        setError('Không thể tải môi trường.');
      }
    };

    fetchEnvironments();
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEnv({ ...newEnv, [name]: value });
  };

  const handleCreate = async () => {
    const query = new URLSearchParams(location.search);
    const projectId = query.get('projectId');
    try {
      const response = await axios.post('http://localhost:8080/api/v1/environment/create', {
        ...newEnv,
        projectId: parseInt(projectId, 10),
        createdBy: 1 // Assuming the user ID is 1 for now
      });
      setEnvironments([...environments, response.data.data]);
      setNewEnv({ name: '', description: '', value: '', status: 'NonActive' });
    } catch (error) {
      setError('Không thể tạo môi trường.');
    }
  };

  const handleEdit = (env) => {
    setCurrentEnv(env);
    setNewEnv(env);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/environment/update', newEnv);
      const updatedEnv = response.data.data;
      setEnvironments(environments.map((env) => (env.id === updatedEnv.id ? updatedEnv : env)));
      setNewEnv({ name: '', description: '', value: '', status: 'NonActive' });
      setIsEditing(false);
      setCurrentEnv(null);
    } catch (error) {
      setError('Không thể cập nhật môi trường.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/environment/delete?id=${id}`);
      setEnvironments(environments.filter((env) => env.id !== id));
    } catch (error) {
      setError('Không thể xóa môi trường.');
    }
  };

  const toggleStatus = async (env) => {
    const updatedEnv = { ...env, status: env.status === 'Active' ? 'NonActive' : 'Active' };
    try {
      const response = await axios.post('http://localhost:8080/api/v1/environment/update', updatedEnv);
      setEnvironments(environments.map((e) => (e.id === response.data.data.id ? response.data.data : e)));
    } catch (error) {
      setError('Không thể cập nhật trạng thái.');
    }
  };

  return (
    <div>
      <h2>Danh sách Environment</h2>
      {error && <p>{error}</p>}
      <div className="environment-list">
        {environments.map((env) => (
          <div key={env.id} className="environment-item">
            <h3>{env.name}</h3>
            <p>Description: {env.description}</p>
            <p>Value: {env.value}</p>
            <p>Status: {env.status}</p>
            <p>Created By: {env.createdBy}</p>
            <button onClick={() => handleEdit(env)}>Edit</button>
            <button onClick={() => handleDelete(env.id)}>Delete</button>
            <button onClick={() => toggleStatus(env)}>
              {env.status === 'Active' ? 'Set NonActive' : 'Set Active'}
            </button>
          </div>
        ))}
      </div>
      <div className="environment-form">
        <h3>{isEditing ? 'Update Environment' : 'Create Environment'}</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>Name</label>
            <input type="text" name="name" value={newEnv.name} onChange={handleChange} />
          </div>
          <div>
            <label>Description</label>
            <input type="text" name="description" value={newEnv.description} onChange={handleChange} />
          </div>
          <div>
            <label>Value</label>
            <input type="text" name="value" value={newEnv.value} onChange={handleChange} />
          </div>
          <button onClick={isEditing ? handleUpdate : handleCreate}>
            {isEditing ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Environment;
