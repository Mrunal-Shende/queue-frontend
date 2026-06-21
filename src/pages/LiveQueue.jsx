import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket'; // 🟢 REAL-TIME BACKEND SOCKET CONNECTION WIRED UP
import TransitSync from '../components/TransitSync'; 
import HapticAccessibility from '../components/HapticAccessibility'; 

export default function LiveQueue() {
  const navigate = useNavigate();
  const { venueId } = useParams(); // URL path parameters se live room ID target karne ke liye

  // Component State Variables mapped to baseline production layers
  const [currentWaiting, setCurrentWaiting] = useState(3);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(6);
  const [activeCounter, setActiveCounter] = useState('Counter 02');
  const [userAttendanceStatus, setUserAttendanceStatus] = useState('tracking');

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState('');

  /**
   * 🟢 WEB-SOCKET REACTION PIPELINE
   * Taps into the background data thread stream. Replaces the temporary local setInterval loop
   * with real, live server triggers.
   */
  useSocket(
    venueId || 'mock-room-id-123', // Room context identification fallback rule
    (data) => {
      // Fired immediately on 'queue_updated' server dispatch events
      console.log("[Socket Intercept] Received dynamic updates matrix:", data);
      if (data.current_waiting_count !== undefined) {
        setCurrentWaiting(data.current_waiting_count);
      }
      if (data.new_estimated_time !== undefined) {
        setEstimatedWaitTime(data.new_estimated_time);
      }
      if (data.counter_assigned) {
        setActiveCounter(data.counter_assigned);
      }
    },
    () => {
      // Fired immediately on 'your_turn_soon' system alert triggers
      console.log("[Socket Intercept] Proximity event matched. Rendering Large Alert Window.");
      setAlertType('near');
      setShowAlertModal(true);

      // Trigger standard continuous dual-vibe pattern to draw user attention
      if (navigator.vibrate) {
        navigator.vibrate([250, 100, 250]);
      }
    }
  );

  const handleUserArrivedAtDesk = () => {
    setShowAlertModal(false);
    setUserAttendanceStatus('arrived');
    setCurrentWaiting(0);
    setEstimatedWaitTime(0);
  };

  const handleUserNotComing = () => {
    if (window.confirm("Are you sure you want to cancel and surrender your queue position?")) {
      setShowAlertModal(false);
      setUserAttendanceStatus('absent');
      navigate('/');
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
        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 18px; background: #f9fafb;
          margin-bottom: 68px; -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .live-status-radar-card {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          border-radius: 24px; padding: 24px; color: #ffffff; text-align: center;
        }
        .card-theme-arrived { background: linear-gradient(135deg, #10b981 0%, #047857 100%) !important; }

        .radar-pulse-ring {
          width: 110px; height: 110px; border: 4px dashed rgba(255,255,255,0.4);
          border-radius: 50%; margin: 10px auto 20px auto; display: flex; justify-content: center; align-items: center;
          animation: spinPulse 20s linear infinite;
        }
        @keyframes spinPulse { to { transform: rotate(360deg); } }
        .inside-pulse-digits { font-size: 34px; font-weight: 800; color: #ffffff; }

        .metrics-grid-holder { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .metric-mini-box { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 18px; padding: 16px; text-align: center; }
        .metric-mini-box label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .metric-mini-box p { font-size: 16px; font-weight: 800; color: #111827; }

        .attendance-reporting-widget { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .attendance-reporting-widget h4 { font-size: 13px; font-weight: 800; color: #374151; text-transform: uppercase; text-align: center; }
        .widget-action-row { display: flex; gap: 10px; }
        .btn-attendance-trigger { flex: 1; height: 44px; border: none; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .btn-report-arrived { background: #e6fbf1; color: #059669; }
        .btn-report-absent { background: #fff5f5; color: #e11d48; }

        .big-alert-modal-blur-mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 9, 20, 0.88); backdrop-filter: blur(8px); z-index: 5500; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .big-alert-box-viewport { width: 100%; max-width: 380px; border-radius: 28px; padding: 32px 24px; text-align: center; }
        .alert-theme-near { background: #fffbeb; border: 3px solid #fbbf24; color: #92400e; }
        .alert-theme-current { background: #f0fdf4; border: 3px solid #22c55e; color: #166534; }
        .modal-split-action-stack { display: flex; flex-direction: column; gap: 10px; width: 100%; }
        .btn-modal-action-block { width: 100%; border: none; border-radius: 14px; height: 48px; font-size: 14px; font-weight: 800; cursor: pointer; }
        .btn-modal-desk-confirm { background: #16a34a; color: #ffffff; }
        .btn-modal-desk-near-ack { background: #d97706; color: #ffffff; }
        .btn-modal-not-coming { background: rgba(0, 0, 0, 0.06); color: inherit; }
        .btn-cancel-ticket-trigger { width: 100%; background: #f9fafb; border: 1px dashed #d1d5db; color: #6b7280; border-radius: 16px; height: 48px; font-size: 14px; font-weight: 700; cursor: pointer; }
      `}</style>

      <div className="mobile-layout">
        {showAlertModal && (
          <div className="big-alert-modal-blur-mask">
            <div className={`big-alert-box-viewport ${alertType === 'current' ? 'alert-theme-current' : 'alert-theme-near'}`}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{alertType === 'current' ? '🔔' : '⚠️'}</div>
              <h2>{alertType === 'current' ? "IT'S OFFICIALLY YOUR TURN!" : "PROXIMITY ALERT: YOU ARE NEXT!"}</h2>
              <p>{alertType === 'current' ? "Please check into Counter 02 immediately." : "Only 1 customer is ahead of you inside the counter queue."}</p>
              <div className="modal-split-action-stack">
                {alertType === 'current' ? (
                  <button className="btn-modal-action-block btn-modal-desk-confirm" onClick={handleUserArrivedAtDesk}>✅ I am at Desk (Check-In)</button>
                ) : (
                  <button className="btn-modal-action-block btn-modal-desk-near-ack" onClick={() => setShowAlertModal(false)}>🚶 I am Moving to Desk</button>
                )}
                <button className="btn-modal-action-block btn-modal-not-coming" onClick={handleUserNotComing}>❌ I am Not Coming</button>
              </div>
            </div>
          </div>
        )}

        <div className="top-navbar">
          <button className="back-arrow-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2 className="navbar-title">Live Tracking</h2>
        </div>

        <div className="scrollable-body">
          <div className={`live-status-radar-card ${userAttendanceStatus === 'arrived' ? 'card-theme-arrived' : ''}`}>
            {userAttendanceStatus === 'arrived' ? (
              <>
                <h3>Status: Completed</h3>
                <div className="radar-pulse-ring" style={{ animation: 'none', borderColor: '#ffffff' }}><div className="inside-pulse-digits">✓</div></div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>Checked In At Desk</div>
              </>
            ) : (
              <>
                <h3>Remaining Wait Index</h3>
                <div className="radar-pulse-ring"><div className="inside-pulse-digits">{currentWaiting}</div></div>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{currentWaiting === 1 ? "You are next in line!" : "Customers Ahead of You"}</div>
              </>
            )}
          </div>

          <div className="metrics-grid-holder">
            <div className="metric-mini-box">
              <label>Est. Wait Duration</label>
              <p style={{ color: userAttendanceStatus === 'arrived' ? '#10b981' : '#1f2937' }}>{userAttendanceStatus === 'arrived' ? "Active" : `~ ${estimatedWaitTime} Mins`}</p>
            </div>
            <div className="metric-mini-box">
              <label>Assigned Unit</label>
              <p>{activeCounter}</p>
            </div>
          </div>

          {/* 🚗 SMART FEATURE 2: LIVE TRANSIT SYNC CARD */}
          {userAttendanceStatus === 'tracking' && <TransitSync />}

          {/* 🔊 SMART FEATURE 3: AUDIO ACCESSIBILITY CONTROLS */}
          <HapticAccessibility />

          {userAttendanceStatus === 'tracking' && (
            <div className="attendance-reporting-widget">
              <h4>Update Your Arrival Status</h4>
              <div className="widget-action-row">
                <button className="btn-attendance-trigger btn-report-arrived" onClick={handleUserArrivedAtDesk}>🙋‍♂️ I'm at Desk</button>
                <button className="btn-attendance-trigger btn-report-absent" onClick={handleUserNotComing}>🛑 I'm Not Coming</button>
              </div>
            </div>
          )}

          {userAttendanceStatus === 'tracking' && (
            <button className="btn-cancel-ticket-trigger" onClick={handleUserNotComing}>❌ Abort & Cancel Ticket</button>
          )}
        </div>
      </div>
    </div>
  );
}