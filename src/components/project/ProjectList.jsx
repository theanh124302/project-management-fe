import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../public/css/ProjectList.css';

const ProjectList = () => {
  const location = useLocation();
  const projects = location.state.projects;
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="container">
      <h2>Danh sách dự án</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <button onClick={() => handleProjectClick(project.id)}>
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
