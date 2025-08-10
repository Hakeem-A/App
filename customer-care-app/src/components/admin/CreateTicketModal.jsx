import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateTicketModal({ show, onClose, onCreate, technicians }) {
  const [title, setTitle] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dateAssigned, setDateAssigned] = useState(new Date().toISOString().slice(0, 10));
  const [timeAssigned, setTimeAssigned] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      id: Date.now(),
      title,
      assignedBy,
      assignedTo,
      dateAssigned,
      timeAssigned,
      timeCompleted: null,
    });
    setTitle('');
    setAssignedBy('');
    setAssignedTo('');
    setDateAssigned(new Date().toISOString().slice(0, 10));
    setTimeAssigned(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Ticket</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title/Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter ticket title or description"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAssignedBy">
            <Form.Label>Assigned By</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={assignedBy}
              onChange={e => setAssignedBy(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAssignedTo">
            <Form.Label>Assigned To (Technician)</Form.Label>
            <Form.Select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select technician</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.name}>{tech.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDateAssigned">
            <Form.Label>Date Assigned</Form.Label>
            <Form.Control
              type="date"
              value={dateAssigned}
              onChange={e => setDateAssigned(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTimeAssigned">
            <Form.Label>Time Assigned</Form.Label>
            <Form.Control
              type="time"
              value={timeAssigned}
              onChange={e => setTimeAssigned(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Create Ticket</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateTicketModal;
