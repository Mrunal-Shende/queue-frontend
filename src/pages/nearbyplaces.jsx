import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NearbyPlaces = () => {
  const navigate = useNavigate();
  
  // Simulated Loading Processing States
  const [isFetching, setIsFetching] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Accessing GPS coordinates...');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Static high-fidelity array of nearby locations (Maintained Exact Key Integrity)
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

  // Filter Pipeline
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          place.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Medical') return matchesSearch && place.category.includes('Medical');
    if (activeCategory === 'Banking') return matchesSearch && place.category.includes('Banking');
    if (activeCategory === 'Govt') return matchesSearch && place.category.includes('Government');
    return matchesSearch;
  });

  return (
    <div className="app-viewport">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

        /* Desktop view me blue background hamesha dikhega */
        .app-viewport {
          width: 100vw; height: 100vh; height: 100dvh; background-color: #5e4ae3;
          font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; padding: 12px;
        }

        /* Responsive Desktop Base Card Frame Layout */
        .mobile-layout {
          width: 100%; max-width: 410px; height: 100%; max-height: 780px;
          background: #ffffff; border-radius: 32px; display: flex; flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); overflow: hidden; position: relative;
        }

        /* 📱 REAL MOBILE MEDIA SCREEN: Background blue hat jayega aur data full touch stretch hoga */
        @media (max-width: 480px) {
          .app-viewport { background-color: #ffffff; padding: 0; }
          .mobile-layout { max-height: 100vh; border-radius: 0; box-shadow: none; }
        }

        .top-navbar {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 24px 20px; display: flex; align-items: center; color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(74, 35, 182, 0.15); border-bottom-left-radius: 24px; border-bottom-right-radius: 24px; flex-shrink: 0;
        }

        .back-arrow-btn {
          background: rgba(255, 255, 255, 0.15); border: none; color: #ffffff !important;
          cursor: pointer; padding: 8px; border-radius: 12px; display: flex; backdrop-filter: blur(4px); transition: background 0.2s;
        }
        .back-arrow-btn:active { background: rgba(255, 255, 255, 0.3); }
        .navbar-title { font-size: 18px; font-weight: 700; color: #ffffff !important; margin-left: 14px; flex-grow: 1; letter-spacing: -0.3px; }

        .search-container-wrapper { padding: 18px 20px 10px 20px; flex-shrink: 0; }
        .search-input-box {
          display: flex; align-items: center; background: #f1f3f7; border-radius: 14px; padding: 0 14px; height: 48px;
        }
        .search-input-box svg { color: #7e849c; margin-right: 10px; flex-shrink: 0; }
        .search-input-box input { border: none; outline: none; width: 100%; height: 100%; font-size: 14px; color: #1f2235; font-weight: 600; background: transparent; }
        .search-input-box input::placeholder { color: #9da3b4; font-weight: 500; }

        .category-pills-row {
          display: flex; gap: 8px; overflow-x: auto; padding: 4px 20px 14px 20px; flex-shrink: 0;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .category-pills-row::-webkit-scrollbar { display: none; }
        .pill-badge-item {
          padding: 8px 16px; background: #f1f3f7; color: #7e849c; font-size: 12.5px; font-weight: 700; border-radius: 20px; cursor: pointer; white-space: nowrap; transition: all 0.2s; border: 1px solid transparent;
        }
        .pill-badge-item.active { background: #eedffa; color: #5e4ae3; border-color: rgba(94, 74, 227, 0.15); }

        /* 🛡️ NON-CUTTING SCROLLABLE BODY: Added strong bottom buffer spacing */
        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 4px 20px 48px 20px; display: flex; flex-direction: column; gap: 14px; background: #ffffff;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .fetching-hud-box {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 40px 20px; background: #ffffff; border-radius: 20px;
        }
        .radar-spinner {
          width: 46px; height: 46px; border: 4px solid #eedffa; border-top-color: #6d28d9; border-radius: 50%; animation: spinRadar 0.8s linear infinite;
        }
        @keyframes spinRadar { to { transform: rotate(360deg); } }
        .fetching-hud-box p { font-size: 14px; color: #7e849c; font-weight: 600; }

        .skeleton-card { background: #ffffff; border-radius: 18px; padding: 18px; border: 1px solid #f1f3f7; display: flex; flex-direction: column; gap: 12px; }
        .shimmer-line { background: linear-gradient(90deg, #f1f3f7 25%, #e2e4ee 50%, #f1f3f7 75%); background-size: 200% 100%; animation: shimmerSweep 1.5s infinite linear; border-radius: 6px; }
        @keyframes shimmerSweep { to { background-position: -200% 0; } }

        .place-card-node {
          background: #ffffff; border: 1px solid #f1f3f7; border-radius: 18px; padding: 18px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.01); animation: cardSlideInUp 0.35s ease-out;
        }
        @keyframes cardSlideInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .place-card-node:active { transform: scale(0.98); border-color: rgba(94, 74, 227, 0.15); background: #fdfbfe; }

        .place-left-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .place-category { font-size: 10.5px; font-weight: 700; color: #5e4ae3; text-transform: uppercase; letter-spacing: 0.5px; }
        .place-name { font-size: 15.5px; font-weight: 700; color: #1f2235; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .place-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #7e849c; font-weight: 600; margin-top: 2px; }
        .distance-badge { background: #f1f3f7; color: #4a4d61; font-weight: 700; padding: 2px 8px; border-radius: 6px; }

        .place-right-metrics { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; margin-left: 12px; }
        
        .waiting-badge { background: #eedffa; color: #5e4ae3; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 12px; border: 1px solid rgba(94, 74, 227, 0.1); }
        .waiting-badge span { font-size: 13.5px; font-weight: 800; }
        .place-card-node.high-density .waiting-badge { background: #ffebeb; color: #ea3d3d; border-color: rgba(234, 61, 61, 0.1); }

        .status-pill { font-size: 11.5px; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 4px; }
        .status-pill.busy { color: #f97316; }
        .status-pill.closing { color: #ef4444; }
        
        .result-empty-state { text-align: center; color: #9da3b4; font-size: 14px; font-weight: 500; padding: 40px 20px; }
      `}</style>

      <div className="mobile-layout">
        
        {/* Navbar */}
        <div className="top-navbar">
          <button className="back-arrow-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="navbar-title">Nearby Places</h2>
        </div>

        {/* Search Bar */}
        <div className="search-container-wrapper">
          <div className="search-input-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search by center or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="category-pills-row">
          {['All', 'Medical', 'Banking', 'Govt'].map((cat) => (
            <div 
              className={`pill-badge-item ${activeCategory === cat ? 'active' : ''}`} 
              key={cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'Govt' ? 'Government' : cat}
            </div>
          ))}
        </div>

        {/* Places List Container */}
        <div className="scrollable-body">
          {isFetching ? (
            <>
              <div className="fetching-hud-box">
                <div className="radar-spinner"></div>
                <p>{statusMessage}</p>
              </div>

              {[1, 2, 3].map((n) => (
                <div className="skeleton-card" key={n}>
                  <div className="shimmer-line" style={{ width: '25%', height: '11px' }}></div>
                  <div className="shimmer-line" style={{ width: '65%', height: '16px' }}></div>
                  <div className="shimmer-line" style={{ width: '40%', height: '12px' }}></div>
                </div>
              ))}
            </>
          ) : (
            <>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3b4', textTransform: 'uppercase', paddingLeft: '2px', marginBottom: '-4px', letterSpacing: '0.5px' }}>
                Discovered Live Locations ({filteredPlaces.length})
              </p>

              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <div 
                    className={`place-card-node ${place.currentWaiting >= 20 ? 'high-density' : ''}`} 
                    key={place.id}
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
                ))
              ) : (
                <div className="result-empty-state">
                  No near centers match your filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyPlaces;