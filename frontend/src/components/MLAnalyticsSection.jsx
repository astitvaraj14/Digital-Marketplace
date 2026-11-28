
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Monthly sales and revenue forecast data
const salesData = [
  { month: 'Jan', revenue: 4000, forecast: 4100 },
  { month: 'Feb', revenue: 3000, forecast: 3200 },
  { month: 'Mar', revenue: 5000, forecast: 4800 },
  { month: 'Apr', revenue: 8000, forecast: 7800 },
  { month: 'May', revenue: 9500, forecast: 9900 },
];

// Customer segmentation data
const customerSegments = [
  { name: 'High-Value Loyal', value: 400, color: '#0F172A' },
  { name: 'Occasional Buyers', value: 300, color: '#38BDF8' },
  { name: 'At Risk', value: 100, color: '#94A3B8' },
];

const MLAnalyticsSection = ({ role }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '20px',
      }}
    >
      {/* Demand and Revenue Forecast Chart */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
        }}
      >
        <h3 style={{ fontSize: '13px', marginBottom: '16px' }}>
          Demand & Revenue Forecast (ML Model)
        </h3>

        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />

              <XAxis
                dataKey="month"
                style={{ fontSize: '10px' }}
              />

              <YAxis style={{ fontSize: '10px' }} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0F172A"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#38BDF8"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RFM Customer Segmentation Chart */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
        }}
      >
        <h3 style={{ fontSize: '13px', marginBottom: '16px' }}>
          RFM Customer Segmentation
        </h3>

        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerSegments}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {customerSegments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MLAnalyticsSection;
