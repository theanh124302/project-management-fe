import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Dashboard.css'; // Sử dụng cùng một CSS để duy trì định dạng giống nhau

const backendUrl = 'http://localhost:8080';

const Schedule = () => {
  const { projectId } = useParams();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/events/findByProjectId`, {
          params: { projectId }
        });
        const events = response.data.data;
        const formattedEvents = events.map(event => ({
          startDate: event.startDate,
          endDate: event.endDate,
          title: event.name,
        }));
        console.log(formattedEvents)
        setAppointments(formattedEvents);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    fetchEvents();
  }, [projectId]);

  const currentDate = new Date().toISOString().split('T')[0];


  return (
    <Container fluid className="dashboard-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9} className='config'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Schedule</Card.Title>
              <Paper>
                <Scheduler data={appointments}>
                  <ViewState currentDate={currentDate} />
                  <MonthView />
                  <Appointments />
                </Scheduler>
              </Paper>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Schedule;
