import React, { useState, useContext } from 'react';
import { Button, Tabs, Tab } from 'react-bootstrap';
import TicketForm from '../components/agent/TicketForm';
import ClientForm from '../components/agent/ClientForm';
import ClientsTable from '../components/agent/ClientsTable';
import RouterManagement from '../components/agent/RouterManagement';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
import { DataContext } from '../context/DataContext';

function AgentDashboardContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Fetch mock data from DataContext
  const { 
    tickets, 
    clients, 
    routers, 
    addTicket, 
    updateTicket, 
    deleteTicket,
    addClient,
    updateClient,
    deleteClient
  } = useContext(DataContext);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setEditingTicket(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingTicket(null);
  };

  const handleCreateTicket = (newTicket) => {
    addTicket(newTicket);
    handleCloseCreateModal();
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setShowCreateModal(true);
  };

  const handleSaveTicket = (ticket) => {
    if (editingTicket) {
      updateTicket(editingTicket.id, ticket);
    } else {
      addTicket(ticket);
    }
    handleCloseCreateModal();
  };

  const handleOpenClientModal = () => {
    setShowClientModal(true);
    setEditingClient(null);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
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
    <div className="bg-secondary p-4" >
      <div className="d-flex flex-column mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-4"> Agent Dashboard</h2>
          <div>
            <Button variant="primary" onClick={handleOpenCreateModal} className="me-2">
              Create Ticket
            </Button>
            <Button variant="success" onClick={handleOpenClientModal}>
              Add Client
            </Button>
          </div>
        </div>
        
        <div className="bg-primary p-4 card mb-4">
          <h3>Quick Summary</h3>
          <p>Tickets: {tickets.length} | Clients: {clients.length} | Routers: {routers.length}</p>
        </div>
      </div>

      <TicketForm 
        show={showCreateModal} 
        handleClose={handleCloseCreateModal}
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
          <TicketList tickets={tickets} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
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
        <Tab 
          eventKey="routers" 
          title={
            <span>
              <i className="bi bi-router me-1"></i> Routers
            </span>
          }
        >
          <RouterManagement />
        </Tab>
      </Tabs>

      <CreateTicketModal
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateTicket}
        technicians={[
          { id: 1, name: 'Tech A' },
          { id: 2, name: 'Tech B' },
          { id: 3, name: 'Tech C' },
        ]}
      />
    </div>
  );
}

function AgentDashboard() {
  return <AgentDashboardContent />;
}

export default AgentDashboard;
