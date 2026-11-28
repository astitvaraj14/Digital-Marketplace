
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CompareModal from '../components/CompareModal';
import RecommendedProducts from '../components/RecommendedProducts';

const Catalog = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch products from API
  useEffect(() => {
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, []);

  // Add or remove products from comparison list
  const toggleCompare = (product) => {
    setCompareList((prevList) => {
      const exists = prevList.some(
        (p) => p.id === product.id
      );

      if (exists) {
        return prevList.filter(
          (p) => p.id !== product.id
        );
      }

      if (prevList.length < 3) {
        return [...prevList, product];
      }

      return prevList;
    });
  };

  // Filter products based on search
  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <RecommendedProducts />

      {/* Search and Compare Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '24px 0 16px'
        }}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            width: '300px'
          }}
        />

        {compareList.length > 0 && (
          <button
            onClick={() => setShowCompare(true)}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Compare ({compareList.length})
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px'
        }}
      >
        {filtered.map((product) => {
          const isCompared = compareList.some(
            (p) => p.id === product.id
          );

          return (
            <div
              key={product.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <img
                  src={
                    product.image_url ||
                    'https://via.placeholder.com/150'
                  }
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'contain'
                  }}
                />

                <h3
                  style={{
                    fontSize: '14px',
                    margin: '12px 0 4px'
                  }}
                >
                  {product.title}
                </h3>

                <p
                  style={{
                    fontWeight: 'bold',
                    color: '#0F172A',
                    margin: '0 0 12px'
                  }}
                >
                  ${Number(product.price ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <button
                  onClick={() => onAddToCart(product)}
                  style={{
                    width: '100%',
                    backgroundColor: '#38BDF8',
                    border: 'none',
                    color: '#0F172A',
                    padding: '8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '6px'
                  }}
                >
                  Add to Cart
                </button>

                <label
                  style={{
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isCompared}
                    onChange={() => toggleCompare(product)}
                  />
                  Compare
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showCompare && (
        <CompareModal
          products={compareList}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
};

export default Catalog;
