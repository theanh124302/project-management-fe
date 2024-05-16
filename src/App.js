import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomAppBar from "./components/CustomAppBar";
import VerticalTabs from "./components/VerticalTabs";

export default function Main() {
  return (
    <Router>
      <div>
        <CustomAppBar />
        <VerticalTabs />
      </div>
    </Router>
  );
}