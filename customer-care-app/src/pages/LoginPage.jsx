import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Container } from 'react-bootstrap';

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '24rem' }} className="p-4">
        <Card.Body>
          <Card.Title className="text-center mb-4">Customer Care System</Card.Title>
          <Card.Subtitle className="mb-3 text-muted text-center">Select your role</Card.Subtitle>
          
          <div className="d-grid gap-2 mb-3">
            <Button 
              variant={selectedRole === 'agent' ? 'primary' : 'outline-primary'} 
              onClick={() => setSelectedRole('agent')}
            >
              Customer Care Agent
            </Button>
            <Button 
              variant={selectedRole === 'admin' ? 'primary' : 'outline-primary'} 
              onClick={() => setSelectedRole('admin')}
            >
              Admin
            </Button>
            <Button 
              variant={selectedRole === 'tech' ? 'primary' : 'outline-primary'} 
              onClick={() => setSelectedRole('tech')}
            >
              Technician
            </Button>
          </div>
          
          <Button 
            variant="success" 
            className="w-100"
            onClick={handleLogin}
            disabled={!selectedRole}
          >
            Login
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;