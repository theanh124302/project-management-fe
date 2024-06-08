import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/Scheduler.css'; // Sử dụng cùng một CSS để duy trì định dạng giống nhau

const backendUrl = 'http://localhost:8080';

const Schedule = () => {
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
      setAppointments(formattedEvents);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [projectId]);

  const currentDate = new Date().toISOString().split('T')[0];

  const handleAddEvent = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/events/create`, {
        ...newEvent,
        projectId: projectId,
      });
      setShowForm(false);
      setNewEvent({ name: '', description: '', priority: '', startDate: '', endDate: '' });
      fetchEvents(); // Fetch events again to include the new event
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setNewEvent({ name: '', description: '', priority: '', startDate: '', endDate: '' });
  };

  return (
    <Container fluid>
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
              <Button variant="success" onClick={() => setShowForm(true)} className="mt-3">
                Add Event
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventName" className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventPriority" className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.priority}
                onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEventStartDate" className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventEndDate" className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Schedule;
