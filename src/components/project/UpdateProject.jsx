import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../public/css/UpdateProject.css';

const UpdateProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/project/findById?id=${projectId}`);
        setProject(response.data.data);
      } catch (error) {
        setMessage('Failed to load project');
      }
    };
    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/project/update', project);
      setMessage('Project updated successfully');
    } catch (error) {
      setMessage('Failed to update project');
    }
  };

  return (
    <div className="container">
      <h2>Update Project</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for project properties */}
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={project.name} onChange={handleChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={project.description} onChange={handleChange}></textarea>
        </div>
        {/* Add more fields as needed */}
        <button type="submit">Update Project</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateProject;
