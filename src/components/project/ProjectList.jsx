import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../public/css/ProjectList.css'; // Import file CSS cho layout
import projectImage from '../../public/image/project.png'; // Đảm bảo đường dẫn đúng

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/project/findByUserId', {
          params: {
            username: 'your-username' // Thay thế bằng username thực tế
          }
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}/env`);
  };

  return (
    <div className="project-list">
      {projects.map((project) => (
        <div key={project.id} className="project-item" onClick={() => handleProjectClick(project.id)}>
          <img src={projectImage} alt={project.name} />
          <h3>{project.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
