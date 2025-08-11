@@ .. @@
   const handleSubmit = (e) => {
     e.preventDefault();
-    addClient(formData);
+    const clientData = {
+      ...formData,
+      id: client ? client.id : Date.now()
+    };
+    addClient(clientData);
     handleClose();
   };