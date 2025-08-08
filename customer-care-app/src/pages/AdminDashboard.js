import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';

function AdminDashboard() {
  return (
    <div className="p-4">
      <h2 className="mb-4">Admin1</h2>
      
      {/* Dark mode friendly card */}
      <div className="bg-primary p-4 card mb-4">
        <h3>System Overview</h3>
        <p>Total tickets: 34 | Active users: 5</p>
      </div>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Tickets</Card.Title>
              <Card.Text className="display-4">34</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* ... rest of the dashboard ... */}
      </Row>
      
      <TicketAnalytics />
      
      <div className="mt-4">
        <Button variant="primary" className="me-2">Manage Users</Button>
        <Button variant="success" className="me-2">View Reports</Button>
        <Button variant="secondary">System Settings</Button>
      </div>
    </div>
  );
}

export default AdminDashboard;