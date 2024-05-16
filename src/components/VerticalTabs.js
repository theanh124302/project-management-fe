import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom

function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate(); // Lấy navigate từ hook useNavigate

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Chuyển đến trang cụ thể tùy thuộc vào giá trị của newValue
    switch (newValue) {
      case 0:
        window.location.href = 'https://www.facebook.com/';
        break;
      case 1:
        navigate('/env');
        break;
      case 2:
        navigate('/task');
        break;
      case 3:
        navigate('/board');
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ marginTop: '250px', display: 'flex', justifyContent: 'flex-start' }}> 
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', paddingLeft: 0 }} // Thêm paddingLeft vào sx để đẩy tabs vào sát bên trái
      >
        <Tab label="API" {...a11yProps(0)} />
        <Tab label="ENV" {...a11yProps(1)} />
        <Tab label="TASK" {...a11yProps(2)} />
        <Tab label="BOARD" {...a11yProps(3)} />
      </Tabs>
    </div>
  );
}