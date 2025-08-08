import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CustomNavbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 px-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          Customer Care System
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {userRole && (
              <Nav.Link as={Link} to={`/${userRole}/dashboard`} className="mx-2">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} 
              </Nav.Link>
            )}
            {userRole && (
              <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;