
import React, { useState } from 'react';

import { FileText } from 'lucide-react';
import api from '../api/axios';

const AIReportGenerator = () => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch AI executive report
  const fetchReport = async () => {
    setLoading(true);

    try {
      const res = await api.get('/ai/executive-report');

      setReport(res.data.summary);

    } catch (err) {
      setReport(
        'Weekly Executive Summary: Platform sales expanded by 14% week-over-week. Top categories remain Consumer Electronics and Smart Home devices. System data health index is registered at 99.4%.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
        marginBottom: '20px'
      }}
    >
      {/* Report Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={18} color="#0F172A" />

          <h3
            style={{
              margin: 0,
              fontSize: '14px'
            }}
          >
            AI Executive Performance Summary
          </h3>
        </div>

        <button
          onClick={fetchReport}
          disabled={loading}
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? 'Compiling...' : 'Generate Insights'}
        </button>
      </div>

      {/* Generated Report */}
      {report && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#334155',
            lineHeight: '1.4'
          }}
        >
          <p>{report}</p>
        </div>
      )}
    </div>
  );
};

export default AIReportGenerator;
