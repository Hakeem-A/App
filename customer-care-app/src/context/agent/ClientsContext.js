import React, { createContext, useState, useEffect, useContext } from 'react';

const ClientsContext = createContext();

export function useClients() {
  return useContext(ClientsContext);
}

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : [];
  });

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const addClient = (client) => {
    setClients(prev => [...prev, { ...client, id: Date.now() }]);
  };

  const updateClient = (id, updatedClient) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updatedClient } : client
    ));
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const value = {
    clients,
    addClient,
    updateClient,
    deleteClient
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}