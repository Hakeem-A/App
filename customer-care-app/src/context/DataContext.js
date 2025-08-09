import React, { createContext, useState } from 'react';
import {
  generateTickets,
  generateClients,
  generateTechnicians,
  generateRouters,
  generateActivities,
  generateAnalytics
} from '../data/mockDataGenerator';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Generate mock data
  const [tickets, setTickets] = useState(generateTickets(150));
  const [clients, setClients] = useState(generateClients(150));
  const [technicians] = useState(generateTechnicians(30));
  const [routers, setRouters] = useState(generateRouters(100));
  const [activities, setActivities] = useState(generateActivities(200));
  const [analytics] = useState(generateAnalytics());

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