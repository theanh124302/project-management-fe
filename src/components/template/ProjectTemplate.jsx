import React from 'react';
import CustomAppBar from "./CustomAppBar";
import VerticalTabs from "./VerticalTabs";
import { useLocation } from 'react-router-dom';

export default function ProjectTemplate({ children }) {
  const location = useLocation();

  return (
    <div>
      <CustomAppBar />
      <div style={{ display: 'flex' }}>
        <VerticalTabs />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
