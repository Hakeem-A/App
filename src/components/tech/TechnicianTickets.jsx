@@ .. @@
   const handleAddComment = () => {
     if (selectedTicket && comment.trim()) {
       const newComment = {
         id: Date.now(),
         text: comment,
-        timestamp: new Date().toISOString()
+        timestamp: new Date().toISOString(),
+        author: 'Current Technician'
       };
       
       const updatedComments = [...(selectedTicket.comments || []), newComment];
-      updateTicket(selectedTicket.id, { comments: updatedComments });
+      const updatedTicket = { ...selectedTicket, comments: updatedComments };
+      updateTicket(selectedTicket.id, { comments: updatedComments });
+      setSelectedTicket(updatedTicket);
       setComment('');
     }
   };
@@ .. @@
     if (selectedTicket && timeSpent) {
       const minutes = parseInt(timeSpent, 10);
       if (!isNaN(minutes) && minutes > 0) {
-        updateTicket(selectedTicket.id, { 
+        const newTimeSpent = (selectedTicket.timeSpent || 0) + minutes;
+        updateTicket(selectedTicket.id, { 
-          timeSpent: (selectedTicket.timeSpent || 0) + minutes
+          timeSpent: newTimeSpent
         });
+        setSelectedTicket({ ...selectedTicket, timeSpent: newTimeSpent });
         setTimeSpent('');
       }
     }
   };