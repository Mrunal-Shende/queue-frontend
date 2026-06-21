import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');

  // Packed history logs dataset representing cross-venue interactions
  const [historyItems, setHistoryItems] = useState([
    { id: 'A-023', venue: 'Max Care Hospital - Counter 2', type: 'Normal Queue', date: '20 May 2024, 11:45 AM', waitTime: '25 min', status: 'Completed' },
    { id: 'B-011', venue: 'HDFC Bank - Cash Counter B', type: 'Priority Queue', date: '18 May 2024, 10:30 AM', waitTime: '15 min', status: 'Completed' },
    { id: 'A-018', venue: 'Regional RTO Office - Window 4', type: 'Normal Queue', date: '15 May 2024, 02:10 PM', waitTime: '30 min', status: 'Completed' },
    { id: 'C-092', venue: 'Airtel Digital Store - Helpdesk', type: 'Normal Queue', date: '10 May 2024, 04:15 PM', waitTime: '12 min', status: 'Completed' },
    { id: 'P-004', venue: 'Municipal Corporation - Desk 1', type: 'Priority Queue', date: '08 May 2024, 09:15 AM', waitTime: '08 min', status: 'Completed' },
    { id: 'A-104', venue: 'Metro Station Customer Care', type: 'Normal Queue', date: '03 May 2024, 06:40 PM', waitTime: '22 min', status: 'Completed' },
    { id: 'B-071', venue: 'Passport Seva Kendra - Counter A', type: 'Normal Queue', date: '28 Apr 2024, 11:20 AM', waitTime: '45 min', status: 'Completed' }
  ]);

  // Handler to selectively remove an individual item from the scroll history ledger list
  const handleRemoveItem = (idToRemove) => {
    if (window.confirm(`Remove ticket record ${idToRemove} from your history device log?`)) {
      setHistoryItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
    }
  };

  return (
    <div className="app-viewport">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        
        .app-viewport {
          width: 100vw; height: 100vh; height: 100dvh; background-color: #f8f9fa;
          font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; overflow: hidden;
        }

        .mobile-layout {
          width: 100%; max-width: 480px; height: 100%; background: #ffffff; display: flex; flex-direction: column; position: relative; overflow: hidden;
        }

              /* 🟢 HAR INNER PAGE KE STYLE TAG ME YEH REUSEABLE CONFIG BLOCKS UPDATE KAREIN */
        .top-navbar {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 20px 16px;
          display: flex;
          align-items: center;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(74, 35, 182, 0.15);
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          flex-shrink: 0;
        }

        .back-arrow-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #ffffff !important;
          cursor: pointer;
          padding: 8px;
          border-radius: 12px;
          display: flex;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .back-arrow-btn:active {
          background: rgba(255, 255, 255, 0.3);
        }

        .navbar-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff !important;
          margin-left: 14px;
          flex-grow: 1;
          letter-spacing: -0.3px;
        }

        .toggle-switch-tray { display: flex; border-bottom: 1px solid #f3f4f6; padding: 0 20px; flex-shrink: 0; background: #ffffff; }
        .switch-tab-btn { flex: 1; background: none; border: none; height: 44px; font-size: 14px; font-weight: 600; color: #9ca3af; cursor: pointer; position: relative; }
        .switch-tab-btn.active-filter { color: #4a23b6; }
        .switch-tab-btn.active-filter::after { content: ''; position: absolute; bottom: 0; left: 25%; width: 50%; height: 3px; background: #4a23b6; border-radius: 2px; }

        /* Filled Scrollable List Context Layout */
        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; background: #f9fafb;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .history-ticket-card {
          background: #ffffff; border: 1px solid #f3f4f6; border-radius: 18px; padding: 16px; display: flex; justify-content: space-between; align-items: flex-start;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01); position: relative; transition: all 0.2s ease;
        }

        .ticket-left-metrics h3 { font-size: 20px; font-weight: 800; color: #1e1b4b; letter-spacing: -0.5px; margin-bottom: 2px; }
        .ticket-venue-name { font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 4px; }
        .ticket-class-tag { font-size: 11.5px; font-weight: 500; color: #9ca3af; margin-bottom: 8px; }
        .ticket-timestamp-info { font-size: 11px; color: #9ca3af; font-weight: 500; }

        .ticket-right-status { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; height: 100%; min-height: 80px; }
        .badge-completed-pill { font-size: 10.5px; font-weight: 700; background: #e6fbf1; color: #10b981; padding: 4px 10px; border-radius: 10px; }
        .wait-duration-label { font-size: 11.5px; color: #4b5563; font-weight: 600; }

        /* Delete action overlay trigger */
        .btn-delete-record {
          background: none; border: none; color: #9ca3af; cursor: pointer; padding: 2px; font-size: 14px; line-height: 1; transition: color 0.2s;
        }
        .btn-delete-record:hover { color: #ef4444; }

        .fixed-bottom-nav {
          height: 68px; background: #ffffff; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-around; align-items: center; flex-shrink: 0;
        }
        .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 11px; font-weight: 600; width: 33.33%; }
        .nav-item.active { color: #6d28d9; }
      `}</style>

      <div className="mobile-layout">
        <div className="top-navbar">
          <button className="back-arrow-btn" onClick={() => navigate('/')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2 className="navbar-title">My Queues</h2>
        </div>

        <div className="toggle-switch-tray">
          <button className={`switch-tab-btn ${activeTab === 'active' ? 'active-filter' : ''}`} onClick={() => setActiveTab('active')}>Active</button>
          <button className={`switch-tab-btn ${activeTab === 'history' ? 'active-filter' : ''}`} onClick={() => setActiveTab('history')}>History ({historyItems.length})</button>
        </div>

        <div className="scrollable-body">
          {activeTab === 'history' ? (
            historyItems.map((item) => (
              <div className="history-ticket-card" key={item.id}>
                <div className="ticket-left-metrics">
                  <h3>{item.id}</h3>
                  <div className="ticket-venue-name">{item.venue}</div>
                  <div className="ticket-class-tag">{item.type}</div>
                  <div className="ticket-timestamp-info">{item.date}</div>
                </div>
                
                <div className="ticket-right-status">
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className="badge-completed-pill">{item.status}</span>
                    <button className="btn-delete-record" onClick={() => handleRemoveItem(item.id)} title="Delete reference">✕</button>
                  </div>
                  <div className="wait-duration-label">{item.waitTime}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', margin: 'auto 0', fontWeight: 500 }}>
              No current active tokens found.
            </div>
          )}
        </div>

        <div className="fixed-bottom-nav">
          <button className="nav-item" onClick={() => navigate('/')}><span>Home</span></button>
          <button className="nav-item active" onClick={() => navigate('/history')}><span>History</span></button>
          <button className="nav-item" onClick={() => navigate('/profile')}><span>Profile</span></button>
        </div>
      </div>
    </div>
  );
};

export default History;