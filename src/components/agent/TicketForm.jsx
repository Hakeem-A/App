@@ .. @@
   const handleSubmit = (e) => {
     e.preventDefault();
-    addTicket(formData);
+    const ticketData = {
+      ...formData,
+      id: ticket ? ticket.id : Date.now(),
+      createdAt: ticket ? ticket.createdAt : new Date().toISOString(),
+      assignedTech: 'Unassigned',
+      clientName: `Client ${formData.clientId}`
+    };
+    addTicket(ticketData);
     handleClose();
   };