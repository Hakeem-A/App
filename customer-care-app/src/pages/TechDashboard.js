import React from 'react';
import { Button } from 'react-bootstrap';

function TechDashboard() {
  return (
    <div className="p-4">
      <h1>Technician Dashboard</h1>
      <p>Placeholder for technician dashboard content</p>
      <div className="d-flex gap-2">
        <Button variant="primary">View Assigned Tickets</Button>
        <Button variant="warning">Record Time</Button>
      </div>
    </div>
  );
}

export default TechDashboard;