import React from 'react';
import { TicketsProvider, useTickets } from '../context/agent/TicketsContext';
import TechnicianTickets from '../components/tech/TechnicianTickets';
import LeaveManagement from '../components/tech/LeaveManagement';

function TechDashboardContent() {
  const { tickets, updateTicket } = useTickets();
  
  // Filter tickets assigned to the current technician
  // In a real app, we would filter by logged-in technician
  const assignedTickets = tickets.filter(ticket => ticket.assignedTech === 'Current Tech');
  
  return (
    <div className="p-4">
      <h1>Technician Dashboard</h1>
      <div className="row">
        <div className="col-md-8">
          <TechnicianTickets
            tickets={assignedTickets}
            updateTicket={updateTicket}
          />
        </div>
        <div className="col-md-4">
          <LeaveManagement />
        </div>
      </div>
    </div>
  );
}

function TechDashboard() {
  return (
    <TicketsProvider>
      <TechDashboardContent />
    </TicketsProvider>
  );
}

export default TechDashboard;