import React from 'react';

const NearTurnAlert = ({ tokenNumber = 'A-023', nextTokensCount = 3, onAcknowledge }) => {
  return (
    <div className="app-viewport">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .app-viewport {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background-color: #f8f9fa;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        /* Deep high-urgency immersive purple backdrop matching mockup card 6 */
        .mobile-layout {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background: linear-gradient(180deg, #311485 0%, #1e0b58 100%);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          padding: 40px 24px;
          justify-content: space-between;
          align-items: center;
        }

        /* Central Bell Animation Shell Container */
        .alert-center-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          width: 100%;
        }

        .bell-outer-ring {
          width: 160px;
          height: 160px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 40px;
          box-shadow: 0 0 40px rgba(245, 158, 11, 0.15);
          animation: pulseRing 2s infinite ease-in-out;
        }

        @keyframes pulseRing {
          0% { transform: scale(0.98); rgba(255, 255, 255, 0.06); }
          50% { transform: scale(1.04); rgba(255, 255, 255, 0.1); }
          100% { transform: scale(0.98); rgba(255, 255, 255, 0.06); }
        }

        .bell-inner-bg {
          width: 110px;
          height: 110px;
          background: #f59e0b; /* Golden Amber background matching design specs */
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          animation: swingBell 1.5s infinite ease-in-out;
        }

        @keyframes swingBell {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        /* Red Notification Bubble Count Badge Overlay */
        .notification-count-badge {
          position: absolute;
          top: 22px;
          right: 22px;
          background: #ef4444;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid #311485;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }

        /* Typography Text Styling blocks */
        .alert-heading {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
          text-align: center;
        }

        .alert-description {
          color: #cbd5e1;
          font-size: 15px;
          line-height: 1.6;
          text-align: center;
          max-width: 300px;
        }

        .alert-description strong {
          color: #ffffff;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 16px;
        }

        .alert-highlight-text {
          color: #f59e0b;
          font-weight: 700;
        }

        /* Pure White high contrast bottom button layout action */
        .action-container {
          width: 100%;
          padding-bottom: env(safe-area-inset-bottom);
        }

        .btn-acknowledge {
          width: 100%;
          background: #ffffff;
          color: #1e0b58;
          border: none;
          border-radius: 16px;
          height: 56px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.1s ease, background-color 0.2s;
        }

        .btn-acknowledge:hover {
          background: #f8f9fa;
        }

        .btn-acknowledge:active {
          transform: scale(0.99);
        }
      `}</style>

      <div className="mobile-layout">
        
        {/* Main Central Notice Zone */}
        <div className="alert-center-zone">
          
          {/* Animated Graphic Badge Component */}
          <div className="bell-outer-ring">
            <span className="notification-count-badge">1</span>
            <div className="bell-inner-bg">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
          </div>

          {/* Heading Notification Details */}
          <h1 className="alert-heading">Your turn is almost here!</h1>
          <p className="alert-description">
            Token <strong>{tokenNumber}</strong> will be served in the next <span className="alert-highlight-text">{nextTokensCount} tokens</span>. Please head near Counter 2 immediately.
          </p>

        </div>

        {/* Anchored Bottom Control Acknowledge Action Button */}
        <div className="action-container">
          <button className="btn-acknowledge" onClick={onAcknowledge}>
            OK, Got it
          </button>
        </div>

      </div>
    </div>
  );
};

export default NearTurnAlert;