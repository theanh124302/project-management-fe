import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskList.css';

const backendUrl = 'http://localhost:8080';

const ApiDevelop = () => {
  const { projectId, folderId, apiId } = useParams();
  const [apiDetails, setApiDetails] = useState({ method: '', url: '', token: '', header: '', parameters: '', bodyJson: '' });
  const [response, setResponse] = useState('');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [param, setParam] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/api/findById?id=${apiId}`);
        const data = response.data.data;
        setApiDetails({
          method: data.method,
          url: data.url,
          token: data.token || '',
          header: data.header || '',
          parameters: data.parameters || '',
          bodyJson: data.bodyJson || ''
        });
        setToken(data.token || '');
        setHeader(data.header || '');
        setParam(data.parameters || '');
        setBody(data.bodyJson || '');
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

  const handleSave = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/api/updateParametersAndBodyAndTokenAndHeader`, null, {
        params: {
          id: apiId,
          parameters: param,
          body: body,
          token: token,
          header: header,
        },
      });
      setResponse(response.data.message);
    } catch (error) {
      console.error('Error updating API details:', error);
      setResponse('Error updating API details');
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
              <Form className="mb-3">
                <Row className="align-items-center">
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label><strong>Method:</strong></Form.Label>
                      <Form.Control type="text" value={apiDetails.method} readOnly />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label><strong>URL:</strong></Form.Label>
                      <Form.Control type="text" value={apiDetails.url} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Token</Form.Label>
                  <Form.Control type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder={apiDetails.token} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Header</Form.Label>
                  <Form.Control type="text" value={header} onChange={(e) => setHeader(e.target.value)} placeholder={apiDetails.header} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Param</Form.Label>
                  <Form.Control type="text" value={param} onChange={(e) => setParam(e.target.value)} placeholder={apiDetails.parameters} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Body</Form.Label>
                  <Form.Control as="textarea" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder={apiDetails.bodyJson} />
                </Form.Group>
                <Row className="mb-3">
                  <Col xs="auto">
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button variant="secondary" size="sm" onClick={handleSendRequest}>
                      Send Request
                    </Button>
                  </Col>
                </Row>
              </Form>
              <h3 className="mt-4">Response</h3>
              <Card className="mt-2">
                <Card.Body>
                  <pre>{typeof response === 'object' ? JSON.stringify(response, null, 2) : response}</pre>
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
