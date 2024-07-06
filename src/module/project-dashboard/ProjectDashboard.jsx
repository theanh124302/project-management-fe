// src/components/dashboard/Dashboard.jsx
import React from 'react';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card } from 'react-bootstrap';
import MyPieChart from '../charts/MyPieChart';
import DueDateTaskBarChart from '../charts/DueDateTaskBarChart'; // Import DueDateTaskBarChart
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const Dashboard = () => {
  const { projectId } = useParams();

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10} className='content-style'>
        <Row>
          <Col xs={12} md={4}>
            <MyPieChart projectId={projectId} />
          </Col>
          <Col xs={12} md={4}>
            <DueDateTaskBarChart projectId={projectId} />
          </Col>
        </Row>

        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
