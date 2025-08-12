import React, { useState } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';
import ActivityLog from '../components/admin/ActivityLog';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
import EmployeePerformance from '../components/admin/EmployeePerformance';

function AdminDashboard() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Network connectivity issue - Client A',
      timeAssigned: '09:00 AM',
      assignedBy: 'Admin User',
      assignedTo: 'Tech A',
      timeCompleted: '11:00 AM',
      dateAssigned: new Date().toISOString().slice(0, 10),
    },
    {
      id: 2,
      title: 'Router configuration - Client B',
      timeAssigned: '10:30 AM',
      assignedBy: 'Admin User',
      assignedTo: 'Tech B',
      timeCompleted: null,
      dateAssigned: new Date().toISOString().slice(0, 10),
    },
    {
      id: 3,
      title: 'Internet speed optimization - Client C',
      timeAssigned: '02:15 PM',
      assignedBy: 'Admin User',
      assignedTo: 'Tech C',
      timeCompleted: null,
      dateAssigned: new Date().toISOString().slice(0, 10),
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCreateTicket = (newTicket) => {
    if (editingTicket) {
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === editingTicket.id ? newTicket : ticket
        )
      );
      showAlert('Ticket updated successfully!');
    } else {
      setTickets(prevTickets => [newTicket, ...prevTickets]);
      showAlert('Ticket created successfully!');
    }
    setEditingTicket(null);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setShowCreateModal(true);
  };

  const handleDeleteTicket = (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      showAlert('Ticket deleted successfully!', 'info');
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTicket(null);
  };

  // Get today's tickets
  const todaysTickets = tickets.filter(ticket => 
    ticket.dateAssigned === new Date().toISOString().slice(0, 10)
  );

  const completedTickets = tickets.filter(ticket => ticket.timeCompleted);
  const pendingTickets = tickets.filter(ticket => !ticket.timeCompleted);

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {alert && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Tickets</Card.Title>
              <Card.Text className="display-4">{tickets.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Today's Tickets</Card.Title>
              <Card.Text className="display-4">{todaysTickets.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Tickets</Card.Title>
              <Card.Text className="display-4">{pendingTickets.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Completed Today</Card.Title>
              <Card.Text className="display-4">{completedTickets.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Ticket Management</h5>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Ticket
              </Button>
            </Card.Header>
            <Card.Body>
              <TicketList 
                tickets={tickets} 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm}
                onEdit={handleEditTicket}
                onDelete={handleDeleteTicket}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={8}>
          <TicketAnalytics />
        </Col>
        <Col md={4}>
          <ActivityLog />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <EmployeePerformance />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <CreateTicketModal
        show={showCreateModal}
        onClose={handleCloseModal}
        onCreate={handleCreateTicket}
        ticket={editingTicket}
        technicians={[
          { id: 1, name: 'Tech A' },
          { id: 2, name: 'Tech B' },
          { id: 3, name: 'Tech C' },
          { id: 4, name: 'Tech D' },
          { id: 5, name: 'Tech E' },
        ]}
      />
    </div>
  );
}

export default AdminDashboard;
