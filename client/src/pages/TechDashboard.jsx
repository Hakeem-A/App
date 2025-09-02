import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/DataContext';
import TechnicianTickets from '../components/tech/TechnicianTickets';
import LeaveManagement from '../components/tech/LeaveManagement';
import { Alert, Spinner } from 'react-bootstrap';

function TechDashboardContent() {
  const { tickets, updateTicket, clients } = useContext(DataContext);
  const {user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

   const currentTechId = user?.id;

   const assignedTickets = tickets.filter(ticket => ticket.assignedTech === currentTechId);

   const enhancedTickets = assignedTickets.map(ticket => ({
      ...ticket,
      clientName: clients.find(client => client.id === ticket.clientId)?.name || 'Unknown Client'
    }));

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Technician Dashboard</h1>
        <div>
          <span className="text-muted">Welcome, Technician</span>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <TechnicianTickets
            tickets={enhancedTickets}
            updateTicket={updateTicket}
          />
        </div>
        <div className="col-lg-4">
          <LeaveManagement />
        </div>
      </div>
    </div>
  );
}

function TechDashboard() {
  return (
    <TechDashboardContent />
  );
}

export default TechDashboard;
