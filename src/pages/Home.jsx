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

  // Expanded high-fidelity static location database
  const staticLocationsPool = [
    { id: 'max-care-789', name: 'Max Care Hospital', category: 'Medical & Healthcare', distance: '0.8 km' },
    { id: 'hdfc-bank-111', name: 'HDFC Bank - Main Branch', category: 'Banking & Finance', distance: '1.2 km' },
    { id: 'airtel-store-002', name: 'Airtel Digital Store', category: 'Telecom & Tech Store', distance: '3.1 km' },
    { id: 'apollo-pharmacy-88', name: 'Apollo Pharmacy 24/7', category: 'Medical & Healthcare', distance: '3.7 km' },
    { id: 'reliance-digital-9', name: 'Reliance Digital Hub', category: 'Electronics & Retail', distance: '4.3 km' },
    { id: 'suzuki-arena-01', name: 'Maruti Suzuki Arena - Showroom', category: 'Automobile Showroom', distance: '1.5 km' },
    { id: 'suzuki-nexa-02', name: 'Suzuki Nexa - Premium Outlets', category: 'Automobile Showroom', distance: '2.8 km' },
    { id: 'honda-wheels-03', name: 'Honda Elevate Automobile Hub', category: 'Automobile Showroom', distance: '3.4 km' },
    { id: 'pote-patil-edu', name: 'P.R. Pote Patil College (Admission Cell)', category: 'College & University', distance: '2.1 km' },
    { id: 'kamala-nehru-edu', name: 'Kamala Nehru Degree College Desk', category: 'College & University', distance: '4.0 km' },
    { id: 'mit-tech-campus', name: 'MIT Engineering Admission Block', category: 'College & University', distance: '5.2 km' },
    { id: 'rto-office-444', name: 'Regional RTO Office - License Wing', category: 'Government Place', distance: '2.5 km' },
    { id: 'aadhaar-seva-kendra', name: 'UIDAI Aadhaar Seva Kendra Centre', category: 'Government Place', distance: '1.9 km' },
    { id: 'municipal-corp-hq', name: 'City Municipal Corporation HQ', category: 'Government Place', distance: '3.8 km' }
  ];

  // Dynamic search matching evaluation engine
  const filteredLocations = staticLocationsPool.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDropdownItemClick = (place) => {
    setShowDropdown(false);
    setSearchQuery(place.name);
    
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        
        .app-viewport {
          width: 100vw; height: 100vh; height: 100dvh; background-color: #5e4ae3;
          font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; padding: 12px;
        }

        .mobile-layout {
          width: 100%; max-width: 410px; height: 100%; max-height: 780px;
          background: #ffffff; border-radius: 32px; display: flex; flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); overflow: hidden; position: relative;
        }

        /* 🖼️ Updated Premium Abstract Theme Banner Slot */
        .queue-header-banner {
          width: 100%; height: 140px; background: linear-gradient(135deg, #5e4ae3 0%, #7e6fff 100%); overflow: hidden; flex-shrink: 0;
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .queue-header-banner::before {
          content: ""; position: absolute; width: 140px; height: 140px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.1); top: -40px; right: -30px;
        }
        .queue-header-banner::after {
          content: ""; position: absolute; width: 210px; height: 210px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.06); bottom: -90px; left: -40px;
        }
        .brand-logo-hud {
          color: #ffffff; display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 5;
        }
        .brand-logo-hud svg { width: 36px; height: 36px; opacity: 0.95; }
        .brand-logo-hud span { font-size: 16px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9; }

        /* Compact Non-Congested Scrollable Body */
        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 24px 24px 36px 24px; display: flex; flex-direction: column; gap: 16px;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .header-top { display: flex; justify-content: space-between; align-items: center; }
        .user-greeting h3 { font-size: 13.5px; font-weight: 500; color: #7e849c; margin-bottom: 1px; }
        .user-greeting h2 { font-size: 21px; font-weight: 800; color: #1f2235; letter-spacing: -0.5px; }

        .notification-bell {
          background: #f1f3f7; width: 42px; height: 42px; border-radius: 12px; 
          display: flex; justify-content: center; align-items: center; cursor: pointer; position: relative;
          color: #1f2235;
        }
        .bell-dot { position: absolute; top: 13px; right: 14px; width: 6px; height: 6px; background: #ea3d3d; border-radius: 50%; }

        .search-section { position: relative; }
        .search-title { font-size: 13px; font-weight: 700; color: #4a4d61; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.4px; }
        
        .search-bar {
          display: flex; align-items: center; background: #f1f3f7; border-radius: 14px; padding: 0 16px; 
          position: relative; z-index: 10; height: 52px; border: 1px solid transparent; transition: all 0.2s;
        }
        .search-bar:focus-within { background: #ffffff; border-color: #5e4ae3; box-shadow: 0 0 0 4px rgba(94, 74, 227, 0.1); }
        .search-bar svg { color: #4a4d61; margin-right: 12px; flex-shrink: 0; width: 16px; height: 16px; }
        .search-bar input { border: none; outline: none; width: 100%; height: 100%; font-size: 14px; color: #1f2235; font-weight: 600; background: transparent; }
        .search-bar input::placeholder { color: #9da3b4; font-weight: 500; }

        .search-suggestions-dropdown {
          position: absolute; top: 105%; left: 0; right: 0; background: #ffffff; border-radius: 14px; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.15); border: 1px solid #eef0f6; z-index: 500; max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; padding: 4px 0;
        }
        .suggestion-item-row {
          display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f8f9fb;
        }
        .suggestion-item-row:last-child { border-bottom: none; }
        .suggestion-item-row:hover { background: #fdfbfe; }
        .item-row-title { font-size: 13.5px; font-weight: 700; color: #1f2235; margin-bottom: 2px; }
        .item-row-category { font-size: 10.5px; font-weight: 700; color: #5e4ae3; text-transform: uppercase; letter-spacing: 0.4px; }
        .item-row-dist { font-size: 11px; font-weight: 700; color: #4a4d61; background: #f1f3f7; padding: 3px 6px; border-radius: 5px; }

        /* Compact action stack heights to reduce scrolling completely */
        .action-cards-stack { display: flex; flex-direction: column; gap: 14px; }
        .action-card { 
          background: #ffffff; border: 1px solid #eef0f6; border-radius: 14px; padding: 16px; 
          display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s ease; 
        }
        .action-card:active { transform: scale(0.99); background: #f9fafc; }
        
        .card-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .card-icon-box svg { width: 20px; height: 20px; }
        .icon-qr { background: #eedffa; color: #5e4ae3; }
        .icon-geo { background: #e3f9ee; color: #10b981; }
        .icon-list { background: #e6f0ff; color: #3b82f6; }
        
        .card-info { flex-grow: 1; min-width: 0; }
        .card-info h4 { font-size: 15px; font-weight: 700; color: #1f2235; margin-bottom: 2px; }
        .card-info p { font-size: 12.5px; color: #7e849c; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
        .arrow-right { color: #a3a9c2; flex-shrink: 0; display: flex; align-items: center; }

        .camera-scanner-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #0b0914; z-index: 2000; display: flex; flex-direction: column; justify-content: space-between; padding: 36px 24px; }
        .scanner-header { display: flex; justify-content: space-between; align-items: center; color: #ffffff; }
        .scanner-header h3 { font-size: 18px; font-weight: 700; }
        .close-scanner-btn { background: rgba(255, 255, 255, 0.15); border: none; color: #ffffff; width: 40px; height: 40px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; justify-content: center; align-items: center; }
        .hardware-viewfinder-wrapper { width: 260px; height: 280px; margin: 0 auto; position: relative; border-radius: 24px; overflow: hidden; border: 3px solid #5e4ae3; box-shadow: 0 0 20px rgba(94, 74, 227, 0.3); }
        #physical-camera-stream-frame { width: 100% !important; height: 100% !important; object-fit: cover !important; background: #111; }
        .laser-glow-line { width: 100%; height: 3px; background: #10b981; box-shadow: 0 0 14px #10b981; position: absolute; left: 0; z-index: 10; animation: laserPingMotion 2s infinite ease-in-out; }
        @keyframes laserPingMotion { 0%, 100% { top: 0%; } 50% { top: 100%; } }
        .scanner-status-badge { color: #ffffff; text-align: center; font-size: 13px; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px); padding: 12px 20px; border-radius: 20px; margin: 20px auto 0 auto; display: block; max-width: 90%; font-weight: 600; border: 1px solid rgba(255, 255, 255, 0.1); }
        .btn-simulate-manual-capture { width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; border-radius: 14px; height: 50px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25); margin-top: 20px; }
      `}</style>

      <div className="mobile-layout">
        
        {/* PHYSICAL CAMERA VIEWPORT / GPS TRACKER HUD */}
        {showScanner && (
          <div className="camera-scanner-overlay">
            <div className="scanner-header">
              <h3>Processing Target Node</h3>
              <button className="close-scanner-btn" onClick={handleCloseScanner}>✕</button>
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifycontent: 'center', marginTop: '40px' }}>
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

        {/* 🎨 CLEAN ABSTRACT THEME BANNER HEADER (Replaced Image URL) */}
        <div className="queue-header-banner">
          <div className="brand-logo-hud">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>Smart Queue</span>
          </div>
        </div>

        <div className="scrollable-body">
          
          {/* Welcome Greeting Elements */}
          <div className="header-top">
            <div className="user-greeting"><h3>Hello, 👋</h3><h2>Good Morning!</h2></div>
            <div className="notification-bell" onClick={() => navigate('/notifications')}>
              <span className="bell-dot"></span>
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
          </div>

          {/* Search Input Block */}
          <div className="search-section">
            <h1 className="search-title">Where do you want to join a queue?</h1>
            <div className="search-bar">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search Showrooms, Colleges, RTO..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              />
            </div>

            {/* DYNAMIC SUGGESTIONS DROPDOWN PANEL */}
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

          {/* COMPACT SHORTCUT ACTION CARDS */}
          <div className="action-cards-stack">
            <div className="action-card" onClick={handleOpenScanner}>
              <div className="card-icon-box icon-qr">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <div className="card-info"><h4>Scan QR Code</h4><p>Scan instant ticketing codes at the front gate desk.</p></div>
              <div className="arrow-right"><svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>

            <div className="action-card" onClick={() => navigate('/nearby-places')}>
              <div className="card-icon-box icon-geo">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div className="card-info"><h4>Nearby Places</h4><p>Find available branches within traveling radius.</p></div>
              <div className="arrow-right"><svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>

            <div className="action-card" onClick={() => navigate('/select-queue/manual-venue-001')}>
              <div className="card-icon-box icon-list">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <div className="card-info"><h4>Select Manually</h4><p>Search alphabetically across all partner centers.</p></div>
              <div className="arrow-right"><svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;