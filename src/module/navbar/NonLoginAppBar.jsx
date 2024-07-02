import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { FaBuysellads } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../public/css/CustomAppBar.css';

export default function CustomAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleADMClick = () => {
    navigate('/login');
  };

  const hadleSignUpClick = () => {
    navigate('/signup');
  }

  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="app-bar" sx={{ backgroundColor: '#FFFFFF', boxShadow: 'none', zIndex: 500 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            className="icon-button"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleADMClick}
          >
            <FaBuysellads />
            DM
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
             onClick={handleLoginClick}
             size="medium"
            >
                Login
            </IconButton>
            <IconButton
             onClick={hadleSignUpClick}
             size="medium"
             edge="end"
            >
                Register 
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Add this line to provide space for fixed AppBar */}
    </Box>
  );
}
