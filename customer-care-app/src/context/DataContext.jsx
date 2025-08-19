import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export { DataContext };

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [routers, setRouters] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      // Enhanced mock user data with complete structure
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'admin', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'agent', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'technician', status: 'active' },
        { id: 4, name: 'Sarah Williams', email: 'sarah.williams@company.com', role: 'agent', status: 'inactive' },
        { id: 5, name: 'David Brown', email: 'david.brown@company.com', role: 'technician', status: 'active' }
      ];
      
      const mockTickets = [
        { id: 1, title: 'Technical Issue', status: 'Open' },
        { id: 2, title: 'Software Bug', status: 'In Progress' }
      ];

      const mockClients = [
        { id: 1, name: 'Client A', address: '123 Main St', status: 'active' },
        { id: 2, name: 'Client B', address: '456 Oak Ave', status: 'active' }
      ];

      const mockRouters = [
        { id: 1, model: 'TP-Link AX3000', clientId: 1, status: 'online' },
        { id: 2, model: 'Netgear Nighthawk', clientId: 2, status: 'offline' }
      ];

      const mockMetrics = {
        totalTickets: 15,
        openTickets: 5,
        resolvedTickets: 10
      };

      setUsers(mockUsers);
      setTickets(mockTickets);
      setClients(mockClients);
      setRouters(mockRouters);
      setMetrics(mockMetrics);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Add user function
  const addUser = async (userData) => {
    try {
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
        status: userData.status || 'active'
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user function
  const updateUser = async (userId, userData) => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...userData } : user
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  };

  // Client management functions
  const addClient = async (clientData) => {
    try {
      const newClient = {
        ...clientData,
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        status: clientData.status || 'active'
      };
      setClients(prevClients => [...prevClients, newClient]);
      return { success: true };
    } catch (error) {
      console.error('Error adding client:', error);
      return { success: false, error: error.message };
    }
  };

  const updateClient = async (clientId, clientData) => {
    try {
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId ? { ...client, ...clientData } : client
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating client:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteClient = async (clientId) => {
    try {
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { success: false, error: error.message };
    }
  };

  // Router management functions
  const addRouter = async (routerData) => {
    try {
      const newRouter = {
        ...routerData,
        id: Math.max(...routers.map(r => r.id), 0) + 1,
        status: routerData.status || 'offline'
      };
      setRouters(prevRouters => [...prevRouters, newRouter]);
      return { success: true };
    } catch (error) {
      console.error('Error adding router:', error);
      return { success: false, error: error.message };
    }
  };

  const updateRouter = async (routerId, routerData) => {
    try {
      setRouters(prevRouters => 
        prevRouters.map(router => 
          router.id === routerId ? { ...router, ...routerData } : router
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating router:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteRouter = async (routerId) => {
    try {
      setRouters(prevRouters => prevRouters.filter(router => router.id !== routerId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting router:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <DataContext.Provider value={{
      users,
      tickets,
      clients,
      routers,
      metrics,
      loading,
      error,
      getData,
      addUser,
      updateUser,
      deleteUser,
      addClient,
      updateClient,
      deleteClient,
      addRouter,
      updateRouter,
      deleteRouter
    }}>
      {children}
    </DataContext.Provider>
  );
};
