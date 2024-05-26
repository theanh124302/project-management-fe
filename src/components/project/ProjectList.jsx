import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAppBar from '../navbar/CustomAppBar';
import '../../public/css/ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: ''
  });
  const [leaderId, setLeaderId] = useState(null);
  const [userName, setUserName] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/project/findByUsername?username=${username}`);
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/findByUsername/${username}`);
        setUserName(response.data.data.name);
        setLeaderId(response.data.data.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchProjects();
    fetchUserInfo();
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

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/project/delete?id=${id}&userId=${leaderId}`);
      const response = await axios.get(`http://localhost:8080/api/v1/project/findByUsername?username=${username}`);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      status: project.status
    });
    setShowEditForm(true);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}?username=${username}`);
  };

  const handleUpdateProject = async () => {
    try {
      await axios.post(`http://localhost:8080/api/v1/project/update?userId=${leaderId}`, {
        ...currentProject,
        name: newProject.name,
        description: newProject.description,
        status: newProject.status
      });
      setShowEditForm(false);
      setNewProject({ name: '', description: '', status: '' });
      setCurrentProject(null);
      const response = await axios.get(`http://localhost:8080/api/v1/project/findByUsername?username=${username}`);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="project-list-container">
      <CustomAppBar username={username} />
      <h2 style={{ marginBottom: '100px', marginTop: '50px' }}>Welcome, {userName}!</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-button-wrapper">
            <button className="project-button" onClick={() => handleProjectClick(project.id)}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <EditIcon className="icon edit-icon" onClick={(e) => { e.stopPropagation(); handleEditProject(project); }} />
              <DeleteIcon className="icon delete-icon" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} />
            </button>
          </div>
        ))}
        <button className="project-button add-project-button" onClick={() => setShowAddForm(true)}>
          <span>+</span>
        </button>
      </div>
      {(showAddForm || showEditForm) && (
        <div className="add-project-form">
          <h3>{showEditForm ? 'Cập nhật dự án' : 'Thêm dự án mới'}</h3>
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
          <button onClick={showEditForm ? handleUpdateProject : handleAddProject}>
            {showEditForm ? 'Cập nhật dự án' : 'Thêm dự án'}
          </button>
          <button onClick={() => { setShowAddForm(false); setShowEditForm(false); setCurrentProject(null); }}>
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
