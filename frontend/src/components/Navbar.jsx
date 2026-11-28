
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  ShoppingCart,
  Bot,
  LayoutDashboard,
  LogOut,
  User
} from 'lucide-react';

const Navbar = ({ onToggleAssistant, cartCount = 0 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {/* Left Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textDecoration: 'none'
          }}
        >
          SmartCart <span style={{ color: '#38BDF8' }}>AI</span>
        </Link>

        <Link
          to="/catalog"
          style={{
            color: '#CBD5E1',
            textDecoration: 'none'
          }}
        >
          Catalog
        </Link>

        {user?.role === 'seller' && (
          <Link
            to="/seller/dashboard"
            style={{
              color: '#CBD5E1',
              textDecoration: 'none'
            }}
          >
            Seller Hub
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            to="/admin/dashboard"
            style={{
              color: '#CBD5E1',
              textDecoration: 'none'
            }}
          >
            Admin Console
          </Link>
        )}
      </div>

      {/* Right Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <button
          onClick={onToggleAssistant}
          style={{
            backgroundColor: '#1E293B',
            border: '1px solid #38BDF8',
            color: '#38BDF8',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Bot size={16} />
          Ask AI
        </button>

        <Link
          to="/cart"
          style={{
            color: '#FFFFFF',
            position: 'relative',
            textDecoration: 'none'
          }}
        >
          <ShoppingCart size={20} />

          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#38BDF8',
                color: '#0F172A',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                padding: '2px 6px'
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <User size={12} />
              {user.name} ({user.role})
            </span>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              backgroundColor: '#38BDF8',
              color: '#0F172A',
              padding: '6px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
