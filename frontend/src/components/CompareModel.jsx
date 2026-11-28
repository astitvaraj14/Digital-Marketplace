
import React from 'react';
import { X } from 'lucide-react';

const CompareModal = ({ products = [], onClose }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '85vh',
          borderRadius: '8px',
          padding: '24px',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px' }}>
            Product Comparison
          </h2>

          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: '12px',
                  borderBottom: '2px solid #E2E8F0',
                  width: '20%'
                }}
              >
                Feature
              </th>

              {products.map((p) => (
                <th
                  key={p.id}
                  style={{
                    padding: '12px',
                    borderBottom: '2px solid #E2E8F0',
                    width: `${80 / products.length}%`
                  }}
                >
                  {p.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price */}
            <tr>
              <td style={cellLabelStyle}>Price</td>

              {products.map((p) => (
                <td key={p.id} style={cellStyle}>
                  ${Number(p.price ?? 0).toFixed(2)}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td style={cellLabelStyle}>Rating</td>

              {products.map((p) => (
                <td key={p.id} style={cellStyle}>
                  {p.rating} / 5.0
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr>
              <td style={cellLabelStyle}>Category</td>

              {products.map((p) => (
                <td key={p.id} style={cellStyle}>
                  {p.category}
                </td>
              ))}
            </tr>

            {/* AI Verdict */}
            <tr>
              <td style={cellLabelStyle}>AI Verdict</td>

              {products.map((p) => (
                <td
                  key={p.id}
                  style={{
                    ...cellStyle,
                    fontSize: '11px',
                    color: '#475569'
                  }}
                >
                  {p.ai_summary ||
                    'Best value choice for standard daily usage.'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellLabelStyle = {
  padding: '12px',
  fontWeight: 'bold',
  borderBottom: '1px solid #F1F5F9'
};

const cellStyle = {
  padding: '12px',
  borderBottom: '1px solid #F1F5F9'
};

export default CompareModal;
