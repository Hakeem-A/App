import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';
import ActivityLog from '../components/admin/ActivityLog';

function AdminDashboard() {
  return (
    <div className="p-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Tickets</Card.Title>
              <Card.Text className="display-4">34</Card.Text>
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
              <Card.Text className="display-4">23</Card.Text>
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
        </Col>
        <Col md={4}>
          <ActivityLog />
        </Col>
      </Row>
      
      <div className="mt-4">
        <Button variant="primary" className="me-2">Manage Users</Button>
        <Button variant="success" className="me-2">View Reports</Button>
        <Button variant="info" className="me-2">System Settings</Button>
        <Button variant="dark">Create Ticket</Button>
      </div>
    </div>
  );
}

export default AdminDashboard;