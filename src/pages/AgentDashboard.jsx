@@ .. @@
 function AgentDashboardContent() {
   const [showCreateModal, setShowCreateModal] = useState(false);
-  const [searchTerm, setSearchTerm] = useState('');
+  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
+  const [clientSearchTerm, setClientSearchTerm] = useState('');
   const [editingTicket, setEditingTicket] = useState(null);
   const [showClientModal, setShowClientModal] = useState(false);
   const [editingClient, setEditingClient] = useState(null);

@@ .. @@
         
         <div className="bg-primary p-4 card mb-4">
           <h3>Quick Summary</h3>
-          <p>Tickets: {tickets.length} | Clients: {clients.length} | Routers: {routers.length}</p>
+          <Row>
+            <Col md={3}>
+              <div className="text-center">
+                <h4>{tickets.length}</h4>
+                <small>Total Tickets</small>
+              </div>
+            </Col>
+            <Col md={3}>
+              <div className="text-center">
+                <h4>{tickets.filter(t => t.dateAssigned === new Date().toISOString().slice(0, 10)).length}</h4>
+                <small>Today's Tickets</small>
+              </div>
+            </Col>
+            <Col md={3}>
+              <div className="text-center">
+                <h4>{clients.length}</h4>
+                <small>Total Clients</small>
+              </div>
+            </Col>
+            <Col md={3}>
+              <div className="text-center">
+                <h4>{routers.length}</h4>
+                <small>Total Routers</small>
+              </div>
+            </Col>
+          </Row>
         </div>
       </div>

@@ .. @@
             </span>
           }
         >
-          <TicketList tickets={tickets} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
+          <TicketList 
+            tickets={tickets} 
+            searchTerm={ticketSearchTerm} 
+            onSearchChange={setTicketSearchTerm}
+            onEdit={handleEditTicket}
+            onDelete={deleteTicket}
+          />
         </Tab>
         <Tab 
           eventKey="clients" 
@@ .. @@
           <ClientsTable 
             clients={clients} 
             handleEdit={handleEditClient}
             handleDelete={deleteClient}
+            searchTerm={clientSearchTerm}
+            onSearchChange={setClientSearchTerm}
           />
         </Tab>
         <Tab 
@@ .. @@
       <CreateTicketModal
         show={showCreateModal}
         onClose={handleCloseCreateModal}
         onCreate={handleCreateTicket}
+        ticket={editingTicket}
         technicians={[
           { id: 1, name: 'Tech A' },
           { id: 2, name: 'Tech B' },
           { id: 3, name: 'Tech C' },
+          { id: 4, name: 'Tech D' },
+          { id: 5, name: 'Tech E' },
         ]}
       />
     </div>
   );
 }

 function AgentDashboard() {
   return <AgentDashboardContent />;
 }

 export default AgentDashboard;