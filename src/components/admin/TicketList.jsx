@@ .. @@
 import React from 'react';
-import { Table, FormControl } from 'react-bootstrap';
+import { Table, FormControl, Badge, Button } from 'react-bootstrap';
+import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

-function TicketList({ tickets, searchTerm, onSearchChange }) {
+function TicketList({ tickets, searchTerm, onSearchChange, onEdit, onDelete }) {
   const filteredTickets = tickets.filter(ticket => {
     const searchLower = searchTerm.toLowerCase();
     return (
       ticket.title.toLowerCase().includes(searchLower) ||
       ticket.assignedBy.toLowerCase().includes(searchLower) ||
-      ticket.assignedTo.toLowerCase().includes(searchLower)
+      ticket.assignedTo.toLowerCase().includes(searchLower) ||
+      ticket.dateAssigned.toLowerCase().includes(searchLower)
     );
   });

+  const getStatusBadge = (timeCompleted) => {
+    return timeCompleted ? (
+      <Badge bg="success">Completed</Badge>
+    ) : (
+      <Badge bg="warning">In Progress</Badge>
+    );
+  };
+
   return (
     <>
-      <FormControl
-        type="search"
-        placeholder="Search tickets"
-        className="mb-3"
-        value={searchTerm}
-        onChange={e => onSearchChange(e.target.value)}
-      />
+      <div className="d-flex align-items-center mb-3">
+        <div className="position-relative flex-grow-1">
+          <FaSearch className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
+          <FormControl
+            type="search"
+            placeholder="Search tickets by title, assigned by, assigned to, or date..."
+            className="ps-5"
+            value={searchTerm}
+            onChange={e => onSearchChange(e.target.value)}
+          />
+        </div>
+      </div>
       <Table striped bordered hover responsive>
         <thead>
           <tr>
             <th>Title</th>
             <th>Time Assigned</th>
             <th>Assigned By</th>
             <th>Assigned To</th>
+            <th>Status</th>
             <th>Time Completed</th>
             <th>Date Assigned</th>
+            <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           {filteredTickets.map(ticket => (
             <tr key={ticket.id}>
               <td>{ticket.title}</td>
               <td>{ticket.timeAssigned}</td>
               <td>{ticket.assignedBy}</td>
               <td>{ticket.assignedTo}</td>
+              <td>{getStatusBadge(ticket.timeCompleted)}</td>
               <td>{ticket.timeCompleted || '-'}</td>
               <td>{ticket.dateAssigned}</td>
+              <td>
+                <Button
+                  variant="outline-primary"
+                  size="sm"
+                  onClick={() => onEdit && onEdit(ticket)}
+                  className="me-2"
+                  title="Edit Ticket"
+                >
+                  <FaEdit />
+                </Button>
+                <Button
+                  variant="outline-danger"
+                  size="sm"
+                  onClick={() => onDelete && onDelete(ticket.id)}
+                  title="Delete Ticket"
+                >
+                  <FaTrash />
+                </Button>
+              </td>
             </tr>
           ))}
+          {filteredTickets.length === 0 && (
+            <tr>
+              <td colSpan="8" className="text-center text-muted">
+                No tickets found matching your search criteria
+              </td>
+            </tr>
+          )}
         </tbody>
       </Table>
     </>
   );
 }

 export default TicketList;