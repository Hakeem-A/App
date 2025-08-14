import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export { DataContext };

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
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

      const mockMetrics = {
        totalTickets: 15,
        openTickets: 5,
        resolvedTickets: 10
      };

      setUsers(mockUsers);
      setTickets(mockTickets);
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <DataContext.Provider value={{
      users,
      tickets,
      metrics,
      loading,
      error,
      getData,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
};
