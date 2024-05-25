// VerticalTabs.jsx
import * as React from 'react';
import { useState } from 'react';
//import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

const VerticalTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const username = localStorage.getItem('username');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // Logic để chuyển hướng tới các trang tương ứng
    switch (newValue) {
      case 0:
        navigate(`/project/${projectId}/api`);
        break;
      case 1:
        navigate(`/project/${projectId}/env`);
        break;
      case 2:
        navigate(`/project/${projectId}/task`);
        break;
      case 3:
        navigate(`/project/${projectId}/detail`);
        break;
      default:
        break;
    }
  };

  const handleBackClick = () => {
    navigate(`/projectList?username=${username}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedTab}
        onChange={handleTabChange}
        sx={{ borderRight: 1, borderColor: 'divider', width: 200, marginTop: '20px' }}
      >
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Tab label="API" />
        <Tab label="ENV" />
        <Tab label="TASK" />
        <Tab label="DETAIL" />
      </Tabs>
    </Box>
  );
};

export default VerticalTabs;
