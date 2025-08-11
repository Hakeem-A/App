@@ .. @@
 import ClientsTable from '../components/agent/ClientsTable';
 import RouterManagement from '../components/agent/RouterManagement';
+import InstallationManagement from '../components/agent/InstallationManagement';
 import TicketList from '../components/admin/TicketList.jsx';
@@ .. @@
         <Tab 
           eventKey="routers" 
           title={
             <span>
               <i className="bi bi-router me-1"></i> Routers
             </span>
           }
         >
           <RouterManagement />
         </Tab>
+        <Tab 
+          eventKey="installations" 
+          title={
+            <span>
+              <i className="bi bi-tools me-1"></i> Installations
+            </span>
+          }
+        >
+          <InstallationManagement />
+        </Tab>
       </Tabs>