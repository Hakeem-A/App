import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';
import ActivityLog from '../components/admin/ActivityLog';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';

function AdminDashboard() {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Fix login bug',
      timeAssigned: '09:00 AM',
      assignedBy: 'Admin User',
      assignedTo: 'Tech A',
      timeCompleted: '11:00 AM',
      dateAssigned: '2024-06-01',
    },
    {
      id: 2,
      title: 'Update client info',
      timeAssigned: '10:30 AM',
      assignedBy: 'Admin User',
      assignedTo: 'Tech B',
      timeCompleted: null,
      dateAssigned: '2024-06-02',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateTicket = (newTicket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
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
              <Card.Title>Active Users</Card.Title>
              <Card.Text className="display-4">5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Open Tickets</Card.Title>
              <Card.Text className="display-4">{tickets.filter(t => !t.timeCompleted).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Satisfaction</Card.Title>
              <Card.Text className="display-4">92%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={8}>
          <TicketAnalytics />
          <TicketList tickets={tickets} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </Col>
        <Col md={4}>
          <ActivityLog />
        </Col>
      </Row>
      
      <div className="mt-4">
        <Button variant="primary" className="me-2">Manage Users</Button>
        <Button variant="success" className="me-2">View Reports</Button>
        <Button variant="info" className="me-2">System Settings</Button>
        <Button variant="dark" onClick={() => setShowCreateModal(true)}>Create Ticket</Button>
      </div>

      <CreateTicketModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTicket}
        technicians={[
          { id: 1, name: 'Tech A' },
          { id: 2, name: 'Tech B' },
          { id: 3, name: 'Tech C' },
        ]}
      />
    </div>
  );
}

export default AdminDashboard;
