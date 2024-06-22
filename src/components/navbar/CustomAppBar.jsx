import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { FaSearch, FaUserCircle, FaEnvelope,FaCogs } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../public/css/CustomAppBar.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function CustomAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
    handleMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleADMClick = () => {
    navigate('/projectList');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {renderMenu}
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
            <FaCogs />
            ADM
          </IconButton>
          <Search className="search-bar">
            <SearchIconWrapper>
              <FaSearch />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* <IconButton size="large" aria-label="show 4 new mails" className="icon-button">
              <Badge badgeContent={4} color="error">
                <FaEnvelope />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              className="icon-button"
            >
              <Badge badgeContent={17} color="error">
                <FaBell />
              </Badge>
            </IconButton> */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              className="icon-button"
            >
              <FaUserCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Add this line to provide space for fixed AppBar */}
    </Box>
  );
}
