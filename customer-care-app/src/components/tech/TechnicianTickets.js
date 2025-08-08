import React, { useState } from 'react';
import { Card, Button, Badge, Form } from 'react-bootstrap';

function TechnicianTickets({ tickets, updateTicket }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setComment('');
    setTimeSpent('');
  };
  
  const handleStatusChange = (status) => {
    if (selectedTicket) {
      updateTicket(selectedTicket.id, { status });
      setSelectedTicket({ ...selectedTicket, status });
    }
  };
  
  const handleAddComment = () => {
    if (selectedTicket && comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString()
      };
      
      const updatedComments = [...(selectedTicket.comments || []), newComment];
      updateTicket(selectedTicket.id, { comments: updatedComments });
      setComment('');
    }
  };
  
  const handleRecordTime = () => {
    if (selectedTicket && timeSpent) {
      const minutes = parseInt(timeSpent, 10);
      if (!isNaN(minutes) && minutes > 0) {
        updateTicket(selectedTicket.id, { 
          timeSpent: (selectedTicket.timeSpent || 0) + minutes
        });
        setTimeSpent('');
      }
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <Badge bg="secondary">Pending</Badge>;
      case 'in-progress': return <Badge bg="info">In Progress</Badge>;
      case 'completed': return <Badge bg="success">Completed</Badge>;
      default: return <Badge bg="secondary">N/A</Badge>;
    }
  };
  
  return (
    <div>
      <h3 className="mb-3">Assigned Tickets</h3>
      
      <div className="d-flex flex-wrap gap-3 mb-4">
        {tickets.map(ticket => (
          <Card 
            key={ticket.id} 
            style={{ width: '18rem' }}
            className={selectedTicket?.id === ticket.id ? 'border-primary' : ''}
            onClick={() => handleSelectTicket(ticket)}
          >
            <Card.Body>
              <Card.Title>{ticket.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {ticket.clientName}
              </Card.Subtitle>
              <div className="d-flex justify-content-between">
                <span>{getStatusBadge(ticket.status)}</span>
                <span>Time: {ticket.timeSpent || 0} min</span>
              </div>
              <Button 
                size="sm" 
                variant="outline-primary" 
                className="mt-2 w-100"
                onClick={() => handleSelectTicket(ticket)}
              >
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      
      {selectedTicket && (
        <div className="card p-4">
          <h4>Ticket Details: {selectedTicket.title}</h4>
          <p>{selectedTicket.description}</p>
          
          <div className="mb-3">
            <h5>Update Status</h5>
            <div className="d-flex gap-2">
              <Button 
                variant={selectedTicket.status === 'pending' ? 'primary' : 'outline-primary'}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={selectedTicket.status === 'in-progress' ? 'primary' : 'outline-info'}
                onClick={() => handleStatusChange('in-progress')}
              >
                In Progress
              </Button>
              <Button 
                variant={selectedTicket.status === 'completed' ? 'primary' : 'outline-success'}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
          
          <div className="mb-3">
            <h5>Add Comment</h5>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
              />
            </Form.Group>
            <Button 
              variant="primary" 
              className="mt-2"
              onClick={handleAddComment}
              disabled={!comment.trim()}
            >
              Add Comment
            </Button>
          </div>
          
          <div className="mb-3">
            <h5>Record Time Spent</h5>
            <div className="d-flex gap-2">
              <Form.Control
                type="number"
                placeholder="Minutes"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                style={{ width: '100px' }}
              />
              <Button 
                variant="warning"
                onClick={handleRecordTime}
                disabled={!timeSpent}
              >
                Record Time
              </Button>
            </div>
          </div>
          
          <div>
            <h5>Comments</h5>
            {selectedTicket.comments?.length > 0 ? (
              <ul className="list-group">
                {selectedTicket.comments.map(comment => (
                  <li key={comment.id} className="list-group-item">
                    <p>{comment.text}</p>
                    <small className="text-muted">
                      {new Date(comment.timestamp).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicianTickets;