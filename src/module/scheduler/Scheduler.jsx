import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../AxiosInstance';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';
const Schedule = () => {
  const userId = localStorage.getItem('userId');
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const { projectId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    priority: '',
    startDate: '',
    endDate: ''
  });

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/project/findById?id=${projectId}`);
      setProjectLeaderId(response.data.data.leaderId);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/events/findByProjectId`, {
        params: { projectId }
      });
      const events = response.data.data;
      const formattedEvents = events.map(event => ({
        startDate: event.startDate,
        endDate: event.endDate,
        title: event.name,
      }));
      setAppointments(formattedEvents);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchEvents();
  }, [projectId]);

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10}  className='content-style'>
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
