import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, ListGroup, Modal } from 'react-bootstrap';
import CustomAppBar from '../navbar/CustomAppBar';
import VerticalTabs from '../tabs/VerticalTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/css/TaskComments.css';

const backendUrl = 'http://localhost:8080';

const TaskComments = () => {
  const { taskId, projectId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editComment, setEditComment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userMap, setUserMap] = useState({});
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/v1/comment/findByTaskId`, {
          params: { taskId }
        });
        setComments(response.data.data);

        // Get unique user IDs
        const userIds = [...new Set(response.data.data.map(comment => comment.userId))];

        // Fetch user details
        const userPromises = userIds.map(id => axios.get(`${backendUrl}/api/v1/user/findById/${id}`));
        const users = await Promise.all(userPromises);
        const userMap = users.reduce((acc, user) => {
          acc[user.data.data.id] = user.data.data;
          return acc;
        }, {});

        setUserMap(userMap);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [taskId]);

  const handleAddComment = async () => {
    try {
      const commentDTO = {
        content: newComment,
        taskId: taskId,
        userId: userId,
      };
      await axios.post(`${backendUrl}/api/v1/comment/create`, commentDTO);
      setNewComment('');
      const response = await axios.get(`${backendUrl}/api/v1/comment/findByTaskId`, {
        params: { taskId }
      });
      setComments(response.data.data);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditComment(comment);
    setShowEditModal(true);
  };

  const handleUpdateComment = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/comment/update`, {
        ...editComment,
      });
      setShowEditModal(false);
      const response = await axios.get(`${backendUrl}/api/v1/comment/findByTaskId`, {
        params: { taskId }
      });
      setComments(response.data.data);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/comment/delete`, {
        params: { id: commentId }
      });
      const response = await axios.get(`${backendUrl}/api/v1/comment/findByTaskId`, {
        params: { taskId }
      });
      setComments(response.data.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Container fluid className="task-comments-container">
      <CustomAppBar />
      <Row>
        <Col xs={12} md={3}>
          <VerticalTabs projectId={projectId} />
        </Col>
        <Col xs={12} md={9}>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Comments</Card.Title>
              <ListGroup>
                {comments.map((comment) => (
                  <ListGroup.Item key={comment.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <p>{comment.content}</p>
                      <small>
                        By {userMap[comment.userId]?.name || 'Unknown'} at {formatTimestamp(comment.createdAt)}
                      </small>
                    </div>
                    {comment.userId === userId && (
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditComment(comment)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form.Group controlId="newComment" className="mt-3">
                <Form.Label>New Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="primary" className="mt-2" onClick={handleAddComment}>
                  Add Comment
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="editCommentContent">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editComment?.content || ''}
              onChange={(e) => setEditComment({ ...editComment, content: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateComment}>
            Update Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskComments;
