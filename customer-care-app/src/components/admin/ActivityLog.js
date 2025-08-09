import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

function ActivityLog() {
  // Mock activity data
  const activities = [
    { id: 1, user: 'Admin', action: 'Created new ticket', target: 'TKT-001', timestamp: '2025-08-08 10:30:15' },
    { id: 2, user: 'Agent Sarah', action: 'Updated client info', target: 'Client ABC', timestamp: '2025-08-08 09:45:22' },
    { id: 3, user: 'Tech Bob', action: 'Resolved ticket', target: 'TKT-005', timestamp: '2025-08-08 09:30:11' },
    { id: 4, user: 'Admin', action: 'Created new user', target: 'Agent Mike', timestamp: '2025-08-07 16:20:45' },
    { id: 5, user: 'Tech Alice', action: 'Updated router info', target: 'Router XYZ', timestamp: '2025-08-07 14:15:33' },
  ];

  const getActionBadge = (action) => {
    if (action.includes('Created')) return <Badge bg="success">Create</Badge>;
    if (action.includes('Updated')) return <Badge bg="primary">Update</Badge>;
    if (action.includes('Resolved')) return <Badge bg="warning">Resolve</Badge>;
    return <Badge bg="secondary">Action</Badge>;
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Recent Activity</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.user}</td>
                <td>
                  {getActionBadge(activity.action)} {activity.action}
                </td>
                <td>{activity.target}</td>
                <td>{activity.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default ActivityLog;