import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BestTimeGraph from '../components/BestTimeGraph';

export default function SelectQueueType() {
  const navigate = useNavigate();
  const { venueId } = useParams();

  // Search Input & Selection Flow States
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingQueueType, setPendingQueueType] = useState(null);
  const [overrideVenueName, setOverrideVenueName] = useState('');

  const staticLocationsPool = [
    { id: 'max-care-789', name: 'Max Care Hospital', category: 'Medical & Healthcare', distance: '0.8 km' },
    { id: 'hdfc-bank-111', name: 'HDFC Bank - Main Branch', category: 'Banking & Finance', distance: '1.2 km' },
    { id: 'rto-office-444', name: 'Regional RTO Office', category: 'Government Service', distance: '2.5 km' },
    { id: 'airtel-store-002', name: 'Airtel Digital Store', category: 'Telecom & Tech Store', distance: '3.1 km' },
    { id: 'apollo-pharmacy-88', name: 'Apollo Pharmacy 24/7', category: 'Medical & Healthcare', distance: '3.7 km' },
    { id: 'reliance-digital-9', name: 'Reliance Digital Hub', category: 'Electronics & Retail', distance: '4.3 km' }
  ];

  const getVenueDisplayName = (id) => {
    if (overrideVenueName) return overrideVenueName;
    if (id?.includes('max-care')) return 'Max Care Hospital';
    if (id?.includes('hdfc-bank')) return 'HDFC Bank - Main Branch';
    if (id?.includes('rto-office')) return 'Regional RTO Office';
    if (id?.includes('airtel-store')) return 'Airtel Digital Store';
    return 'Manual Search Directory';
  };

  const filteredDirectoryItems = staticLocationsPool.filter(place =>
    place.name.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
    place.category.toLowerCase().includes(manualSearchQuery.toLowerCase())
  );

  const handleCardClickPrompt = (queueCategoryType, selectedPlaceName = '') => {
    if (selectedPlaceName) {
      setOverrideVenueName(selectedPlaceName);
    }
    setPendingQueueType(queueCategoryType);
    setShowConfirmModal(true);
  };

  const handleConfirmAndJoin = () => {
    setShowConfirmModal(false);
    if (!pendingQueueType) return;

    const prefixLetter = pendingQueueType === 'priority' ? 'P' : 'A';
    const randomizedDigits = Math.floor(100 + Math.random() * 900);
    const uniqueGeneratedToken = `${prefixLetter}-${randomizedDigits}`;

    const mockNavigationPayload = {
      tokenNumber: uniqueGeneratedToken,
      venueName: getVenueDisplayName(venueId),
      queueType: pendingQueueType === 'priority' ? 'Priority Line Tier' : 'Regular Line Tier',
      estimatedWait: pendingQueueType === 'priority' ? '8 - 12 mins' : '20 - 25 mins',
      initialWaitingCount: pendingQueueType === 'priority' ? 3 : 14
    };

    navigate('/token-confirmed', { state: mockNavigationPayload });
  };

  const isManualDirectoryRoute = venueId === 'manual-venue-001' || !venueId;

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
          width: 100%; max-width: 410px; height: 100%;
          background: #ffffff; display: flex; flex-direction: column; position: relative; overflow: hidden;
        }

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

        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 24px 20px 56px 20px; display: flex; flex-direction: column; gap: 18px; background: #ffffff;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .manual-search-wrapper {
          display: flex; align-items: center; background: #f1f3f7; border-radius: 14px; padding: 0 16px; height: 52px; transition: all 0.2s;
        }
        .manual-search-wrapper:focus-within { background: #ffffff; border-color: #5e4ae3; box-shadow: 0 0 0 4px rgba(94, 74, 227, 0.1); }
        .manual-search-wrapper input { border: none; outline: none; width: 100%; height: 100%; font-size: 14.5px; color: #1f2235; font-weight: 600; background: transparent; }
        .manual-search-wrapper input::placeholder { color: #9da3b4; font-weight: 500; }

        .venue-indicator-card { background: #f1f3f7; border-radius: 18px; padding: 18px 20px; text-align: left; border: 1px solid transparent; }
        .venue-indicator-card span { font-size: 11px; font-weight: 700; color: #7e849c; text-transform: uppercase; display: block; margin-bottom: 2px; letter-spacing: 0.4px; }
        .venue-indicator-card h2 { font-size: 20px; font-weight: 800; color: #1f2235; tracking: -0.3px; }

        .section-prompt { font-size: 11px; font-weight: 700; color: #9ca3b4; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: -6px; padding-left: 2px; }

        .directory-result-node { background: #ffffff; border: 1px solid #f1f3f7; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
        .node-info-block h4 { font-size: 15.5px; font-weight: 700; color: #1f2235; margin-bottom: 2px; }
        .node-info-block p { font-size: 12.5px; color: #7e849c; font-weight: 500; }

        .quick-action-split-row { display: flex; gap: 10px; }
        .btn-quick-join { flex: 1; height: 42px; border-radius: 12px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: background-color 0.2s; }
        .btn-join-regular { background: #eedffa; color: #5e4ae3; }
        .btn-join-regular:hover { background: #e3ceff; }
        .btn-join-priority { background: #fff1e7; color: #ea580c; }
        .btn-join-priority:hover { background: #ffe3d5; }

        .category-select-card { background: #ffffff; border: 1px solid #f1f3f7; border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.01); transition: border-color 0.2s, background-color 0.2s; }
        .category-select-card:active { border-color: rgba(94, 74, 227, 0.15); background: #fdfbfe; }
        .card-left-specs { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .tier-label-name { font-size: 16px; font-weight: 700; color: #1f2235; }
        .tier-subtext-descript { font-size: 13px; color: #7e849c; line-height: 1.4; font-weight: 500; }
        
        .metric-badge-pill { font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 8px; display: inline-block; width: fit-content; margin-top: 2px; }
        .pill-regular { background: #e6f0ff; color: #3b82f6; }
        .pill-priority { background: #fff1e7; color: #ea580c; }
        .arrow-action-node { color: #a3a9c2; flex-shrink: 0; margin-left: 12px; display: flex; align-items: center; }

        /* 🎟️ DYNAMIC PREMIUM MODAL */
        .modal-blur-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 9, 20, 0.4); backdrop-filter: blur(5px); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .pop-up-container-box { width: 100%; max-width: 360px; background: #ffffff; border-radius: 28px; padding: 28px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.15); animation: popScaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popScaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        /* Modal dynamic tier header styling color states depending on choice selection */
        .pop-up-icon-box { width: 56px; height: 56px; background: #eedffa; color: #5e4ae3; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; margin: 0 auto 16px auto; }
        .pop-up-container-box.priority-selected .pop-up-icon-box { background: #fff1e7; color: #ea580c; }
        
        .pop-up-container-box h4 { font-size: 19px; font-weight: 800; color: #1f2235; margin-bottom: 6px; }
        .pop-up-container-box p { font-size: 13.5px; color: #7e849c; line-height: 1.5; margin-bottom: 20px; font-weight: 500; }
        
        /* Modal dynamic spec matrix blocks */
        .modal-data-preview-badge { display: flex; justify-content: space-around; background: #f1f3f7; padding: 12px 8px; border-radius: 14px; margin-bottom: 24px; gap: 4px; }
        .badge-data-segment { display: flex; flex-direction: column; align-items: center; width: 50%; }
        .badge-data-segment .label-top-tag { font-size: 10px; font-weight: 700; color: #7e849c; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
        .badge-data-segment .value-bold { font-size: 14px; font-weight: 800; color: #1f2235; }

        .modal-action-btn-group { display: flex; flex-direction: column; gap: 10px; }
        .btn-modal-confirm { width: 100%; background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%); color: #ffffff; border: none; border-radius: 14px; height: 50px; font-size: 14.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(109, 40, 217, 0.25); }
        .btn-modal-cancel { width: 100%; background: #f1f3f7; color: #4a4d61; border: none; border-radius: 14px; height: 50px; font-size: 14.5px; font-weight: 700; cursor: pointer; }
      `}</style>

      <div className="mobile-layout">
        
        {/* 🎟️ DYNAMIC COUNTER PREVIEW POPUP SYSTEM */}
        {showConfirmModal && (
          <div className="modal-blur-overlay">
            <div className={`pop-up-container-box ${pendingQueueType === 'priority' ? 'priority-selected' : ''}`}>
              <div className="pop-up-icon-box">
                {pendingQueueType === 'priority' ? '⭐' : '🎟️'}
              </div>
              <h4>Join {pendingQueueType === 'priority' ? 'Priority Tier' : 'Standard Tier'}</h4>
              <p>Confirm booking ticket entry at <strong>{getVenueDisplayName(venueId)}</strong>. Your live position log will register immediately.</p>
              
              {/* Dynamic Context Parameters Layer Block */}
              <div className="modal-data-preview-badge">
                <div className="badge-data-segment" style={{ borderRight: '1px solid #e2e4ee' }}>
                  <span className="label-top-tag">Expected Wait</span>
                  <span className="value-bold" style={{ color: pendingQueueType === 'priority' ? '#ea580c' : '#3b82f6' }}>
                    {pendingQueueType === 'priority' ? '8-12 Mins' : '20-25 Mins'}
                  </span>
                </div>
                <div className="badge-data-segment">
                  <span className="label-top-tag">Tokens In Line</span>
                  <span className="value-bold">
                    {pendingQueueType === 'priority' ? '3 Active' : '14 Active'}
                  </span>
                </div>
              </div>

              <div className="modal-action-btn-group">
                <button className="btn-modal-confirm" onClick={handleConfirmAndJoin}>Yes, Join Queue</button>
                <button className="btn-modal-cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <div className="top-navbar">
          <button className="back-arrow-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="navbar-title">{isManualDirectoryRoute ? "Select Manually" : "Select Queue Type"}</h2>
        </div>

        <div className="scrollable-body">
          {isManualDirectoryRoute ? (
            <>
              <div className="manual-search-wrapper">
                <input type="text" placeholder="Search branch location or keywords..." value={manualSearchQuery} onChange={(e) => setManualSearchQuery(e.target.value)} />
              </div>
              
              <BestTimeGraph />

              <h3 className="section-prompt">Search Results ({filteredDirectoryItems.length})</h3>
              {filteredDirectoryItems.length > 0 ? (
                filteredDirectoryItems.map((place) => (
                  <div className="directory-result-node" key={place.id}>
                    <div className="node-info-block">
                      <h4>{place.name}</h4>
                      <p>{place.category} • {place.distance} away</p>
                    </div>
                    <div className="quick-action-split-row">
                      <button className="btn-quick-join btn-join-regular" onClick={() => handleCardClickPrompt('normal', place.name)}>Standard</button>
                      <button className="btn-quick-join btn-join-priority" onClick={() => handleCardClickPrompt('priority', place.name)}>⭐ Priority</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#9da3b4', fontSize: '14px', fontWeight: 500 }}>No branches discovered.</div>
              )}
            </>
          ) : (
            <>
              <div className="venue-indicator-card">
                <span>You are checking into</span>
                <h2>{getVenueDisplayName(venueId)}</h2>
              </div>

              <BestTimeGraph />

              <h3 className="section-prompt">Available Counters</h3>
              
              <div className="category-select-card" onClick={() => handleCardClickPrompt('normal')}>
                <div className="card-left-specs">
                  <div className="tier-label-name">Standard Counter</div>
                  <p className="tier-subtext-descript">General inquiries and standard service checkouts.</p>
                  <div className="metric-badge-pill pill-regular">Avg Wait: ~20 mins</div>
                </div>
                <div className="arrow-action-node">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>

              <div className="category-select-card" onClick={() => handleCardClickPrompt('priority')}>
                <div className="card-left-specs">
                  <div className="tier-label-name">⭐ Priority Counter</div>
                  <p className="tier-subtext-descript">Reserved exclusively for Senior Citizens or physical assistance.</p>
                  <div className="metric-badge-pill pill-priority">Avg Wait: ~8 mins</div>
                </div>
                <div className="arrow-action-node">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}