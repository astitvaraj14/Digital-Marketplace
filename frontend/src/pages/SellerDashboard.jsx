
import React, { useState } from 'react';

import AIDescriptionModal from '../components/AIDescriptionModal';
import MLAnalyticsSection from '../components/MLAnalyticsSection';

const SellerDashboard = () => {
  const [showGenModal, setShowGenModal] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Smart Noise-Canceling Headphones',
      price: 199.99,
      stock: 45
    },
    {
      id: 2,
      title: 'Ergonomic Mechanical Keyboard',
      price: 129.50,
      stock: 12
    }
  ]);

  // Apply generated AI description
  const handleApplyDescription = (generatedData) => {
    alert('Generated AI Description applied for product!');
    setShowGenModal(false);
  };

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* Dashboard Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <h1>Seller Analytics & Management</h1>

        <button
          onClick={() => setShowGenModal(true)}
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          + Add Product with AI Assistant
        </button>
      </div>

      {/* ML Analytics Section */}
      <MLAnalyticsSection role="seller" />

      {/* Inventory Section */}
      <h2 style={{ marginTop: '32px' }}>
        Inventory Items
      </h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr
            style={{
              background: '#F8FAFC',
              textAlign: 'left'
            }}
          >
            <th style={{ padding: '12px' }}>
              Item Title
            </th>

            <th style={{ padding: '12px' }}>
              Price
            </th>

            <th style={{ padding: '12px' }}>
              Stock
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              style={{
                borderBottom: '1px solid #E2E8F0'
              }}
            >
              <td style={{ padding: '12px' }}>
                {p.title}
              </td>

              <td style={{ padding: '12px' }}>
                ${p.price.toFixed(2)}
              </td>

              <td style={{ padding: '12px' }}>
                {p.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AI Description Modal */}
      {showGenModal && (
        <AIDescriptionModal
          onClose={() => setShowGenModal(false)}
          onSave={handleApplyDescription}
        />
      )}
    </div>
  );
};

export default SellerDashboard;
