
import React, { useEffect, useState } from 'react';

import api from '../api/axios';
import { Sparkles } from 'lucide-react';

const RecommendedProducts = () => {
  const [items, setItems] = useState([]);

  // Fetch AI recommended products
  useEffect(() => {
    api.get('/ml/recommendations')
      .then((res) => {
        setItems(res.data);
      })
      .catch(() => {
        setItems([
          {
            id: 101,
            title: 'AI Noise-Canceling Headphones',
            price: 199.99
          },
          {
            id: 102,
            title: 'Ergonomic Desk Mat',
            price: 29.99
          },
          {
            id: 103,
            title: 'Ultra-Wide Monitor 34"',
            price: 499.99
          }
        ]);
      });
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #F0F9FF 0%, #E0F2FE 100%)',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px'
        }}
      >
        <Sparkles size={16} color="#0284C7" />

        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            color: '#0369A1'
          }}
        >
          Recommended For You
        </h3>
      </div>

      {/* Recommended Products */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto'
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              padding: '12px',
              borderRadius: '6px',
              minWidth: '180px',
              border: '1px solid #BAE6FD'
            }}
          >
            <p
              style={{
                margin: '0 0 4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {item.title}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: '11px',
                color: '#0284C7'
              }}
            >
              $ {Number(item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
