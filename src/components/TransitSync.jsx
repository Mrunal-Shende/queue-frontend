import React, { useState, useEffect } from 'react';

export default function TransitSync() {
  const [commuteETA, setCommuteETA] = useState(14);
  const [trafficStatus, setTrafficStatus] = useState('Optimal'); // 'Optimal', 'Delayed'
  const [bufferStatusMessage, setBufferStatusMessage] = useState('Your token alignment is locked with your current arrival velocity.');

  // Simulate a random real-time traffic obstacle occurrence after 4 seconds
  useEffect(() => {
    const trafficTimer = setTimeout(() => {
      setTrafficStatus('Delayed');
      setCommuteETA(26);
      setBufferStatusMessage('🚨 Traffic jam detected! The system has buffered your token back by 2 slots so you do not lose your turn.');
    }, 4000);

    return () => clearTimeout(trafficTimer);
  }, []);

  return (
    <div className="transit-sync-card-node">
      <style>{`
        .transit-sync-card-node {
          background: #ffffff; border: 1px solid #f3f4f6; border-radius: 24px;
          padding: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.01);
          font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 16px;
        }
        .transit-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .transit-header-headline { font-size: 14.5px; font-weight: 800; color: #111827; }
        
        .sync-pulse-indicator {
          width: 8px; height: 8px; border-radius: 50%; background: #10b981;
          animation: pulseGlow 1.5s infinite ease-in-out;
        }
        @keyframes pulseGlow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.4; } }

        .metrics-split-strip { display: flex; justify-content: space-between; background: #f9fafb; padding: 12px; border-radius: 16px; border: 1px solid #f3f4f6; }
        .metric-sub-data h5 { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 2px; }
        .metric-sub-data p { font-size: 15px; font-weight: 800; color: #1f2937; }

        .transit-status-callout {
          font-size: 12.5px; font-weight: 600; line-height: 1.4; margin-top: 12px;
          padding: 10px 12px; border-radius: 12px; transition: all 0.3s ease;
        }
        .status-callout-optimal { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .status-callout-delayed { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; animation: flashWarning 0.5s ease 2; }
        
        @keyframes flashWarning { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
      `}</style>

      <div className="transit-title-row">
        <div className="sync-pulse-indicator" style={{ backgroundColor: trafficStatus === 'Delayed' ? '#ef4444' : '#10b981' }} />
        <h4 className="transit-header-headline">🚗 Smart Transit Sync Connected</h4>
      </div>

      <div className="metrics-split-strip">
        <div className="metric-sub-data">
          <h5>Your GPS Distance</h5>
          <p>1.8 km away</p>
        </div>
        <div className="metric-sub-data" style={{ textAlign: 'right' }}>
          <h5>Commute ETA</h5>
          <p style={{ color: trafficStatus === 'Delayed' ? '#ef4444' : '#10b981' }}>{commuteETA} Mins</p>
        </div>
      </div>

      <div className={`transit-status-callout ${trafficStatus === 'Delayed' ? 'status-callout-delayed' : 'status-callout-optimal'}`}>
        {bufferStatusMessage}
      </div>
    </div>
  );
}