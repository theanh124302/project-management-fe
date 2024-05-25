import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../../public/css/ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: ''
  });
  const [leaderId, setLeaderId] = useState(null);
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/project/findByUsername?username=${username}`);
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchLeaderId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/findByUsername/${username}`);
        setLeaderId(response.data.data.id);
      } catch (error) {
        console.error('Error fetching leader ID:', error);
      }
    };

    fetchProjects();
    fetchLeaderId();
  }, [username]);

  const handleAddProject = async () => {
    if (!leaderId) {
      console.error('Leader ID not found');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/v1/project/create', {
        ...newProject,
        leaderId
      });
      setShowAddForm(false);
      setNewProject({ name: '', description: '', status: '' });
      const response = await axios.get(`http://localhost:8080/api/v1/project/findByUsername?username=${username}`);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="project-list-container">
      <h2>Danh sách dự án</h2>
      <div className="project-list">
        {projects.map((project) => (
          <button key={project.id} className="project-button">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p><strong>Status:</strong> {project.status}</p>
          </button>
        ))}
        <button className="project-button add-project-button" onClick={() => setShowAddForm(true)}>
          <span>+</span>
        </button>
      </div>
      {showAddForm && (
        <div className="add-project-form">
          <h3>Thêm dự án mới</h3>
          <input
            type="text"
            placeholder="Tên dự án"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <textarea
            placeholder="Mô tả dự án"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Trạng thái"
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          />
          <button onClick={handleAddProject}>Thêm dự án</button>
          <button onClick={() => setShowAddForm(false)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
