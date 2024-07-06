import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {FaFile, FaHubspot, FaCentos, FaTasks, FaInfoCircle, FaDatabase, FaBug, FaTachometerAlt, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import '../../public/css/Styles.css';

const VerticalTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Update selected tab based on current location
    if (location.pathname.includes('/dashboard')) setSelectedTab(0);
    else if (location.pathname.includes('/schedule')) setSelectedTab(1);
    else if (location.pathname.includes('/daily-report')) setSelectedTab(2);
    else if (location.pathname.includes('/api')) setSelectedTab(3);
    else if (location.pathname.includes('/environment')) setSelectedTab(4);
    else if (location.pathname.includes('/task')) setSelectedTab(5);
    else if (location.pathname.includes('/database')) setSelectedTab(6);
    else if (location.pathname.includes('/issue')) setSelectedTab(7);
    else if (location.pathname.includes('/file')) setSelectedTab(8);
    else if (location.pathname.includes('/detail')) setSelectedTab(9);
  }, [location.pathname]);

  const handleTabChange = (tabIndex, path) => {
    setSelectedTab(tabIndex);
    navigate(path);
  };

  return (
    <div className="vertical-tabs d-flex flex-column p-3">
      {/* <button className="btn btn-light mb-3" onClick={handleBackClick}>
        <FaArrowLeft /> Back
      </button> */}
      <nav className="nav flex-column">
        <a
          className={`nav-link text-white ${selectedTab === 0 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(0, `/project/${projectId}/dashboard`)}
        >
          <FaTachometerAlt className="mr-2" /> Dashboard
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 1 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(1, `/project/${projectId}/schedule`)}
        >
          <FaCalendarAlt className="mr-2" /> Schedule
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 2 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(2, `/project/${projectId}/daily-report`)}
        >
          <FaFileAlt className="mr-2" /> Daily Report
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 3 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(3, `/project/${projectId}/api`)}
        >
          <FaHubspot className="mr-2" /> API
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 4 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(4, `/project/${projectId}/environment`)}
        >
          <FaCentos className="mr-2" /> Environment
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 5 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(5, `/project/${projectId}/task`)}
        >
          <FaTasks className="mr-2" /> Task
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 6 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(6, `/project/${projectId}/database`)}
        >
          <FaDatabase className="mr-2" /> Database
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 7 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(7, `/project/${projectId}/issue`)}
        >
          <FaBug className="mr-2" /> Issue
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 8 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(8, `/project/${projectId}/file`)}
        >
          <FaFile className="mr-2" /> File
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 9 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(9, `/project/${projectId}/detail`)}
        >
          <FaInfoCircle className="mr-2" /> Detail
        </a>
      </nav>
    </div>
  );
};

export default VerticalTabs;
