import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom';
import '../../public/css/VerticalTabs.css';

export default function VerticalTabs() {
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/project/api');
        break;
      case 1:
        navigate('/project/env');
        break;
      case 2:
        navigate('/project/task');
        break;
      case 3:
        navigate('/project/details'); // Đổi đường dẫn này để điều hướng đến trang chi tiết dự án
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '100px' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={false} // Đặt giá trị mặc định của value là false
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="API" />
        <Tab label="ENV" />
        <Tab label="TASK" />
        <Tab label="DETAILS" />
      </Tabs>
    </div>
  );
}
