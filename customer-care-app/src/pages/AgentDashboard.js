import React, { useState } from 'react';
import { Button, Tabs, Tab } from 'react-bootstrap';
import TicketForm from '../components/agent/TicketForm';
import TicketsTable from '../components/agent/TicketsTable';
import ClientForm from '../components/agent/ClientForm';
import ClientsTable from '../components/agent/ClientsTable';
import { TicketsProvider, useTickets } from '../context/agent/TicketsContext';
import { ClientsProvider, useClients } from '../context/agent/ClientsContext';

function AgentDashboardContent() {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  
  const { tickets, addTicket, updateTicket, deleteTicket } = useTickets();
  const { clients, addClient, updateClient, deleteClient } = useClients();

  const handleOpenTicketModal = () => {
    setShowTicketModal(true);
    setEditingTicket(null);
  };

  const handleCloseTicketModal = () => {
    setShowTicketModal(false);
    setEditingTicket(null);
  };

  const handleOpenClientModal = () => {
    setShowClientModal(true);
    setEditingClient(null);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setShowTicketModal(true);
  };

  const handleSaveTicket = (ticket) => {
    if (editingTicket) {
      updateTicket(editingTicket.id, ticket);
    } else {
      addTicket(ticket);
    }
    handleCloseTicketModal();
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleSaveClient = (client) => {
    if (editingClient) {
      updateClient(editingClient.id, client);
    } else {
      addClient(client);
    }
    handleCloseClientModal();
  };

  return (
    <div className="p-4" >
      <div className="d-flex flex-column mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-4"> Agent1</h2>
          <div>
            <Button variant="primary" onClick={handleOpenTicketModal} className="me-2">
              Create Ticket
            </Button>
            <Button variant="success" onClick={handleOpenClientModal}>
              Add Client
            </Button>
          </div>
        </div>
        
        <div className=" text-primary p-4 card mb-4">
          <h3>Quick Summary</h3>
          <p>Tickets: {tickets.length} | Clients: {clients.length}</p>
        </div>
      </div>

      <TicketForm 
        show={showTicketModal} 
        handleClose={handleCloseTicketModal}
        addTicket={handleSaveTicket}
        ticket={editingTicket}
      />

      <ClientForm 
        show={showClientModal} 
        handleClose={handleCloseClientModal}
        addClient={handleSaveClient}
        client={editingClient}
      />

      <Tabs defaultActiveKey="tickets" id="agent-tabs" className="mb-3 custom-tabs">
        <Tab 
          eventKey="tickets" 
          title={
            <span>
              <i className="bi bi-ticket-detailed me-1"></i> Tickets
            </span>
          }
        >
          <TicketsTable 
            tickets={tickets} 
            handleEdit={handleEditTicket}
            handleDelete={deleteTicket}
          />
        </Tab>
        <Tab 
          eventKey="clients" 
          title={
            <span>
              <i className="bi bi-people-fill me-1"></i> Clients
            </span>
          }
        >
          <ClientsTable 
            clients={clients} 
            handleEdit={handleEditClient}
            handleDelete={deleteClient}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

function AgentDashboard() {
  return (
    <TicketsProvider>
      <ClientsProvider>
        <AgentDashboardContent />
      </ClientsProvider>
    </TicketsProvider>
  );
}

export default AgentDashboard;