import React from 'react';
import { Table, Button } from 'react-bootstrap';

function ClientsTable({ clients, handleEdit, handleDelete }) {
  return (
    <Table striped bordered hover responsive className="mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Router Details</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.id}</td>
            <td>{client.name}</td>
            <td>{client.contact}</td>
            <td>{client.address}</td>
            <td>{client.routerDetails}</td>
            <td>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => handleEdit(client)}
                className="me-2"
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => handleDelete(client.id)}
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

export default ClientsTable;