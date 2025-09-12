import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';
import ActivityLog from '../components/admin/ActivityLog';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
import { ticketsAPI, usersAPI, clientsAPI } from '../services/api';

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [alert, setAlert] = useState(null);

  // Fetch tickets and technicians on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, techniciansResponse, clientsResponse] = await Promise.all([
          ticketsAPI.getAll(),
          usersAPI.getTechnicians(),
          clientsAPI.getAll()
        ]);

        setTickets(ticketsResponse.data.tickets || []);
        setTechnicians(techniciansResponse.data.technicians || []);
        setClients(clientsResponse.data.clients || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Failed to load data. Please try again.', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      if (editingTicket) {
        // Update existing ticket
        await ticketsAPI.update(editingTicket.id, {
          title: ticketData.title,
          description: ticketData.description || '',
          priority: ticketData.priority || 'medium',
          status: ticketData.status || 'pending',
          assigned_tech_id: ticketData.assignedTechId
        });
        showAlert('Ticket updated successfully!');
      } else {
        // Create new ticket
        await ticketsAPI.create({
          title: ticketData.title,
          description: ticketData.description || '',
          priority: ticketData.priority || 'medium',
          status: ticketData.status || 'pending',
          client_id: ticketData.client_id || ticketData.clientId,
          assigned_tech_id: ticketData.assigned_tech_id || ticketData.assignedTechId
        });
        showAlert('Ticket created successfully!');
      }

      // Refresh tickets list
      const response = await ticketsAPI.getAll();
      setTickets(response.data.tickets || []);
      setEditingTicket(null);
    } catch (error) {
      console.error('Error saving ticket:', error);
      showAlert('Failed to save ticket. Please try again.', 'danger');
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setShowCreateModal(true);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketsAPI.delete(ticketId);
        showAlert('Ticket deleted successfully!', 'info');

        // Refresh tickets list
        const response = await ticketsAPI.getAll();
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error('Error deleting ticket:', error);
        showAlert('Failed to delete ticket. Please try again.', 'danger');
      }
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

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" role="status" />
        <div>Loading...</div>
      </div>
    );
  }

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

      <CreateTicketModal
        show={showCreateModal}
        onClose={handleCloseModal}
        onCreate={handleCreateTicket}
        ticket={editingTicket}
        technicians={technicians}
        clients={clients}
      />
    </div>
  );
}

export default AdminDashboard;
