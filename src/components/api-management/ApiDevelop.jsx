import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskList.css';

const backendUrl = 'http://localhost:8080';

const ApiDevelop = () => {
  const { projectId, folderId, apiId } = useParams();
  const [apiDetails, setApiDetails] = useState({ method: '', url: '' });
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        setApiDetails({ method: response.data.data.method, url: response.data.data.url });
      } catch (error) {
        console.error('Error fetching API details:', error);
      }
    };

    fetchApiDetails();
  }, [apiId]);

  const handleSendRequest = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/send/sendApi?apiId=${apiId}`);
      setResponse(response.data);
    } catch (error) {
      console.error('Error sending API request:', error);
      setResponse('Error sending request');
    }
  };

  return (
    <Container fluid className="api-develop-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Develop: {apiDetails.name}</Card.Title>
              <ListGroup className="mb-3">
                <ListGroup.Item>
                  <div>
                    <strong>Method:</strong> {apiDetails.method}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div>
                    <strong>URL:</strong> {apiDetails.url}
                  </div>
                </ListGroup.Item>
              </ListGroup>
              <Button variant="primary" onClick={handleSendRequest}>
                Send Request
              </Button>
              <h3 className="mt-4">Response</h3>
              <Card className="mt-2">
                <Card.Body>
                  <pre>{response}</pre>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiDevelop;
