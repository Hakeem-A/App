import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Mock tickets data
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Router Installation', clientId: 1, assignedTech: 1, status: 'completed', priority: 'high', createdAt: '2025-08-01', timeSpent: 120 },
    { id: 2, title: 'Network Configuration', clientId: 2, assignedTech: 2, status: 'in-progress', priority: 'medium', createdAt: '2025-08-03', timeSpent: 45 },
    { id: 3, title: 'Router Recovery', clientId: 3, assignedTech: 1, status: 'pending', priority: 'critical', createdAt: '2025-08-05', timeSpent: 0 },
    { id: 4, title: 'Internet Speed Issue', clientId: 1, assignedTech: 3, status: 'pending', priority: 'medium', createdAt: '2025-08-06', timeSpent: 0 },
    { id: 5, title: 'Hardware Replacement', clientId: 4, assignedTech: 2, status: 'completed', priority: 'high', createdAt: '2025-08-07', timeSpent: 90 },
  ]);

  // Mock clients data
  const [clients, setClients] = useState([
    { id: 1, name: 'Client A', email: 'clientA@example.com', phone: '123-456-7890', address: '123 Main St' },
    { id: 2, name: 'Client B', email: 'clientB@example.com', phone: '234-567-8901', address: '456 Oak Ave' },
    { id: 3, name: 'Client C', email: 'clientC@example.com', phone: '345-678-9012', address: '789 Pine Rd' },
    { id: 4, name: 'Client D', email: 'clientD@example.com', phone: '456-789-0123', address: '101 Maple Ln' },
  ]);

  // Mock technicians data (read-only)
  const [technicians] = useState([
    { id: 1, name: 'Tech Bob', email: 'bob@example.com', phone: '111-222-3333' },
    { id: 2, name: 'Tech Alice', email: 'alice@example.com', phone: '222-333-4444' },
    { id: 3, name: 'Tech Mike', email: 'mike@example.com', phone: '333-444-5555' },
  ]);

  // Mock routers data
  const [routers, setRouters] = useState([
    { id: 1, model: 'TP-Link Archer C7', serial: 'SN-001', status: 'Active', location: 'Client A', lastSeen: '2025-08-08 10:15:00' },
    { id: 2, model: 'Netgear Nighthawk R7000', serial: 'SN-002', status: 'Offline', location: 'Client B', lastSeen: '2025-08-07 14:30:00' },
    { id: 3, model: 'Asus RT-AC86U', serial: 'SN-003', status: 'Recovery Needed', location: 'Client C', lastSeen: '2025-08-06 09:45:00' },
    { id: 4, model: 'Linksys EA7500', serial: 'SN-004', status: 'Active', location: 'Client D', lastSeen: '2025-08-08 09:30:00' },
  ]);

  // Mock activity data
  const [activities, setActivities] = useState([
    { id: 1, user: 'Admin', action: 'Created new ticket', target: 'TKT-001', timestamp: '2025-08-08 10:30:15' },
    { id: 2, user: 'Agent Sarah', action: 'Updated client info', target: 'Client ABC', timestamp: '2025-08-08 09:45:22' },
    { id: 3, user: 'Tech Bob', action: 'Resolved ticket', target: 'TKT-005', timestamp: '2025-08-08 09:30:11' },
    { id: 4, user: 'Admin', action: 'Created new user', target: 'Agent Mike', timestamp: '2025-08-07 16:20:45' },
    { id: 5, user: 'Tech Alice', action: 'Updated router info', target: 'Router XYZ', timestamp: '2025-08-07 14:15:33' },
  ]);

  // Mock analytics data (read-only)
  const [analytics] = useState({
    ticketStatus: [
      { status: 'pending', count: 15 },
      { status: 'in-progress', count: 8 },
      { status: 'completed', count: 11 }
    ],
    ticketPriority: [
      { priority: 'critical', count: 5 },
      { priority: 'high', count: 7 },
      { priority: 'medium', count: 10 },
      { priority: 'low', count: 12 }
    ],
    resolutionTimes: [
      { range: '< 1 day', count: 15 },
      { range: '1-3 days', count: 10 },
      { range: '3-7 days', count: 5 },
      { range: '> 7 days', count: 4 }
    ],
    metrics: {
      avgResolutionTime: '24h 38m',
      firstResponseTime: '2h 15m',
      satisfactionRate: '92%'
    }
  });

  // Ticket CRUD operations
  const addTicket = (ticket) => {
    const newTicket = { ...ticket, id: Date.now() };
    setTickets([...tickets, newTicket]);
    return newTicket;
  };

  const updateTicket = (id, updates) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    ));
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  // Client CRUD operations
  const addClient = (client) => {
    const newClient = { ...client, id: Date.now() };
    setClients([...clients, newClient]);
    return newClient;
  };

  const updateClient = (id, updates) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
  };

  const deleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Router CRUD operations
  const addRouter = (router) => {
    const newRouter = { ...router, id: Date.now() };
    setRouters([...routers, newRouter]);
    return newRouter;
  };

  const updateRouter = (id, updates) => {
    setRouters(routers.map(router => 
      router.id === id ? { ...router, ...updates } : router
    ));
  };

  const deleteRouter = (id) => {
    setRouters(routers.filter(router => router.id !== id));
  };

  // Activity log operations
  const addActivity = (activity) => {
    const newActivity = { ...activity, id: Date.now(), timestamp: new Date().toLocaleString() };
    setActivities([newActivity, ...activities]);
    return newActivity;
  };

  // Context value
  const value = {
    tickets,
    clients,
    technicians,
    routers,
    activities,
    analytics,
    addTicket,
    updateTicket,
    deleteTicket,
    addClient,
    updateClient,
    deleteClient,
    addRouter,
    updateRouter,
    deleteRouter,
    addActivity
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};