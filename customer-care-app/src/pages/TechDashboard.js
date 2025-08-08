import React from 'react';
import { TicketsProvider, useTickets } from '../context/agent/TicketsContext';
import TechnicianTickets from '../components/tech/TechnicianTickets';

function TechDashboardContent() {
  const { tickets, updateTicket } = useTickets();
  
  // Filter tickets assigned to the current technician
  // In a real app, we would filter by logged-in technician
  const assignedTickets = tickets.filter(ticket => ticket.assignedTech === 'Current Tech');
  
  return (
    <div className="p-4">
      <h1>Technician Bob</h1>
      <TechnicianTickets 
        tickets={assignedTickets} 
        updateTicket={updateTicket} 
      />
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