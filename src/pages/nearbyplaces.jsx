import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NearbyPlaces = () => {
  const navigate = useNavigate();
  
  // Simulated Loading Processing States
  const [isFetching, setIsFetching] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Accessing GPS coordinates...');

  // Static high-fidelity array of nearby locations
  const [places] = useState([
    { id: 'max-care-789', name: 'Max Care Hospital', category: 'Medical & Healthcare', distance: '0.8 km away', walkingTime: '10 mins walk', status: 'Open', currentWaiting: 14 },
    { id: 'hdfc-bank-111', name: 'HDFC Bank - Main Branch', category: 'Banking & Finance', distance: '1.2 km away', walkingTime: '15 mins walk', status: 'Open', currentWaiting: 4 },
    { id: 'rto-office-444', name: 'Regional RTO Office', category: 'Government Service', distance: '2.5 km away', walkingTime: '8 mins drive', status: 'Busy', currentWaiting: 29 },
    { id: 'airtel-store-002', name: 'Airtel Digital Store', category: 'Telecom & Tech Store', distance: '3.1 km away', walkingTime: '12 mins drive', status: 'Open', currentWaiting: 2 },
    { id: 'apollo-pharmacy-88', name: 'Apollo Pharmacy 24/7', category: 'Medical & Healthcare', distance: '3.7 km away', walkingTime: '14 mins drive', status: 'Open', currentWaiting: 1 },
    { id: 'reliance-digital-9', name: 'Reliance Digital Hub', category: 'Electronics & Retail', distance: '4.3 km away', walkingTime: '18 mins drive', status: 'Closing Soon', currentWaiting: 8 }
  ]);

  // Handle fake real-time radar search sequence on component mount
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatusMessage('Optimizing live queue servers...');
    }, 700);

    const timer2 = setTimeout(() => {
      setIsFetching(false);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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

        .mobile-layout {
          width: 100%;
          max-width: 480px;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
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

       

        .scrollable-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #f9fafb;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollable-body::-webkit-scrollbar {
          display: none;
        }

        /* LIVE FETCHING SIMULATOR RADAR */
        .fetching-hud-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 30px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
        }

        .radar-spinner {
          width: 44px;
          height: 44px;
          border: 3.5px solid #edd8ff;
          border-top-color: #6d28d9;
          border-radius: 50%;
          animation: spinRadar 0.8s linear infinite;
        }

        @keyframes spinRadar {
          to { transform: rotate(360deg); }
        }

        .fetching-hud-box p {
          font-size: 13.5px;
          color: #6b7280;
          font-weight: 600;
        }

        /* SHIMMERING GLOW LOADER SKELETONS */
        .skeleton-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 16px;
          border: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .shimmer-line {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmerSweep 1.5s infinite linear;
          border-radius: 6px;
        }

        @keyframes shimmerSweep {
          to { background-position: -200% 0; }
        }

        /* RICH DISCOVERED PLACES CARD */
        .place-card-node {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 18px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          animation: cardSlideInUp 0.35s ease-out;
        }

        @keyframes cardSlideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .place-card-node:active {
          transform: scale(0.98);
          border-color: #ccd;
          background: #faf9ff;
        }

        .place-left-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .place-category {
          font-size: 10.5px;
          font-weight: 700;
          color: #6d28d9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .place-name {
          font-size: 15.5px;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .place-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin-top: 2px;
                    }

        .distance-badge {
          background: #f3f4f6;
          color: #374151;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .place-right-metrics {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .waiting-badge {
          background: #f3f0ff;
          color: #6d28d9;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 10px;
          border: 1px solid #e0d7ff;
        }

        .waiting-badge span {
          font-size: 13px;
          font-weight: 800;
        }

        .status-pill {
          font-size: 11px;
          font-weight: 600;
          color: #10b981;
        }
        .status-pill.busy { color: #f97316; }
        .status-pill.closing { color: #ef4444; }
      `}</style>

      <div className="mobile-layout">
        <div className="top-navbar">
          <button className="back-arrow-btn" onClick={() => navigate('/')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="navbar-title">Nearby Places</h2>
        </div>

        <div className="scrollable-body">
          {isFetching ? (
            <>
              {/* RADAR SYSTEM STATUS LOOKUP DISPLAY */}
              <div className="fetching-hud-box">
                <div className="radar-spinner"></div>
                <p>{statusMessage}</p>
              </div>

              {/* MOCK LAYOUT BLOCKS FOR HIGH FIDELITY LOADING */}
              {[1, 2, 3, 4].map((n) => (
                <div className="skeleton-card" key={n}>
                  <div className="shimmer-line" style={{ width: '25%', height: '11px' }}></div>
                  <div className="shimmer-line" style={{ width: '65%', height: '17px' }}></div>
                  <div className="shimmer-line" style={{ width: '45%', height: '12px' }}></div>
                </div>
              ))}
            </>
          ) : (
            <>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', paddingLeft: '4px', marginBottom: '-4px', letterSpacing: '0.5px' }}>
                Discovered Live Locations ({places.length})
              </p>

              {places.map((place) => (
                <div 
                  className="place-card-node" 
                  key={place.id}
                  // CORRECT ROUTING PIPELINE: Passes the custom ID safely into the SelectQueue page mapping
                  onClick={() => navigate(`/select-queue/${place.id}`)}
                >
                  <div className="place-left-info">
                    <span className="place-category">{place.category}</span>
                    <h3 className="place-name">{place.name}</h3>
                    <div className="place-meta-row">
                      <span className="distance-badge">{place.distance}</span>
                      <span>•</span>
                      <span>{place.walkingTime}</span>
                    </div>
                  </div>

                  <div className="place-right-metrics">
                    <div className="waiting-badge">
                      <span>{place.currentWaiting}</span> Waiting
                    </div>
                    <span className={`status-pill ${place.status === 'Busy' ? 'busy' : place.status === 'Closing Soon' ? 'closing' : ''}`}>
                      ● {place.status}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyPlaces;