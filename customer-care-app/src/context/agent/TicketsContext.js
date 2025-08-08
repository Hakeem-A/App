import React, { createContext, useState, useContext } from 'react';

const TicketsContext = createContext();

export function useTickets() {
  return useContext(TicketsContext);
}

export function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState([]);

  const addTicket = (ticket) => {
    setTickets(prev => [...prev, ticket]);
  };

  const updateTicket = (id, updatedTicket) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
    ));
  };

  const deleteTicket = (id) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const value = {
    tickets,
    addTicket,
    updateTicket,
    deleteTicket
  };

  return (
    <TicketsContext.Provider value={value}>
      {children}
    </TicketsContext.Provider>
  );
}