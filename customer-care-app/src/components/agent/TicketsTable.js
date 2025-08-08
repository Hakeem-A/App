import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

function TicketsTable({ tickets, handleEdit, handleDelete }) {
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'low': return <Badge bg="secondary">Low</Badge>;
      case 'medium': return <Badge bg="primary">Medium</Badge>;
      case 'high': return <Badge bg="warning">High</Badge>;
      case 'critical': return <Badge bg="danger">Critical</Badge>;
      default: return <Badge bg="secondary">N/A</Badge>;
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
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Client</th>
          <th>Priority</th>
          <th>Assigned Tech</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map(ticket => (
          <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>{ticket.clientName}</td>
            <td>{getPriorityBadge(ticket.priority)}</td>
            <td>{ticket.assignedTech}</td>
            <td>{getStatusBadge(ticket.status)}</td>
            <td>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => handleEdit(ticket)}
                className="me-2"
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => handleDelete(ticket.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TicketsTable;