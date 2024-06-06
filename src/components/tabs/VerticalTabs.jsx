import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTasks, FaInfoCircle, FaCogs } from 'react-icons/fa';

const VerticalTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const username = localStorage.getItem('username');

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
    switch (tabIndex) {
      case 1:
        navigate(`/project/${projectId}/api`);
        break;
      case 2:
        navigate(`/project/${projectId}/task`);
        break;
      case 3:
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
    <div className="d-flex flex-column vh-100 bg-success p-3" style={{ width: '220px' }}>
      <button className="btn btn-light mb-3" onClick={handleBackClick}>
        <FaArrowLeft /> Back
      </button>
      <nav className="nav flex-column">
        <a
          className={`nav-link text-white ${selectedTab === 1 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(1)}
        >
          <FaTasks className="mr-2" /> API
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 2 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(2)}
        >
          <FaTasks className="mr-2" /> TASK
        </a>
        <a
          className={`nav-link text-white ${selectedTab === 3 ? 'active' : ''}`}
          href="#"
          onClick={() => handleTabChange(3)}
        >
          <FaInfoCircle className="mr-2" /> DETAIL
        </a>
      </nav>
    </div>
  );
};

export default VerticalTabs;
