import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../public/css/ProjectDetails.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/project/findById?id=${projectId}`);
        setProject(response.data.data);
      } catch (error) {
        setError('Không tìm thấy dự án.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2>Chi tiết dự án</h2>
      {project ? (
        <div className="project-details">
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p>Leader ID: {project.leaderId}</p>
          <p>Creation Date: {new Date(project.creationDate).toLocaleDateString()}</p>
          <p>Status: {project.status}</p>
          <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
          <p>Expected End Date: {new Date(project.expectedEndDate).toLocaleDateString()}</p>
          <p>Notes: {project.notes}</p>
          <p>Version: {project.version}</p>
          <p>Platform: {project.platform}</p>
          <p>Copyright: {project.copyright}</p>
          <p>Tags: {project.tags}</p>
          <p>Cover Image: <img src={project.coverImage} alt="Cover" /></p>
          <p>Source Code: {project.sourceCode}</p>
        </div>
      ) : (
        <p>Dự án không tồn tại.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
