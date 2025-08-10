import React from 'react';
import { Table, Button, Badge, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

function TicketsTable({ tickets, handleEdit, handleDelete, searchTerm, onSearchChange }) {
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.clientName.toLowerCase().includes(searchLower) ||
      ticket.assignedTech.toLowerCase().includes(searchLower) ||
      ticket.priority.toLowerCase().includes(searchLower) ||
      ticket.status.toLowerCase().includes(searchLower)
    );
  });

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'low': return <Badge bg="success" className="rounded-pill">Low</Badge>;
      case 'medium': return <Badge bg="warning" className="rounded-pill">Medium</Badge>;
      case 'high': return <Badge bg="danger" className="rounded-pill">High</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open': return <Badge bg="primary" className="rounded-pill">Open</Badge>;
      case 'in-progress': return <Badge bg="warning" className="rounded-pill">In Progress</Badge>;
      case 'resolved': return <Badge bg="success" className="rounded-pill">Resolved</Badge>;
      case 'closed': return <Badge bg="secondary" className="rounded-pill">Closed</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div className="position-relative flex-grow-1">
          <FaSearch className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
          <FormControl
            type="search"
            placeholder="Search tickets by title, client, tech, priority, or status..."
            className="ps-5"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
      <Table striped bordered hover className="mt-4 rounded-3 overflow-hidden">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Client</th>
            <th>Priority</th>
            <th>Assigned Tech</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket, index) => (
            <tr key={ticket.id} className={index % 2 === 0 ? '' : 'table-light'}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.clientName}</td>
              <td>{getPriorityBadge(ticket.priority)}</td>
              <td>{ticket.assignedTech}</td>
              <td>{getStatusBadge(ticket.status)}</td>
              <td>{ticket.createdAt || new Date().toLocaleDateString()}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEdit(ticket)}
                  className="me-2"
                  title="Edit"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(ticket.id)}
                  title="Delete"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {filteredTickets.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No tickets found matching your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </div>
  );
}

export default TicketsTable;