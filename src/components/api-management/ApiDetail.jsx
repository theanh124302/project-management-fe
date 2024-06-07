import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, TextField, Button } from '@mui/material';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';

const ApiDetail = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [api, setApi] = useState({
    name: '',
    description: '',
    docs: '',
    bodyJson: '',
    token: '',
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApi({ ...api, [name]: value });
  };

  const handleSave = () => {
    // Logic to save API details
  };

  return (
    <div fluid >
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs />
        <div  className='config' >
          <AppBar position="static">
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="api management tabs">
              <Tab label="DEF" />
              <Tab label="DES" />
              <Tab label="DEV" />
              <Tab label="TES" />
              <Tab label="DEP" />
              <Tab label="MON" />
            </Tabs>
          </AppBar>
          <Box sx={{ padding: 2 }}>
            {selectedTab === 0 && (
              <div>
                <TextField
                  label="Name"
                  name="name"
                  value={api.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={api.description}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
                <TextField
                  label="Docs"
                  name="docs"
                  value={api.docs}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Body JSON"
                  name="bodyJson"
                  value={api.bodyJson}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
                <TextField
                  label="Token"
                  name="token"
                  value={api.token}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
              </div>
            )}
            {selectedTab === 1 && <div>Design Content</div>}
            {selectedTab === 2 && <div>Develop Content</div>}
            {selectedTab === 3 && <div>Test Content</div>}
            {selectedTab === 4 && <div>Deploy Content</div>}
            {selectedTab === 5 && <div>Monitoring Content</div>}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ApiDetail;
