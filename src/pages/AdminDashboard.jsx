@@ .. @@
 import TicketAnalytics from '../components/admin/TicketAnalytics';
 import ActivityLog from '../components/admin/ActivityLog';
+import ActivityMonitor from '../components/admin/ActivityMonitor';
+import EmployeePerformance from '../components/admin/EmployeePerformance';
 import TicketList from '../components/admin/TicketList.jsx';
 import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
+import { Tabs, Tab } from 'react-bootstrap';
 
 function AdminDashboard() {
@@ .. @@
       </Row>
       
-      <Row className="mb-4">
-        <Col md={12}>
-          <Card className="mb-4">
-            <Card.Header className="d-flex justify-content-between align-items-center">
-              <h5 className="mb-0">Ticket Management</h5>
-              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
-                Create New Ticket
-              </Button>
-            </Card.Header>
-            <Card.Body>
-              <TicketList 
-                tickets={tickets} 
-                searchTerm={searchTerm} 
-                onSearchChange={setSearchTerm}
-                onEdit={handleEditTicket}
-                onDelete={handleDeleteTicket}
-              />
-            </Card.Body>
-          </Card>
-        </Col>
-      </Row>
-      
-      <Row className="mb-4">
-        <Col md={8}>
-          <TicketAnalytics />
-        </Col>
-        <Col md={4}>
-          <ActivityLog />
-        </Col>
-      </Row>
+      <Tabs defaultActiveKey="tickets" id="admin-tabs" className="mb-3 custom-tabs">
+        <Tab 
+          eventKey="tickets" 
+          title={
+            <span>
+              <i className="bi bi-ticket-detailed me-1"></i> Ticket Management
+            </span>
+          }
+        >
+          <Card className="mb-4">
+            <Card.Header className="d-flex justify-content-between align-items-center">
+              <h5 className="mb-0">Ticket Management</h5>
+              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
+                Create New Ticket
+              </Button>
+            </Card.Header>
+            <Card.Body>
+              <TicketList 
+                tickets={tickets} 
+                searchTerm={searchTerm} 
+                onSearchChange={setSearchTerm}
+                onEdit={handleEditTicket}
+                onDelete={handleDeleteTicket}
+              />
+            </Card.Body>
+          </Card>
+        </Tab>
+        
+        <Tab 
+          eventKey="analytics" 
+          title={
+            <span>
+              <i className="bi bi-graph-up me-1"></i> Analytics
+            </span>
+          }
+        >
+          <Row className="mb-4">
+            <Col md={8}>
+              <TicketAnalytics />
+            </Col>
+            <Col md={4}>
+              <ActivityLog />
+            </Col>
+          </Row>
+        </Tab>
+        
+        <Tab 
+          eventKey="activity" 
+          title={
+            <span>
+              <i className="bi bi-activity me-1"></i> Activity Monitor
+            </span>
+          }
+        >
+          <ActivityMonitor />
+        </Tab>
+        
+        <Tab 
+          eventKey="performance" 
+          title={
+            <span>
+              <i className="bi bi-people me-1"></i> Employee Performance
+            </span>
+          }
+        >
+          <EmployeePerformance />
+        </Tab>
+      </Tabs>
 
       <CreateTicketModal