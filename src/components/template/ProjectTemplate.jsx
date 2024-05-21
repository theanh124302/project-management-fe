import React from 'react';
import CustomAppBar from "./CustomAppBar";
import VerticalTabs from "./VerticalTabs";
import { Outlet } from 'react-router-dom'; // Import Outlet từ react-router-dom

export default function ProjectTemplate() {
  return (
    <div>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <Outlet /> {/* Outlet sẽ hiển thị các trang con */}
        </div>
      </div>
    </div>
  );
}
