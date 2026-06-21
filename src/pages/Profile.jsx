import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || {};

  // Active Screen Toggle State Machine: 'main' | 'personal' | 'id-proofs' | 'preferences' | 'help'
  const [subView, setSubView] = useState('main');

  // Preferences Fully Interactive Form States
  const [prefNotification, setPrefNotification] = useState(true);
  const [prefVibration, setPrefVibration] = useState(true);
  const [prefAudio, setPrefAudio] = useState(false);
  const [prefHighPriorityAlerts, setPrefHighPriorityAlerts] = useState(true);
  const [prefDarkMode, setPrefDarkMode] = useState(false);
  const [prefAutoRefresh, setPrefAutoRefresh] = useState(true);
  const [prefLanguage, setPrefLanguage] = useState('English');

  // Dynamic user context strings with production-level fallbacks
  const profileName = user?.name || "Rohan Sharma";
  const profileEmail = user?.phoneNumber || "91+ 987654321";
  const profilePhone = user?.email || "customer@demo.com";

  const handleSignOutClick = () => {
    if (logout) logout();
    navigate('/login', { replace: true });
  };

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

        /* Profile Top Header Presentation */
        .profile-banner-header {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 35px 20px 30px 20px;
          text-align: center;
          color: #ffffff;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(74, 35, 182, 0.12);
        }

        .subview-navbar {
          display: flex;
          align-items: center;
          padding: 20px 16px;
          border-bottom: 1px solid #f3f4f6;
          background: #ffffff;
          flex-shrink: 0;
        }

        .back-arrow-btn {
          background: none;
          border: none;
          color: #1f2937;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          display: flex;
        }

        .subview-title {
          font-size: 17px;
          font-weight: 700;
          color: #1f2937;
          margin-left: 12px;
        }

        .avatar-circle-frame {
          width: 84px;
          height: 84px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: 2px solid #ffffff;
          border-radius: 50%;
          margin: 0 auto 14px auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .profile-banner-header h2 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .profile-banner-header p {
          font-size: 13.5px;
          opacity: 0.85;
        }

        /* Scrollable Options Settings Body */
        .scrollable-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f9fafb;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollable-body::-webkit-scrollbar { display: none; }

        .setting-nav-row {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .setting-nav-row:active {
          transform: scale(0.99);
          background: #fafafa;
        }

        .row-left-group { display: flex; align-items: center; gap: 14px; }
        .row-icon-box { color: #6d28d9; display: flex; align-items: center; font-size: 20px; }
        .row-left-group span { font-size: 14.5px; font-weight: 600; color: #374151; }
        .chevron-indicator { color: #9ca3af; font-size: 12px; }

        .logout-row-btn { border-color: #fee2e2; background: #fffbfa; margin-top: 8px; }
        .logout-row-btn .row-icon-box, .logout-row-btn span { color: #ef4444; }

        /* Form Subview Block Layouts */
        .details-card {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-field-node {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-field-node label {
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-field-node p {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
        }

        /* ID Proof Status Badges */
        .proof-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge-verified { background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5; }
        .badge-pending { background: #fff7ed; color: #f97316; border: 1px solid #ffedd5; }

        .btn-add-proof {
          background: #f5f3ff;
          border: 1px dashed #6d28d9;
          color: #6d28d9;
          border-radius: 16px;
          height: 50px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        /* Interactive Switch Mechanics */
        .toggle-switch-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 16px;
        }

        .toggle-switch-wrapper span {
          font-size: 14.5px;
          font-weight: 600;
          color: #374151;
        }

        .custom-toggle-rail {
          width: 46px;
          height: 24px;
          background: #e5e7eb;
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
        }

        .custom-toggle-rail.active-rail { background: #10b981; }
        .toggle-thumb-ball {
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 4px;
          transition: left 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .custom-toggle-rail.active-rail .toggle-thumb-ball { left: 24px; }

        /* Help Support Accordion Blocks */
        .section-headline {
          font-size: 13px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 12px 0 4px 2px;
        }

        .faq-accordion-box {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 16px;
        }
        .faq-accordion-box h4 { font-size: 14px; font-weight: 700; color: #1f2937; margin-bottom: 6px; }
        .faq-accordion-box p { font-size: 13px; color: #6b7280; line-height: 1.5; }

        /* Bottom Fixed Navigation Grid Layout */
        .fixed-bottom-nav {
          height: 68px;
          background: #ffffff;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-shrink: 0;
          padding-bottom: env(safe-area-inset-bottom);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          width: 33.33%;
          height: 100%;
          justify-content: center;
        }
        .nav-item.active { color: #6d28d9; }
      `}</style>

      <div className="mobile-layout">
        
        {/* VIEW A: MAIN PROFILE TREE OVERLAY */}
        {subView === 'main' && (
          <>
            <div className="profile-banner-header">
              <div className="avatar-circle-frame">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2>{profileName}</h2>
              <p>{profilePhone}</p>
            </div>

            <div className="scrollable-body">
              <div className="setting-nav-row" onClick={() => setSubView('personal')}>
                <div className="row-left-group">
                  <div className="row-icon-box">👤</div>
                  <span>Personal Details</span>
                </div>
                <div className="chevron-indicator">▶</div>
              </div>

              <div className="setting-nav-row" onClick={() => setSubView('id-proofs')}>
                <div className="row-left-group">
                  <div className="row-icon-box">🪪</div>
                  <span>ID Proofs</span>
                </div>
                <div className="chevron-indicator">▶</div>
              </div>

              <div className="setting-nav-row" onClick={() => setSubView('preferences')}>
                <div className="row-left-group">
                  <div className="row-icon-box">⚙️</div>
                  <span>Preferences</span>
                </div>
                <div className="chevron-indicator">▶</div>
              </div>

              <div className="setting-nav-row" onClick={() => setSubView('help')}>
                <div className="row-left-group">
                  <div className="row-icon-box">💬</div>
                  <span>Help & Support</span>
                </div>
                <div className="chevron-indicator">▶</div>
              </div>

              <div className="setting-nav-row logout-row-btn" onClick={handleSignOutClick}>
                <div className="row-left-group">
                  <div className="row-icon-box">🚪</div>
                  <span>Logout Account</span>
                </div>
                <div className="chevron-indicator">▶</div>
              </div>
            </div>

            <div className="fixed-bottom-nav">
              <button className="nav-item" onClick={() => navigate('/')}><span>Home</span></button>
              <button className="nav-item" onClick={() => navigate('/history')}><span>History</span></button>
              <button className="nav-item active" onClick={() => navigate('/profile')}><span>Profile</span></button>
            </div>
          </>
        )}

        {/* VIEW B: PERSONAL PROFILE SUB-VIEW */}
        {subView === 'personal' && (
          <>
            <div className="subview-navbar">
              <button className="back-arrow-btn" onClick={() => setSubView('main')}>←</button>
              <h2 className="subview-title">Personal Details</h2>
            </div>
            <div className="scrollable-body">
              <div className="details-card">
                <div className="info-field-node"><label>Full Name</label><p>{profileName}</p></div>
                <div className="info-field-node"><label>Email Address</label><p>{profileEmail}</p></div>
                <div className="info-field-node"><label>Phone Number</label><p>{profilePhone}</p></div>
                <div className="info-field-node"><label>Registered State</label><p>Maharashtra, India</p></div>
                <div className="info-field-node"><label>Membership Class</label><p>Standard Node Tier</p></div>
              </div>
            </div>
          </>
        )}

        {/* VIEW C: FULL ID PROOFS CATALOG PANELS */}
        {subView === 'id-proofs' && (
          <>
            <div className="subview-navbar">
              <button className="back-arrow-btn" onClick={() => setSubView('main')}>←</button>
              <h2 className="subview-title">ID Proof Documents</h2>
            </div>
            <div className="scrollable-body">
              <div className="setting-nav-row" style={{ cursor: 'default' }}>
                <div className="row-left-group">
                  <div className="row-icon-box">💳</div>
                  <div>
                    <span style={{ fontSize: '14.5px', display: 'block', fontWeight: 600 }}>Aadhaar Card</span>
                    <small style={{ color: '#9ca3af', fontWeight: 600 }}>XXXX XXXX 4321</small>
                  </div>
                </div>
                <span className="proof-badge badge-verified">Verified</span>
              </div>

              <div className="setting-nav-row" style={{ cursor: 'default' }}>
                <div className="row-left-group">
                  <div className="row-icon-box">📋</div>
                  <div>
                    <span style={{ fontSize: '14.5px', display: 'block', fontWeight: 600 }}>PAN Card</span>
                    <small style={{ color: '#9ca3af', fontWeight: 600 }}>ABCDEXXXXF</small>
                  </div>
                </div>
                <span className="proof-badge badge-verified">Verified</span>
              </div>

              <div className="setting-nav-row" style={{ cursor: 'default' }}>
                <div className="row-left-group">
                  <div className="row-icon-box">📕</div>
                  <div>
                    <span style={{ fontSize: '14.5px', display: 'block', fontWeight: 600 }}>Passport (International)</span>
                    <small style={{ color: '#9ca3af', fontWeight: 600 }}>ZXXXXXX9</small>
                  </div>
                </div>
                <span className="proof-badge badge-pending">Pending Review</span>
              </div>

              <button className="btn-add-proof" onClick={() => alert("Launching Secure Document Camera Uploader Module...")}>
                ➕ Upload Another ID Document
              </button>
            </div>
          </>
        )}

        {/* VIEW D: EXTENDED PREFERENCES SELECTION INPUTS */}
        {subView === 'preferences' && (
          <>
            <div className="subview-navbar">
              <button className="back-arrow-btn" onClick={() => setSubView('main')}>←</button>
              <h2 className="subview-title">App Preferences</h2>
            </div>
            <div className="scrollable-body">
              <h3 className="section-headline">Alert Profiles</h3>
              <div className="toggle-switch-wrapper">
                <span>Push Notifications</span>
                <div className={`custom-toggle-rail ${prefNotification ? 'active-rail' : ''}`} onClick={() => setPrefNotification(!prefNotification)}>
                  <div className="toggle-thumb-ball"></div>
                </div>
              </div>

              <div className="toggle-switch-wrapper">
                <span>Vibration Intervals</span>
                <div className={`custom-toggle-rail ${prefVibration ? 'active-rail' : ''}`} onClick={() => setPrefVibration(!prefVibration)}>
                  <div className="toggle-thumb-ball"></div>
                </div>
              </div>

              <div className="toggle-switch-wrapper">
                <span>Audio Announcements Voice</span>
                <div className={`custom-toggle-rail ${prefAudio ? 'active-rail' : ''}`} onClick={() => setPrefAudio(!prefAudio)}>
                  <div className="toggle-thumb-ball"></div>
                </div>
              </div>

              <div className="toggle-switch-wrapper">
                <span>High Urgent Proximity Prompts</span>
                <div className={`custom-toggle-rail ${prefHighPriorityAlerts ? 'active-rail' : ''}`} onClick={() => setPrefHighPriorityAlerts(!prefHighPriorityAlerts)}>
                  <div className="toggle-thumb-ball"></div>
                </div>
              </div>

              <h3 className="section-headline">Display Profiles</h3>
              <div className="toggle-switch-wrapper">
                <span>Dark Appearance Theme</span>
                <div className={`custom-toggle-rail ${prefDarkMode ? 'active-rail' : ''}`} onClick={() => setPrefDarkMode(!prefDarkMode)}>
                  <div className="toggle-thumb-ball"></div>
                </div>
              </div>

              <div className="toggle-switch-wrapper">
                <span>Background Thread Auto-Refresh</span>
                <div className={`custom-toggle-rail ${prefAutoRefresh ? 'active-rail' : ''}`} onClick={() => setPrefAutoRefresh(!prefAutoRefresh)}>
                  <div className="toggle-thumb-ball"></div>
                </div>
              </div>

              <div className="toggle-switch-wrapper">
                <span>System Translation Profile</span>
                <select value={prefLanguage} onChange={(e) => setPrefLanguage(e.target.value)} style={{ border: 'none', background: 'none', fontSize: '14px', fontWeight: 600, color: '#6d28d9', outline: 'none', cursor: 'pointer' }}>
                  <option value="English">English (US)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* VIEW E: HIGHLY DETAILED HELP & SUPPORT LOGS */}
        {subView === 'help' && (
          <>
            <div className="subview-navbar">
              <button className="back-arrow-btn" onClick={() => setSubView('main')}>←</button>
              <h2 className="subview-title">Help & Support</h2>
            </div>
            <div className="scrollable-body">
              <h3 className="section-headline">Frequently Asked Questions</h3>
              
              <div className="faq-accordion-box">
                <h4>How do I check-in via QR?</h4>
                <p>Open the camera module from your Home screen, center the partner kiosk floor QR graphic, and your system slot voucher will formulate automatically.</p>
              </div>

              <div className="faq-accordion-box">
                <h4>Can I transition out of a live token lane?</h4>
                <p>Yes, navigate inside your Active Live Status module panel and hit 'Cancel Ticket'. This clears your placeholder coordinates instantly.</p>
              </div>

              <div className="faq-accordion-box">
                <h4>What happens if my connection breaks mid-queue?</h4>
                <p>Don't worry, the local database tracks your position. Once your internet recovers, WebSocket links hook back up to reveal your correct, live remaining wait index.</p>
              </div>

              <div className="faq-accordion-box">
                <h4>How does priority routing work?</h4>
                <p>Priority lane allocation is strictly mapped for Senior Citizens, pregnant women, and custom accessibility profiles verified by physical counter supervisors.</p>
              </div>

              <h3 className="section-headline">Direct Helpdesk Lines</h3>
              <div className="details-card" style={{ background: '#f5f3ff', borderColor: '#ddd6fe', textAlign: 'center' }}>
                <p style={{ fontSize: '13.5px', color: '#6d28d9', fontWeight: 700, marginBottom: '2px' }}>Still facing trouble?</p>
                <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Our technical operations support desk runs 24/7.</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>support@smartqueue.com</div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Profile;