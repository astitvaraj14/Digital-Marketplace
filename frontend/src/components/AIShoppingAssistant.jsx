
import React, { useState } from 'react';

import {
  X,
  Send,
  Bot
} from 'lucide-react';

import api from '../api/axios';

const AIShoppingAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am SmartCart AI. Looking for product recommendations or specs comparison today?'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  // Send message to AI assistant
  const sendMessage = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMsg = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userMsg
      }
    ]);

    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMsg
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: response.data.reply
        }
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Unable to reach AI assistant right now.'
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '380px',
        backgroundColor: '#FFFFFF',
        boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1100
      }}
    >
      {/* Assistant Header */}
      <div
        style={{
          padding: '16px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
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
          <Bot
            size={18}
            style={{ color: '#38BDF8' }}
          />

          <span style={{ fontWeight: 'bold' }}>
            SmartCart AI Assistant
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf:
                m.sender === 'user'
                  ? 'flex-end'
                  : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <div
              style={{
                backgroundColor:
                  m.sender === 'user'
                    ? '#38BDF8'
                    : '#F1F5F9',
                color:
                  m.sender === 'user'
                    ? '#0F172A'
                    : '#334155',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '12px'
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              fontSize: '11px',
              color: '#94A3B8'
            }}
          >
            AI is formulating a response...
          </div>
        )}
      </div>

      {/* Message Input */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input
          type="text"
          placeholder="Ask about products..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && sendMessage()
          }
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '12px'
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default AIShoppingAssistant;
