import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function TicketForm({ show, handleClose, addTicket }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    priority: 'medium',
    assignedTech: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTicket({ ...formData, id: Date.now(), status: 'pending' });
    handleClose();
    setFormData({
      title: '',
      description: '',
      clientName: '',
      priority: 'medium',
      assignedTech: ''
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select 
              name="priority" 
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Assigned Technician</Form.Label>
            <Form.Control
              type="text"
              name="assignedTech"
              value={formData.assignedTech}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Ticket
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TicketForm;