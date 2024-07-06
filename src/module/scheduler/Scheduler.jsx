import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosInstance';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Styles.css';

const Schedule = () => {
  const userId = localStorage.getItem('userId');
  const [projectLeaderId, setProjectLeaderId] = useState(null);
  const { projectId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

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
        status: event.status,
        description: event.description,
        priority: event.priority
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

  const handleEventClick = (event) => {
    setCurrentEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentDate = new Date().toISOString().split('T')[0];

  const CustomAppointment = ({ data, ...restProps }) => {
    let backgroundColor = '#FFA726';
    if (data.status === 'CANCELLED') {
      backgroundColor = '#dc3545';
    } else if (data.status === 'NOT_STARTED') {
      backgroundColor = '#6c757d';
    } else if (data.status === 'IN_PROGRESS') {
      backgroundColor = '#0dcaf0';
    }
    else if (data.status === 'COMPLETED') {
      backgroundColor = '#198754';
    }
    else if (data.status === 'ON_HOLD') {
      backgroundColor = '#ffc107';
    }
    else if (data.status === 'PENDING') {
      backgroundColor = '#6c757d';
    }
    else if (data.status === 'BLOCKED') {
      backgroundColor = '#212529';
    }
    return (
      <Appointments.Appointment
        {...restProps}
        data={data}
        style={{ backgroundColor }}
        onClick={() => handleEventClick(data)}
      />
    );
  };

  return (
    <Container fluid>
      <CustomAppBar />
      <Row>
        <Col xs={12} md={2}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={10} className='content-style'>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Schedule</Card.Title>
              <Paper>
                <Scheduler data={appointments}>
                  <ViewState currentDate={currentDate} />
                  <MonthView />
                  <Appointments 
                    appointmentComponent={CustomAppointment}
                  />
                </Scheduler>
              </Paper>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {currentEvent.title}</p>
          <p><strong>Description:</strong> {currentEvent.description}</p>
          <p><strong>Status:</strong>{currentEvent.status}</p>
          <p><strong>Priority:</strong> {currentEvent.priority}</p>
          <p><strong>Start Date:</strong> {formatDateTime(currentEvent.startDate)}</p>
          <p><strong>End Date:</strong> {formatDateTime(currentEvent.endDate)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Schedule;
