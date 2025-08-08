import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import TicketForm from '../components/agent/TicketForm';
import TicketsTable from '../components/agent/TicketsTable';
import { TicketsProvider, useTickets } from '../context/agent/TicketsContext';

function AgentDashboardContent() {
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const { tickets, addTicket, updateTicket, deleteTicket } = useTickets();

  const handleOpenModal = () => {
    setShowModal(true);
    setEditingTicket(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTicket(null);
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setShowModal(true);
  };

  const handleSaveTicket = (ticket) => {
    if (editingTicket) {
      updateTicket(editingTicket.id, ticket);
    } else {
      addTicket(ticket);
    }
    handleCloseModal();
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customer Care Agent Dashboard</h1>
        <Button variant="primary" onClick={handleOpenModal}>
          Create New Ticket
        </Button>
      </div>

      <TicketForm 
        show={showModal} 
        handleClose={handleCloseModal}
        addTicket={handleSaveTicket}
        ticket={editingTicket}
      />

      <TicketsTable 
        tickets={tickets} 
        handleEdit={handleEdit}
        handleDelete={deleteTicket}
      />
    </div>
  );
}

function AgentDashboard() {
  return (
    <TicketsProvider>
      <AgentDashboardContent />
    </TicketsProvider>
  );
}

export default AgentDashboard;