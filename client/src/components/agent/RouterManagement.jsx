import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Badge, Row, Col, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function RouterManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  // Mock router data
  const [routers, setRouters] = useState([
    { id: 1, model: 'TP-Link Archer C7', serial: 'SN-001', status: 'Active', location: 'Client A', lastSeen: '2025-08-08 10:15:00' },
    { id: 2, model: 'Netgear Nighthawk R7000', serial: 'SN-002', status: 'Offline', location: 'Client B', lastSeen: '2025-08-07 14:30:00' },
    { id: 3, model: 'Asus RT-AC86U', serial: 'SN-003', status: 'Recovery Needed', location: 'Client C', lastSeen: '2025-08-06 09:45:00' },
  ]);
  
  const [newRouter, setNewRouter] = useState({
    model: '',
    serial: '',
    location: ''
  });

  const [editingRouter, setEditingRouter] = useState(null);
  const [editFormData, setEditFormData] = useState({
    model: '',
    serial: '',
    location: ''
  });

  // Initialize edit form with router data
  useEffect(() => {
    if (editingRouter) {
      const router = routers.find(r => r.id === editingRouter);
      if (router) {
        setEditFormData({
          model: router.model,
          serial: router.serial,
          location: router.location
        });
      }
    }
  }, [editingRouter, routers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRouter(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRouter = () => {
    if (newRouter.model && newRouter.serial) {
      setRouters(prev => [
        ...prev, 
        { 
          ...newRouter, 
          id: Date.now(),
          status: 'Active',
          lastSeen: new Date().toLocaleString()
        }
      ]);
      setNewRouter({ model: '', serial: '', location: '' });
    }
  };

  const handleRecoverRouter = (id) => {
    setRouters(prev => prev.map(router => 
      router.id === id ? { ...router, status: 'Recovery Pending' } : router
    ));
  };

  const handleUpdateRouter = () => {
    if (editingRouter) {
      setRouters(prev => prev.map(router => 
        router.id === editingRouter ? { ...router, ...editFormData } : router
      ));
      setEditingRouter(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingRouter(null);
  };

  const filteredRouters = routers.filter(router => {
    const searchLower = searchTerm.toLowerCase();
    return (
      router.model.toLowerCase().includes(searchLower) ||
      router.serial.toLowerCase().includes(searchLower) ||
      router.location.toLowerCase().includes(searchLower) ||
      router.status.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <Badge bg="success">Active</Badge>;
      case 'Offline': return <Badge bg="warning">Offline</Badge>;
      case 'Recovery Needed': return <Badge bg="danger">Recovery Needed</Badge>;
      case 'Recovery Pending': return <Badge bg="info">Recovery Pending</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Router Management</Card.Title>
        
        <Form className="mb-3">
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Model</Form.Label>
                <Form.Control 
                  type="text"
                  name="model"
                  value={newRouter.model}
                  onChange={handleInputChange}
                  placeholder="Router model"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Serial Number</Form.Label>
                <Form.Control 
                  type="text"
                  name="serial"
                  value={newRouter.serial}
                  onChange={handleInputChange}
                  placeholder="Serial number"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control 
                  type="text"
                  name="location"
                  value={newRouter.location}
                  onChange={handleInputChange}
                  placeholder="Installation location"
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleAddRouter}>
                Add Router
              </Button>
            </Col>
          </Row>
        </Form>
        
        <div className="d-flex align-items-center mb-3">
          <div className="position-relative flex-grow-1">
            <FaSearch className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
            <FormControl
              type="search"
              placeholder="Search routers by model, serial, location, or status..."
              className="ps-5"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Model</th>
              <th>Serial</th>
              <th>Status</th>
              <th>Location</th>
              <th>Last Seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRouters.map(router => (
              <tr key={router.id}>
                <td>
                  {editingRouter === router.id ? (
                    <Form.Control
                      type="text"
                      name="model"
                      value={editFormData.model}
                      onChange={handleEditInputChange}
                    />
                  ) : router.model}
                </td>
                <td>
                  {editingRouter === router.id ? (
                    <Form.Control
                      type="text"
                      name="serial"
                      value={editFormData.serial}
                      onChange={handleEditInputChange}
                    />
                  ) : router.serial}
                </td>
                <td>{getStatusBadge(router.status)}</td>
                <td>
                  {editingRouter === router.id ? (
                    <Form.Control
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                    />
                  ) : router.location}
                </td>
                <td>{router.lastSeen}</td>
                <td>
                  {editingRouter === router.id ? (
                    <div>
                      <Button variant="success" size="sm" onClick={handleUpdateRouter} className="me-1">
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button 
                        variant="info" 
                        size="sm"
                        onClick={() => setEditingRouter(router.id)}
                        className="me-1"
                      >
                        Edit
                      </Button>
                      {router.status === 'Recovery Needed' && (
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleRecoverRouter(router.id)}
                        >
                          Recover
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredRouters.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No routers found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

export default RouterManagement;