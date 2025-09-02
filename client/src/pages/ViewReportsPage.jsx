import React from 'react';
import './ViewReportsPage.css';

function ViewReportsPage() {
  const handleDownloadCSV = async () => {
    try {
      // Create a direct download link instead of redirecting
      const link = document.createElement('a');
      link.href = '/api/download-csv';
      link.download = 'reports.csv';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      // Fallback: open in new tab if direct download fails
      window.open('/api/download-csv', '_blank');
    }
  };

  return (
    <div className="view-reports-container">
      <div className="card">
        <h3>Reports</h3>
        <p>Download a CSV report of all map items.</p>
        <button 
          className="btn primary" 
          onClick={handleDownloadCSV}
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}

export default ViewReportsPage;
