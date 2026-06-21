import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Real Camera Viewport Overlay States
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState('Initializing camera stream...');
  
  const qrScannerRef = useRef(null);
  const SCANNER_ELEMENT_ID = "physical-camera-stream-frame";

  // Expanded high-fidelity static location database covering multiple real-world category nodes
  const staticLocationsPool = [
    // Original Baseline Locations
    { id: 'max-care-789', name: 'Max Care Hospital', category: 'Medical & Healthcare', distance: '0.8 km' },
    { id: 'hdfc-bank-111', name: 'HDFC Bank - Main Branch', category: 'Banking & Finance', distance: '1.2 km' },
    { id: 'airtel-store-002', name: 'Airtel Digital Store', category: 'Telecom & Tech Store', distance: '3.1 km' },
    { id: 'apollo-pharmacy-88', name: 'Apollo Pharmacy 24/7', category: 'Medical & Healthcare', distance: '3.7 km' },
    { id: 'reliance-digital-9', name: 'Reliance Digital Hub', category: 'Electronics & Retail', distance: '4.3 km' },

    // NEW: Automobile Showrooms Sector Nodes
    { id: 'suzuki-arena-01', name: 'Maruti Suzuki Arena - Showroom', category: 'Automobile Showroom', distance: '1.5 km' },
    { id: 'suzuki-nexa-02', name: 'Suzuki Nexa - Premium Outlets', category: 'Automobile Showroom', distance: '2.8 km' },
    { id: 'honda-wheels-03', name: 'Honda Elevate Automobile Hub', category: 'Automobile Showroom', distance: '3.4 km' },

    // NEW: Academic Institutions & Colleges Sector Nodes
    { id: 'pote-patil-edu', name: 'P.R. Pote Patil College (Admission Cell)', category: 'College & University', distance: '2.1 km' },
    { id: 'kamala-nehru-edu', name: 'Kamala Nehru Degree College Desk', category: 'College & University', distance: '4.0 km' },
    { id: 'mit-tech-campus', name: 'MIT Engineering Admission Block', category: 'College & University', distance: '5.2 km' },

    // NEW: Public Administration & Government Services Sector Nodes
    { id: 'rto-office-444', name: 'Regional RTO Office - License Wing', category: 'Government Place', distance: '2.5 km' },
    { id: 'aadhaar-seva-kendra', name: 'UIDAI Aadhaar Seva Kendra Centre', category: 'Government Place', distance: '1.9 km' },
    { id: 'municipal-corp-hq', name: 'City Municipal Corporation HQ', category: 'Government Place', distance: '3.8 km' }
  ];

  // Dynamic search matching evaluation engine
  const filteredLocations = staticLocationsPool.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Triggered when user selects an item from the predictive dropdown layer menu
  const handleDropdownItemClick = (place) => {
    setShowDropdown(false);
    setSearchQuery(place.name);
    
    // Smooth user onboarding interaction: play satellite hardware tracking simulation loader overlay
    setScanStatus('Accessing live GPS via query token lookup...');
    setShowScanner(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setScanStatus(`Location Synced! Routing forward down branch...`);

          setTimeout(() => {
            setShowScanner(false);
            navigate(`/select-queue/${place.id}`, {
              state: { userLatitude: lat, userLongitude: lng, isVerifiedByGPS: true }
            });
          }, 1200);
        },
        () => {
          setScanStatus('GPS timed out. Proceeding with standard routing logs...');
          setTimeout(() => {
            setShowScanner(false);
            navigate(`/select-queue/${place.id}`, { state: { isVerifiedByGPS: false } });
          }, 1200);
        }
      );
    }
  };

  // Connects and mounts active physical camera tracking streams
  const handleOpenScanner = async () => {
    setShowScanner(true);
    setScanStatus('Requesting smartphone camera access...');

    setTimeout(async () => {
      try {
        const html5QrcodeScanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        qrScannerRef.current = html5QrcodeScanner;

        const config = { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 };

        await html5QrcodeScanner.start(
          { facingMode: "environment" },
          config,
          (qrCodeText) => { handleScannerSuccess(qrCodeText); },
          () => { setScanStatus('Align QR code completely inside the target box'); }
        );
        setScanStatus('Camera stream active. Point at any venue QR code.');
      } catch (err) {
        console.error("Camera access failed:", err);
        setScanStatus('Camera access denied. Use manual screen fallback button.');
      }
    }, 300);
  };

  const handleCloseScanner = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try { await qrScannerRef.current.stop(); } catch (err) { console.error(err); }
    }
    setShowScanner(false);
  };

  const handleScannerSuccess = async (scannedPayload) => {
    setScanStatus('Fetching real-time GPS coordinates...');
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      await qrScannerRef.current.stop();
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setScanStatus(`Location Found: ${lat.toFixed(4)}, ${lng.toFixed(4)}. Redirecting...`);
          setTimeout(() => {
            setShowScanner(false);
            const sanitizedVenueId = scannedPayload ? encodeURIComponent(scannedPayload.trim().toLowerCase().replace(/\s+/g, '-')) : 'scanned-qr-venue-789';
            navigate(`/select-queue/${sanitizedVenueId}`, {
              state: { userLatitude: lat, userLongitude: lng, isVerifiedByGPS: true }
            });
          }, 1200);
        },
        () => {
          setScanStatus('GPS fallback activated. Routing via baseline parameters...');
          setTimeout(() => {
            setShowScanner(false);
            const sanitizedVenueId = scannedPayload ? encodeURIComponent(scannedPayload.trim().toLowerCase().replace(/\s+/g, '-')) : 'scanned-qr-venue-789';
            navigate(`/select-queue/${sanitizedVenueId}`, { state: { isVerifiedByGPS: false } });
          }, 1200);
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop().catch(err => console.log(err));
      }
    };
  }, []);

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

        .app-header {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 24px 20px 28px 20px; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; color: #ffffff; flex-shrink: 0; box-shadow: 0 4px 20px rgba(74, 35, 182, 0.1);
        }

        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .user-greeting h3 { font-size: 13px; font-weight: 500; opacity: 0.85; margin-bottom: 2px; }
        .user-greeting h2 { font-size: 20px; font-weight: 700; }

        .notification-bell {
          background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); width: 40px; height: 40px; border-radius: 12px; display: flex; justify-content: center; align-items: center; cursor: pointer; position: relative;
        }
        .bell-dot { position: absolute; top: 11px; right: 12px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; }

        .search-section { position: relative; }
        .search-title { font-size: 17px; font-weight: 600; margin-bottom: 12px; line-height: 1.4; }
        
        .search-bar {
          display: flex; align-items: center; background: #ffffff; border-radius: 14px; padding: 0 14px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); position: relative; z-index: 10;
        }
        .search-bar svg { color: #9ca3af; margin-right: 10px; flex-shrink: 0; }
        .search-bar input { border: none; outline: none; width: 100%; height: 46px; font-size: 14px; color: #1f2937; font-family: inherit; }

        /* LIVE DROPDOWN PREDICTIONS PANEL */
        .search-suggestions-dropdown {
          position: absolute; top: 105%; left: 0; right: 0; background: #ffffff; border-radius: 14px; box-shadow: 0 12px 30px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; z-index: 500; max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; padding: 6px 0;
        }
        .suggestion-item-row {
          display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f3f4f6;
        }
        .suggestion-item-row:last-child { border-bottom: none; }
        .suggestion-item-row:hover { background: #f5f3ff; }
        .item-row-title { font-size: 13.5px; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .item-row-category { font-size: 11px; font-weight: 600; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.3px; }
        .item-row-dist { font-size: 11px; font-weight: 700; color: #374151; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }

        .scrollable-body { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; -ms-overflow-style: none; scrollbar-width: none; }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .action-card { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 18px; padding: 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s ease; }
        .action-card:active { transform: scale(0.98); background: #fafafa; border-color: #edd8ff; }
        .card-icon-box { width: 46px; height: 46px; border-radius: 12px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .icon-qr { background: #f5f3ff; color: #6d28d9; }
        .icon-geo { background: #ecfdf5; color: #10b981; }
        .icon-list { background: #eff6ff; color: #3b82f6; }
        .card-info { flex-grow: 1; min-width: 0; }
        .card-info h4 { font-size: 15px; font-weight: 700; color: #1f2937; margin-bottom: 2px; }
        .card-info p { font-size: 12.5px; color: #6b7280; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .arrow-right { color: #9ca3af; flex-shrink: 0; }

        .camera-scanner-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #0b0914; z-index: 2000; display: flex; flex-direction: column; justify-content: space-between; padding: 35px 24px; }
        .scanner-header { display: flex; justify-content: space-between; align-items: center; color: #ffffff; }
        .scanner-header h3 { font-size: 18px; font-weight: 700; }
        .close-scanner-btn { background: rgba(255, 255, 255, 0.15); border: none; color: #ffffff; width: 38px; height: 38px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; justify-content: center; align-items: center; }
        .hardware-viewfinder-wrapper { width: 280px; height: 280px; margin: 0 auto; position: relative; border-radius: 24px; overflow: hidden; border: 3px solid #6d28d9; box-shadow: 0 0 20px rgba(109, 40, 217, 0.3); }
        #physical-camera-stream-frame { width: 100% !important; height: 100% !important; object-fit: cover !important; background: #111; }
        .laser-glow-line { width: 100%; height: 3px; background: #10b981; box-shadow: 0 0 14px #10b981; position: absolute; left: 0; z-index: 10; animation: laserPingMotion 2s infinite ease-in-out; }
        @keyframes laserPingMotion { 0%, 100% { top: 0%; } 50% { top: 100%; } }
        .scanner-status-badge { color: #ffffff; text-align: center; font-size: 13px; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); padding: 10px 20px; border-radius: 20px; margin: 20px auto 0 auto; display: block; max-width: 90%; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1); }
        .btn-simulate-manual-capture { width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 16px; height: 52px; font-size: 14.5px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25); margin-top: 16px; }

        .fixed-bottom-nav { height: 68px; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(10px); border-top: 1px solid #f3f4f6; display: flex; justify-content: space-around; align-items: center; flex-shrink: 0; }
        .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 11px; font-weight: 600; width: 33.33%; height: 100%; justify-content: center; }
        .nav-item.active { color: #6d28d9; }
      `}</style>

      <div className="mobile-layout">
        
        {/* PHYSICAL CAMERA VIEWPORT / GPS TRACKER HUD */}
        {showScanner && (
          <div className="camera-scanner-overlay">
            <div className="scanner-header">
              <h3>Processing Target Node</h3>
              <button className="close-scanner-btn" onClick={handleCloseScanner}>✕</button>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '100px' }}>
              <div className="hardware-viewfinder-wrapper">
                <div className="laser-glow-line"></div>
                <div id={SCANNER_ELEMENT_ID}></div>
              </div>
              <div className="scanner-status-badge">{scanStatus}</div>
              <div style={{ padding: '0 20px' }}>
                <button className="btn-simulate-manual-capture" onClick={() => handleScannerSuccess('max-care-hospital-qr')}>
                  📸 Capture Camera Frame (Simulate Click)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY APP MAIN HEADER WITH COMPREHENSIVE DROPDOWN INDEX */}
        <div className="app-header">
          <div className="header-top">
            <div className="user-greeting"><h3>Hello, 👋</h3><h2>Good Morning!</h2></div>
            <div className="notification-bell" onClick={() => navigate('/notifications')}>
              <span className="bell-dot"></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
          </div>

          <div className="search-section">
            <h1 className="search-title">Where do you want to join a queue?</h1>
            <div className="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search Showrooms, Colleges, RTO..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              />
            </div>

            {/* EXPANDED DYNAMIC SUGGESTIONS DROPDOWN PANEL */}
            {showDropdown && searchQuery.trim() !== '' && (
              <div className="search-suggestions-dropdown">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((place) => (
                    <div className="suggestion-item-row" key={place.id} onMouseDown={() => handleDropdownItemClick(place)}>
                      <div>
                        <div className="item-row-title">{place.name}</div>
                        <div className="item-row-category">{place.category}</div>
                      </div>
                      <div className="item-row-dist">{place.distance}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>No matching venues discovered</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CORE QUICK SHORTCUT HUB ACTION CARDS */}
        <div className="scrollable-body">
          <div className="action-card" onClick={handleOpenScanner}>
            <div className="card-icon-box icon-qr"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></div>
            <div className="card-info"><h4>Scan QR Code</h4><p>Scan instant ticketing codes at the front gate desk.</p></div>
            <div className="arrow-right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
          </div>

          <div className="action-card" onClick={() => navigate('/nearby-places')}>
            <div className="card-icon-box icon-geo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
            <div className="card-info"><h4>Nearby Places</h4><p>Find available branches within traveling radius.</p></div>
            <div className="arrow-right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
          </div>

          <div className="action-card" onClick={() => navigate('/select-queue/manual-venue-001')}>
            <div className="card-icon-box icon-list"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></div>
            <div className="card-info"><h4>Select Manually</h4><p>Search alphabetically across all partner centers.</p></div>
            <div className="arrow-right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
          </div>
        </div>

        {/* FIXED FOOTER NAV DECK */}
        <div className="fixed-bottom-nav">
          <button className="nav-item active" onClick={() => navigate('/')}><span>Home</span></button>
          <button className="nav-item" onClick={() => navigate('/history')}><span>History</span></button>
          <button className="nav-item" onClick={() => navigate('/profile')}><span>Profile</span></button>
        </div>
      </div>
    </div>
  );
};

export default Home;