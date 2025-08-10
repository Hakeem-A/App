import React from 'react';
import { Table, FormControl } from 'react-bootstrap';

function TicketList({ tickets, searchTerm, onSearchChange }) {
  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.assignedBy.toLowerCase().includes(searchLower) ||
      ticket.assignedTo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <FormControl
        type="search"
        placeholder="Search tickets"
        className="mb-3"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
      />
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Time Assigned</th>
            <th>Assigned By</th>
            <th>Assigned To</th>
            <th>Time Completed</th>
            <th>Date Assigned</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.timeAssigned}</td>
              <td>{ticket.assignedBy}</td>
              <td>{ticket.assignedTo}</td>
              <td>{ticket.timeCompleted || '-'}</td>
              <td>{ticket.dateAssigned}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default TicketList;
