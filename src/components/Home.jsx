import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../public/css/Home.css'; // Import file CSS cho layout

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const username = localStorage.getItem('username'); // Lấy username từ localStorage
      if (!username) {
        setError('Username không tồn tại.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/project/findByUserId', {
          params: {
            username: username,
            page: 0,
            size: 10,
          },
        });
        setProjects(response.data.data);
      } catch (error) {
        setError('Không thể tải dự án.');
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/project/env?projectId=${projectId}`);
  };

  return (
    <div>
      <h2>Danh sách dự án</h2>
      {error && <p>{error}</p>}
      <div className="project-grid">
        {projects.map((project) => (
          <button key={project.id} className="project-button" onClick={() => handleProjectClick(project.id)}>
            <img src={`/image/${project.img}`} alt={project.name} className="project-image" />
            <p>{project.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
