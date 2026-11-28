
import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import api from '../api/axios';

const AIDescriptionModal = ({ onClose, onSave }) => {
  const [prompt, setPrompt] = useState('');

  const [result, setResult] = useState({
    title: '',
    description: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);

  // Generate AI product details
  const generateDetails = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await api.post(
        '/ai/generate-description',
        {
          keywords: prompt
        }
      );

      setResult(response.data);

    } catch (err) {
      setResult({
        title: 'Generated Product Title',
        description:
          'Auto-generated detailed copy highlighting quality construction, modern design, and optimized value proposition.',
        tags: 'premium, modern, tech'
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1200
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '8px',
          width: '500px',
          maxWidth: '90%'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <h3
            style={{
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={18} color="#38BDF8" />
            AI Description Generator
          </h3>

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

        {/* Product Keywords */}
        <label
          style={{
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          Product Keywords / Key Features
        </label>

        <input
          type="text"
          placeholder="e.g. wireless earbud, waterproof, 30hr battery"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            margin: '6px 0 16px',
            borderRadius: '4px',
            border: '1px solid #CBD5E1',
            boxSizing: 'border-box'
          }}
        />

        {/* Generate Button */}
        <button
          onClick={generateDetails}
          disabled={loading || !prompt.trim()}
          style={{
            width: '100%',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '8px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          {loading ? 'Generating Content...' : 'Generate Copy'}
        </button>

        {/* Generated Result */}
        {result.title && (
          <div
            style={{
              background: '#F8FAFC',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <strong>Title:</strong>
            <p>{result.title}</p>

            <strong>Description:</strong>
            <p>{result.description}</p>

            <strong>Tags:</strong>
            <p>{result.tags}</p>

            <button
              onClick={() => onSave(result)}
              style={{
                width: '100%',
                backgroundColor: '#38BDF8',
                color: '#0F172A',
                border: 'none',
                padding: '8px',
                marginTop: '12px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Use This Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDescriptionModal;
