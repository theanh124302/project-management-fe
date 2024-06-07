// src/components/dashboard/Dashboard.jsx
import React from 'react';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card } from 'react-bootstrap';
import MyPieChart from '../charts/MyPieChart';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/DashBoard.css';

const Dashboard = () => {
  const { projectId } = useParams();

  return (
    <Container fluid className="dashboard-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className='content'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Dashboard</Card.Title>
              <MyPieChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
