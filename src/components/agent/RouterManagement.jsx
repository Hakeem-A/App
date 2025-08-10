@@ .. @@
 import React, { useState, useEffect } from 'react';
-import { Card, Button, Table, Form, Badge, Row, Col } from 'react-bootstrap';
+import { Card, Button, Table, Form, Badge, Row, Col, FormControl } from 'react-bootstrap';
+import { FaSearch } from 'react-icons/fa';

 function RouterManagement() {
+  const [searchTerm, setSearchTerm] = useState('');
   // Mock router data
   const [routers, setRouters] = useState([
     { id: 1, model: 'TP-Link Archer C7', serial: 'SN-001', status: 'Active', location: 'Client A', lastSeen: '2025-08-08 10:15:00' },
@@ .. @@
     setEditingRouter(null);
   };

+  const filteredRouters = routers.filter(router => {
+    const searchLower = searchTerm.toLowerCase();
+    return (
+      router.model.toLowerCase().includes(searchLower) ||
+      router.serial.toLowerCase().includes(searchLower) ||
+      router.location.toLowerCase().includes(searchLower) ||
+      router.status.toLowerCase().includes(searchLower)
+    );
+  });
+
   const getStatusBadge = (status) => {
     switch(status) {
       case 'Active': return <Badge bg="success">Active</Badge>;
@@ .. @@
           </Row>
         </Form>
         
+        <div className="d-flex align-items-center mb-3">
+          <div className="position-relative flex-grow-1">
+            <FaSearch className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
+            <FormControl
+              type="search"
+              placeholder="Search routers by model, serial, location, or status..."
+              className="ps-5"
+              value={searchTerm}
+              onChange={e => setSearchTerm(e.target.value)}
+            />
+          </div>
+        </div>
+        
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
-            {routers.map(router => (
+            {filteredRouters.map(router => (
               <tr key={router.id}>
                 <td>
                   {editingRouter === router.id ? (
@@ .. @@
                 </td>
               </tr>
             ))}
+            {filteredRouters.length === 0 && (
+              <tr>
+                <td colSpan="6" className="text-center text-muted">
+                  No routers found matching your search criteria
+                </td>
+              </tr>
+            )}
           </tbody>
         </Table>
       </Card.Body>
     </Card>
   );
 }

 export default RouterManagement;