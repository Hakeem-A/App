@@ .. @@
 // Generate mock tickets
 export const generateTickets = (count) => {
   const statuses = ['pending', 'in-progress', 'completed'];
   const priorities = ['low', 'medium', 'high', 'critical'];
+  const techNames = ['Tech A', 'Tech B', 'Tech C', 'Tech D', 'Tech E'];
+  const assignedByNames = ['Admin User', 'Agent Smith', 'Agent Johnson', 'Manager Davis'];
   
   // Assign some tickets to a fixed technician id to simulate "Current Tech"
   const currentTechId = 1; // Assuming technician with id 1 is the current tech
   
   return Array.from({ length: count }, (_, i) => ({
     id: i + 1,
     title: `Ticket ${i + 1}: ${['Network Issue', 'Hardware Failure', 'Software Problem', 'Configuration'][i % 4]}`,
     description: `Description for ticket #${i + 1}. This ticket involves resolving ${['connectivity', 'performance', 'security', 'update'][i % 4]} issues.`,
     clientId: getRandomInt(1, 150),
+    clientName: `Client ${getRandomInt(1, 150)}`,
     assignedTech: i % 5 === 0 ? currentTechId : getRandomInt(2, 30), // Assign every 5th ticket to current tech
+    assignedTo: techNames[i % techNames.length],
+    assignedBy: assignedByNames[i % assignedByNames.length],
     status: statuses[i % statuses.length],
     priority: priorities[i % priorities.length],
     createdAt: randomDate(),
+    dateAssigned: new Date(Date.now() - getRandomInt(0, 7) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
+    timeAssigned: `${getRandomInt(8, 17)}:${getRandomInt(0, 59).toString().padStart(2, '0')}`,
+    timeCompleted: Math.random() > 0.6 ? `${getRandomInt(8, 17)}:${getRandomInt(0, 59).toString().padStart(2, '0')}` : null,
     timeSpent: getRandomInt(15, 240)
   }));
 };