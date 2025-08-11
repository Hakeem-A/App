@@ .. @@
 import React, { useState } from 'react';
-import { Button, Form, Table } from 'react-bootstrap';
+import { Button, Form, Table, Card, Badge, Modal, Alert } from 'react-bootstrap';
+import { FaCalendarAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
 
 function LeaveManagement() {
   const [leaveDays, setLeaveDays] = useState([
-    { id: 1, date: '2025-08-15', reason: 'Medical appointment', status: 'approved' },
-    { id: 2, date: '2025-08-22', reason: 'Family event', status: 'pending' }
+    { 
+      id: 1, 
+      startDate: '2025-08-15', 
+      endDate: '2025-08-15',
+      reason: 'Medical appointment', 
+      status: 'approved',
+      type: 'sick',
+      requestDate: '2025-08-10'
+    },
+    { 
+      id: 2, 
+      startDate: '2025-08-22', 
+      endDate: '2025-08-24',
+      reason: 'Family event', 
+      status: 'pending',
+      type: 'personal',
+      requestDate: '2025-08-18'
+    },
+    { 
+      id: 3, 
+      startDate: '2025-09-01', 
+      endDate: '2025-09-05',
+      reason: 'Annual vacation', 
+      status: 'approved',
+      type: 'vacation',
+      requestDate: '2025-07-15'
+    }
   ]);
   
   const [newLeave, setNewLeave] = useState({
-    date: '',
+    startDate: '',
+    endDate: '',
     reason: '',
-    status: 'pending'
+    status: 'pending',
+    type: 'personal'
   });
 
+  const [showModal, setShowModal] = useState(false);
+  const [editingLeave, setEditingLeave] = useState(null);
+  const [alert, setAlert] = useState(null);
+
+  const showAlert = (message, variant = 'success') => {
+    setAlert({ message, variant });
+    setTimeout(() => setAlert(null), 3000);
+  };
+
   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setNewLeave(prev => ({ ...prev, [name]: value }));
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
-    if (newLeave.date && newLeave.reason) {
-      setLeaveDays(prev => [
-        ...prev, 
-        { ...newLeave, id: Date.now() }
-      ]);
-      setNewLeave({ date: '', reason: '', status: 'pending' });
+    if (newLeave.startDate && newLeave.endDate && newLeave.reason) {
+      if (editingLeave) {
+        setLeaveDays(prev => prev.map(leave => 
+          leave.id === editingLeave.id 
+            ? { ...newLeave, id: editingLeave.id, requestDate: editingLeave.requestDate }
+            : leave
+        ));
+        showAlert('Leave request updated successfully!');
+      } else {
+        setLeaveDays(prev => [
+          ...prev, 
+          { 
+            ...newLeave, 
+            id: Date.now(),
+            requestDate: new Date().toISOString().slice(0, 10)
+          }
+        ]);
+        showAlert('Leave request submitted successfully!');
+      }
+      handleCloseModal();
     }
   };
 
+  const handleEdit = (leave) => {
+    setEditingLeave(leave);
+    setNewLeave({
+      startDate: leave.startDate,
+      endDate: leave.endDate,
+      reason: leave.reason,
+      type: leave.type,
+      status: leave.status
+    });
+    setShowModal(true);
+  };
+
+  const handleDelete = (id) => {
+    if (window.confirm('Are you sure you want to delete this leave request?')) {
+      setLeaveDays(prev => prev.filter(leave => leave.id !== id));
+      showAlert('Leave request deleted successfully!', 'info');
+    }
+  };
+
+  const handleCloseModal = () => {
+    setShowModal(false);
+    setEditingLeave(null);
+    setNewLeave({
+      startDate: '',
+      endDate: '',
+      reason: '',
+      status: 'pending',
+      type: 'personal'
+    });
+  };
+
+  const getStatusBadge = (status) => {
+    switch(status) {
+      case 'approved': return <Badge bg="success">Approved</Badge>;
+      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
+      case 'pending': return <Badge bg="warning">Pending</Badge>;
+      default: return <Badge bg="secondary">Unknown</Badge>;
+    }
+  };
+
+  const getTypeBadge = (type) => {
+    switch(type) {
+      case 'vacation': return <Badge bg="primary">Vacation</Badge>;
+      case 'sick': return <Badge bg="info">Sick Leave</Badge>;
+      case 'personal': return <Badge bg="secondary">Personal</Badge>;
+      case 'emergency': return <Badge bg="danger">Emergency</Badge>;
+      default: return <Badge bg="light" text="dark">Other</Badge>;
+    }
+  };
+
+  const calculateDays = (startDate, endDate) => {
+    const start = new Date(startDate);
+    const end = new Date(endDate);
+    const diffTime = Math.abs(end - start);
+    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
+    return diffDays;
+  };
+
+  // Calculate leave statistics
+  const totalRequests = leaveDays.length;
+  const approvedRequests = leaveDays.filter(leave => leave.status === 'approved').length;
+  const pendingRequests = leaveDays.filter(leave => leave.status === 'pending').length;
+  const totalDaysRequested = leaveDays.reduce((total, leave) => 
+    total + calculateDays(leave.startDate, leave.endDate), 0
+  );
+
   return (
-    <div className="mt-4">
-      <h4>Leave Management</h4>
-      
-      <Form onSubmit={handleSubmit}>
-        <Form.Group className="mb-3">
-          <Form.Label>Date</Form.Label>
-          <Form.Control 
-            type="date" 
-            name="date"
-            value={newLeave.date}
-            onChange={handleInputChange}
-            required
-          />
-        </Form.Group>
-        
-        <Form.Group className="mb-3">
-          <Form.Label>Reason</Form.Label>
-          <Form.Control 
-            as="textarea" 
-            rows={2}
-            name="reason"
-            value={newLeave.reason}
-            onChange={handleInputChange}
-            required
-          />
-        </Form.Group>
-        
-        <Button variant="primary" type="submit">
-          Request Leave
-        </Button>
-      </Form>
-      
-      <Table striped bordered className="mt-4">
-        <thead>
-          <tr>
-            <th>Date</th>
-            <th>Reason</th>
-            <th>Status</th>
-          </tr>
-        </thead>
-        <tbody>
-          {leaveDays.map(leave => (
-            <tr key={leave.id}>
-              <td>{leave.date}</td>
-              <td>{leave.reason}</td>
-              <td>
-                <span className={`badge bg-${
-                  leave.status === 'approved' ? 'success' : 
-                  leave.status === 'rejected' ? 'danger' : 'warning'
-                }`}>
-                  {leave.status}
-                </span>
-              </td>
-            </tr>
-          ))}
-        </tbody>
-      </Table>
+    <Card className="mt-4">
+      <Card.Header>
+        <div className="d-flex justify-content-between align-items-center">
+          <h5 className="mb-0">
+            <FaCalendarAlt className="me-2" />
+            Leave Management
+          </h5>
+          <Button variant="primary" onClick={() => setShowModal(true)}>
+            <FaPlus className="me-2" />
+            Request Leave
+          </Button>
+        </div>
+      </Card.Header>
+      <Card.Body>
+        {alert && (
+          <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
+            {alert.message}
+          </Alert>
+        )}
+
+        {/* Leave Statistics */}
+        <div className="row mb-4">
+          <div className="col-md-3">
+            <div className="text-center p-3 bg-light rounded">
+              <h6>Total Requests</h6>
+              <h4>{totalRequests}</h4>
+            </div>
+          </div>
+          <div className="col-md-3">
+            <div className="text-center p-3 bg-success bg-opacity-10 rounded">
+              <h6>Approved</h6>
+              <h4>{approvedRequests}</h4>
+            </div>
+          </div>
+          <div className="col-md-3">
+            <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
+              <h6>Pending</h6>
+              <h4>{pendingRequests}</h4>
+            </div>
+          </div>
+          <div className="col-md-3">
+            <div className="text-center p-3 bg-info bg-opacity-10 rounded">
+              <h6>Total Days</h6>
+              <h4>{totalDaysRequested}</h4>
+            </div>
+          </div>
+        </div>
+        
+        <Table striped bordered hover responsive>
+          <thead>
+            <tr>
+              <th>Type</th>
+              <th>Start Date</th>
+              <th>End Date</th>
+              <th>Days</th>
+              <th>Reason</th>
+              <th>Status</th>
+              <th>Request Date</th>
+              <th>Actions</th>
+            </tr>
+          </thead>
+          <tbody>
+            {leaveDays.map(leave => (
+              <tr key={leave.id}>
+                <td>{getTypeBadge(leave.type)}</td>
+                <td>{leave.startDate}</td>
+                <td>{leave.endDate}</td>
+                <td>{calculateDays(leave.startDate, leave.endDate)}</td>
+                <td>{leave.reason}</td>
+                <td>{getStatusBadge(leave.status)}</td>
+                <td>{leave.requestDate}</td>
+                <td>
+                  {leave.status === 'pending' && (
+                    <>
+                      <Button
+                        variant="outline-primary"
+                        size="sm"
+                        onClick={() => handleEdit(leave)}
+                        className="me-2"
+                        title="Edit Request"
+                      >
+                        <FaEdit />
+                      </Button>
+                      <Button
+                        variant="outline-danger"
+                        size="sm"
+                        onClick={() => handleDelete(leave.id)}
+                        title="Delete Request"
+                      >
+                        <FaTrash />
+                      </Button>
+                    </>
+                  )}
+                  {leave.status !== 'pending' && (
+                    <span className="text-muted">No actions available</span>
+                  )}
+                </td>
+              </tr>
+            ))}
+            {leaveDays.length === 0 && (
+              <tr>
+                <td colSpan="8" className="text-center text-muted">
+                  No leave requests found
+                </td>
+              </tr>
+            )}
+          </tbody>
+        </Table>
+
+        {/* Leave Request Modal */}
+        <Modal show={showModal} onHide={handleCloseModal}>
+          <Modal.Header closeButton>
+            <Modal.Title>
+              {editingLeave ? 'Edit Leave Request' : 'New Leave Request'}
+            </Modal.Title>
+          </Modal.Header>
+          <Form onSubmit={handleSubmit}>
+            <Modal.Body>
+              <Form.Group className="mb-3">
+                <Form.Label>Leave Type</Form.Label>
+                <Form.Select
+                  name="type"
+                  value={newLeave.type}
+                  onChange={handleInputChange}
+                  required
+                >
+                  <option value="personal">Personal</option>
+                  <option value="vacation">Vacation</option>
+                  <option value="sick">Sick Leave</option>
+                  <option value="emergency">Emergency</option>
+                </Form.Select>
+              </Form.Group>
+              
+              <div className="row">
+                <div className="col-md-6">
+                  <Form.Group className="mb-3">
+                    <Form.Label>Start Date</Form.Label>
+                    <Form.Control 
+                      type="date" 
+                      name="startDate"
+                      value={newLeave.startDate}
+                      onChange={handleInputChange}
+                      required
+                    />
+                  </Form.Group>
+                </div>
+                <div className="col-md-6">
+                  <Form.Group className="mb-3">
+                    <Form.Label>End Date</Form.Label>
+                    <Form.Control 
+                      type="date" 
+                      name="endDate"
+                      value={newLeave.endDate}
+                      onChange={handleInputChange}
+                      min={newLeave.startDate}
+                      required
+                    />
+                  </Form.Group>
+                </div>
+              </div>
+              
+              <Form.Group className="mb-3">
+                <Form.Label>Reason</Form.Label>
+                <Form.Control 
+                  as="textarea" 
+                  rows={3}
+                  name="reason"
+                  value={newLeave.reason}
+                  onChange={handleInputChange}
+                  placeholder="Please provide a reason for your leave request..."
+                  required
+                />
+              </Form.Group>
+
+              {newLeave.startDate && newLeave.endDate && (
+                <div className="alert alert-info">
+                  <strong>Duration:</strong> {calculateDays(newLeave.startDate, newLeave.endDate)} day(s)
+                </div>
+              )}
+            </Modal.Body>
+            <Modal.Footer>
+              <Button variant="secondary" onClick={handleCloseModal}>
+                Cancel
+              </Button>
+              <Button variant="primary" type="submit">
+                {editingLeave ? 'Update Request' : 'Submit Request'}
+              </Button>
+            </Modal.Footer>
+          </Form>
+        </Modal>
+      </Card.Body>
+    </Card>
   );
 }
 
 export default LeaveManagement;