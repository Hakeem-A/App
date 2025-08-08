import React from 'react';
import { Button } from 'react-bootstrap';

function AdminDashboard() {
  return (
    <div className="p-4">
      <h1>Admin Dashboard</h1>
      <p>Placeholder for admin dashboard content</p>
      <div className="d-flex gap-2">
        <Button variant="primary">Manage Users</Button>
        <Button variant="success">View Reports</Button>
      </div>
    </div>
  );
}

export default AdminDashboard;