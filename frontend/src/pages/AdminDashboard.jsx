
import React from 'react';

import ETLDashboard from '../components/ETLDashboard';
import AIReportGenerator from '../components/AIReportGenerator';
import MLAnalyticsSection from '../components/MLAnalyticsSection';

const AdminDashboard = () => {
  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* Dashboard Heading */}
      <h1>Platform Administration</h1>

      {/* ETL Dashboard */}
      <div style={{ margin: '24px 0' }}>
        <ETLDashboard />
      </div>

      {/* ML Analytics Section */}
      <div style={{ margin: '24px 0' }}>
        <MLAnalyticsSection role="admin" />
      </div>

      {/* AI Report Generator */}
      <div style={{ margin: '24px 0' }}>
        <AIReportGenerator />
      </div>
    </div>
  );
};

export default AdminDashboard;
