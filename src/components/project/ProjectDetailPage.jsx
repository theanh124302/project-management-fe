// ProjectDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import VerticalTabs from '../tabs/VerticalTabs';
import CustomAppBar from '../navbar/CustomAppBar';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const username = localStorage.getItem('username');

  return (
    <div>
      <CustomAppBar username={username} />
      <div style={{ display: 'flex' }}>
        <VerticalTabs projectId={projectId} />
        <div style={{ marginLeft: '20px', padding: '20px', flex: 1 }}>
          {/* Nội dung chi tiết của từng tab sẽ được hiển thị ở đây */}
          <h2>Project Detail for Project ID: {projectId}</h2>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
