import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/system';

const CustomTabs = styled(Tabs)({
  borderRight: '1px solid #ddd',
  width: 220,
  marginTop: '20px',
  backgroundColor: '#f5f5f5',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const CustomTab = styled(Tab)({
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#555',
  '&.Mui-selected': {
    color: '#1976d2',
  },
  '&:hover': {
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  padding: '12px 24px',
});

const CustomIconButton = styled(IconButton)({
  margin: '10px',
  color: '#1976d2',
  '&:hover': {
    backgroundColor: '#e3f2fd',
  },
});

const VerticalTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const username = localStorage.getItem('username');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    switch (newValue) {
      case 1:
        navigate(`/project/${projectId}/api`);
        break;
      case 2:
        navigate(`/project/${projectId}/task`);
        break;
      case 3:
        navigate(`/project/${projectId}/detail`);
        break;
      case 4:
        navigate(`/project/${projectId}/env`);
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
      <CustomTabs
        orientation="vertical"
        variant="scrollable"
        value={selectedTab}
        onChange={handleTabChange}
      >
        <CustomIconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </CustomIconButton>
        <CustomTab label="API" />
        <CustomTab label="TASK" />
        <CustomTab label="DETAIL" />
        {/* <CustomTab label="ENV" /> */}
      </CustomTabs>
    </Box>
  );
};

export default VerticalTabs;
