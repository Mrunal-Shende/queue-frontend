import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  // Expanded, full operational log tracker array with variant configurations and unread keys
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Your Turn is Near!', message: 'Token A-023 will be served soon. Please step near Counter 2 immediately.', time: 'Just Now', type: 'urgent', read: false },
    { id: 2, title: 'Token Confirmed', message: 'Your token number A-023 has been successfully generated for Max Care Hospital. Estimated wait: 20-25 min.', time: '12 mins ago', type: 'success', read: false },
    { id: 3, title: 'Queue Exception Update', message: 'Counter 2 is processing tickets faster than usual today. Stay alert inside the facility.', time: '1 hour ago', type: 'info', read: false },
    { id: 4, title: 'Schedule Update', message: 'HDFC Bank Counter B tier scheduling adjustments have been processed for upcoming bookings.', time: '4 hours ago', type: 'info', read: true },
    { id: 5, title: 'Voucher Ticket Dispatched', message: 'Past Token log B-011 accounting details compiled into your History folder dashboard archive.', time: 'Yesterday', type: 'success', read: true },
    { id: 6, title: 'Security Alert Log', message: 'Your account profile security configuration values updated from another device coordinate.', time: '2 days ago', type: 'urgent', read: true }
  ]);

  // Handler to safely drop individual message notifications by id mapping keys
  const handleDismissSingleNotification = (idToDismiss) => {
    setNotifications(prevList => prevList.filter(item => item.id !== idToDismiss));
  };

  // 🟢 NEW FEATURE: Marks all unread items as read natively
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="app-viewport">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        
        .app-viewport {
          width: 100vw; height: 100vh; height: 100dvh; background-color: #f8f9fa;
          font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; overflow: hidden;
        }

        .mobile-layout {
          width: 100%; max-width: 480px; height: 100%; background: #ffffff; display: flex; flex-direction: column; position: relative; overflow: hidden;
        }

        /* 🟢 UPGRADED PREMIUM GRADIENT NAVBAR HOME STYLE MATCHING */
        .top-navbar {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 20px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(74, 35, 182, 0.15);
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          flex-shrink: 0;
        }
        .left-block { display: flex; align-items: center; }
        
        .back-arrow-btn {
          background: rgba(255, 255, 255, 0.15); border: none; color: #ffffff !important;
          cursor: pointer; padding: 8px; border-radius: 12px; display: flex;
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); transition: background 0.2s;
        }
        .back-arrow-btn:active { background: rgba(255, 255, 255, 0.3); }
        
        .navbar-title { font-size: 18px; font-weight: 700; color: #ffffff !important; margin-left: 14px; letter-spacing: -0.3px; }
        
        .clear-all-btn { 
          background: none; border: none; color: rgba(255, 255, 255, 0.9); font-size: 12px; 
          font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;
          padding: 6px 10px; border-radius: 8px; transition: all 0.2s;
        }
        .clear-all-btn:active { background: rgba(255, 255, 255, 0.1); }

        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; background: #f9fafb;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .notification-card {
          background: #ffffff; border-radius: 16px; padding: 16px; display: flex; gap: 14px; border: 1px solid #f3f4f6;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01); animation: slideUpIn 0.2s ease; position: relative;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        /* 🟢 NEW UNREAD CARD GLOW STATE */
        .notification-card.unread-state {
          border-left: 4px solid #6d28d9;
          background: #faf9ff;
        }

        .card-icon-frame { width: 38px; height: 38px; border-radius: 11px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; font-size: 16px; }
        .type-urgent { background: #fff1f2; color: #f43f5e; }
        .type-success { background: #ecfdf5; color: #10b981; }
        .type-info { background: #eff6ff; color: #3b82f6; }

        .card-content { flex-grow: 1; min-width: 0; padding-right: 12px; }
        .card-meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px; }
        .card-title { font-size: 14.5px; font-weight: 700; color: #111827; }
        .card-time { font-size: 11px; color: #9ca3af; font-weight: 500; white-space: nowrap; }
        .card-message { font-size: 13px; color: #4b5563; line-height: 1.45; }

        .btn-dismiss-single {
          position: absolute; top: 14px; right: 14px; background: none; border: none; color: #9ca3af;
          font-size: 12px; cursor: pointer; padding: 2px; line-height: 1;
        }
        .btn-dismiss-single:hover { color: #4b5563; }

        .empty-state-view { display: flex; flex-direction: column; align-items: center; justify-content: center; flex-grow: 1; gap: 12px; color: #9ca3af; padding-bottom: 60px; }
        .empty-state-view p { font-size: 14px; font-weight: 500; }
      `}</style>

      <div className="mobile-layout">
        <div className="top-navbar">
          <div className="left-block">
            <button className="back-arrow-btn" onClick={() => navigate('/')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h2 className="navbar-title">Notifications ({notifications.length})</h2>
          </div>
          
          {/* 🟢 CONDITIONAL ACTION TOGGLE: Mark Read or Clear All according to list status */}
          {notifications.some(n => !n.read) ? (
            <button className="clear-all-btn" onClick={handleMarkAllRead}>Mark Read</button>
          ) : (
            notifications.length > 0 && (
              <button className="clear-all-btn" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={() => setNotifications([])}>Clear All</button>
            )
          )}
        </div>

        <div className="scrollable-body">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div 
                className={`notification-card ${!item.read ? 'unread-state' : ''}`} 
                key={item.id}
                onClick={() => {
                  // Individual item mark-as-read click handler mapping trigger
                  setNotifications(prev => prev.map(n => n.id === item.id ? { ...item, read: true } : n));
                }}
              >
                <div className={`card-icon-frame type-${item.type}`}>
                  {item.type === 'urgent' ? '🔔' : item.type === 'success' ? '✅' : 'ℹ️'}
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <h3 className="card-title">{item.title}</h3>
                    <span className="card-time">{item.time}</span>
                  </div>
                  <p className="card-message">{item.message}</p>
                </div>
                <button className="btn-dismiss-single" onClick={(e) => {
                  e.stopPropagation(); // Prevents click event collision
                  handleDismissSingleNotification(item.id);
                }}>✕</button>
              </div>
            ))
          ) : (
            <div className="empty-state-view">
              <p>All caught up! No recent pushes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;