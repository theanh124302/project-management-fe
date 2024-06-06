import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTasks, FaInfoCircle, FaCogs, FaDatabase, FaBug, FaTachometerAlt, FaCalendarAlt } from 'react-icons/fa'; // Updated import
import '../../public/css/VerticalTabs.css';  // Import CSS

const VerticalTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const username = localStorage.getItem('username');

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
    switch (tabIndex) {
      case 0:
        navigate(`/project/${projectId}/dashboard`);
        break;
      case 1:
        navigate(`/project/${projectId}/schedule`);
        break;
      case 2:
        navigate(`/project/${projectId}/api`);
        break;
      case 3:
        navigate(`/project/${projectId}/task`);
        break;
      case 4:
        navigate(`/project/${projectId}/database`);
        break;
      case 5:
        navigate(`/project/${projectId}/issue`);
        break;
      case 6:
        navigate(`/project/${projectId}/detail`);
        break;
      default:
        break;
    }
  };

  const handleBackClick = () => {
    navigate(`/projectList?username=${username}`);
  };

  return (
    <div className="vertical-tabs d-flex flex-column bg-success p-3">
      <button className="btn btn-light mb-3" onClick={handleBackClick}>
        <FaArrowLeft /> Back
      </button>
      <nav className="nav flex-column">
        <a
          className={`nav-link text-white ${selectedTab === 0 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(0)}
        >
          <FaTachometerAlt className="mr-2" /> Dashboard
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 1 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(1)}
        >
          <FaCalendarAlt className="mr-2" /> Schedule
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 2 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(2)}
        >
          <FaTasks className="mr-2" /> API
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 3 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(3)}
        >
          <FaTasks className="mr-2" /> Task
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 4 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(4)}
        >
          <FaDatabase className="mr-2" /> Database
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 5 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(5)}
        >
          <FaBug className="mr-2" /> Issue
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 6 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(6)}
        >
          <FaInfoCircle className="mr-2" /> Detail
        </a>
      </nav>
    </div>
  );
};

export default VerticalTabs;
