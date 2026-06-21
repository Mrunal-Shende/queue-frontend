import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BestTimeGraph from '../components/BestTimeGraph'; // 🟢 INJECTED FOR DISCOVERY

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
          width: 100vw; height: 100vh; height: 100dvh; background-color: #f8f9fa;
          font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; overflow: hidden;
        }

        .mobile-layout {
          width: 100%; max-width: 480px; height: 100%; background: #ffffff; display: flex; flex-direction: column; position: relative; overflow: hidden;
        }

        .top-navbar {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 20px 16px; display: flex; align-items: center; color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(74, 35, 182, 0.15); border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; flex-shrink: 0;
        }

        .back-arrow-btn {
          background: rgba(255, 255, 255, 0.15); border: none; color: #ffffff !important;
          cursor: pointer; padding: 8px; border-radius: 12px; display: flex; backdrop-filter: blur(4px);
        }
        .navbar-title { font-size: 18px; font-weight: 700; color: #ffffff !important; margin-left: 14px; flex-grow: 1; letter-spacing: -0.3px; }

        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; background: #f9fafb;
          margin-bottom: 68px; -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        .manual-search-wrapper {
          display: flex; align-items: center; background: #ffffff; border-radius: 14px; padding: 0 14px; border: 1px solid #e5e7eb; margin-bottom: 4px;
        }
        .manual-search-wrapper input { border: none; outline: none; width: 100%; height: 46px; font-size: 14px; color: #1f2937; font-family: inherit; }

        .venue-indicator-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 18px; padding: 18px; text-align: center; }
        .venue-indicator-card span { font-size: 11px; font-weight: 700; color: #6d28d9; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .venue-indicator-card h2 { font-size: 18px; font-weight: 800; color: #111827; }

        .section-prompt { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: -4px; padding-left: 2px; }

        .directory-result-node { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .node-info-block h4 { font-size: 15.5px; font-weight: 700; color: #111827; }
        .node-info-block p { font-size: 12px; color: #6b7280; }

        .quick-action-split-row { display: flex; gap: 10px; }
        .btn-quick-join { flex: 1; height: 38px; border-radius: 10px; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer; }
        .btn-join-regular { background: #f5f3ff; color: #6d28d9; }
        .btn-join-priority { background: #fff7ed; color: #ea580c; }

        .category-select-card { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 20px; padding: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
        .card-left-specs { display: flex; flex-direction: column; gap: 4px; }
        .tier-label-name { font-size: 16px; font-weight: 700; color: #111827; }
        .tier-subtext-descript { font-size: 13px; color: #6b7280; }
        .metric-badge-pill { font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 10px; display: inline-block; }
        .pill-regular { background: #eff6ff; color: #3b82f6; }
        .pill-priority { background: #fff7ed; color: #ea580c; }

        .modal-blur-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 9, 20, 0.4); backdrop-filter: blur(4px); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .pop-up-container-box { width: 100%; max-width: 380px; background: #ffffff; border-radius: 24px; padding: 24px; text-align: center; }
        .pop-up-icon-box { width: 52px; height: 52px; background: #f5f3ff; color: #6d28d9; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 22px; margin: 0 auto 16px auto; }
        .pop-up-container-box h4 { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 8px; }
        .pop-up-container-box p { font-size: 13.5px; color: #6b7280; line-height: 1.5; margin-bottom: 24px; }
        .modal-action-btn-group { display: flex; flex-direction: column; gap: 10px; }
        .btn-modal-confirm { width: 100%; background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%); color: #ffffff; border: none; border-radius: 14px; height: 48px; font-size: 14.5px; font-weight: 700; cursor: pointer; }
        .btn-modal-cancel { width: 100%; background: #f3f4f6; color: #4b5563; border: none; border-radius: 14px; height: 48px; font-size: 14.5px; font-weight: 600; cursor: pointer; }
      `}</style>

      <div className="mobile-layout">
        {showConfirmModal && (
          <div className="modal-blur-overlay">
            <div className="pop-up-container-box">
              <div className="pop-up-icon-box">🎟️</div>
              <h4>Confirm Queue Join</h4>
              <p>Are you sure you want to join the queue here at <strong>{getVenueDisplayName(venueId)}</strong>? This will generate your immediate slot voucher token.</p>
              <div className="modal-action-btn-group">
                <button className="btn-modal-confirm" onClick={handleConfirmAndJoin}>Yes, Join Queue</button>
                <button className="btn-modal-cancel" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="top-navbar">
          <button className="back-arrow-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2 className="navbar-title">{isManualDirectoryRoute ? "Select Manually" : "Select Queue Type"}</h2>
        </div>

        <div className="scrollable-body">
          {isManualDirectoryRoute ? (
            <>
              <div className="manual-search-wrapper">
                <input type="text" placeholder="Search branch location or keywords..." value={manualSearchQuery} onChange={(e) => setManualSearchQuery(e.target.value)} />
              </div>
              
              {/* 📊 FEATURE 1 CHART LOADED INSIDE DISCOVERY FILTER */}
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
                <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13.5px' }}>No branches discovered.</div>
              )}
            </>
          ) : (
            <>
              <div className="venue-indicator-card">
                <span>You are checking into</span>
                <h2>{getVenueDisplayName(venueId)}</h2>
              </div>

              {/* 📊 FEATURE 1 CHART LOADED INSIDE SPECIFIC CATEGORY VIEWS */}
              <BestTimeGraph />

              <h3 className="section-prompt">Available Counters</h3>
              <div className="category-select-card" onClick={() => handleCardClickPrompt('normal')}>
                <div className="card-left-specs">
                  <div className="tier-label-name">Standard Counter</div>
                  <p className="tier-subtext-descript">General inquiries and standard service checkouts.</p>
                  <div className="metric-badge-pill pill-regular">Avg Wait: ~20 mins</div>
                </div>
                <div>▶</div>
              </div>

              <div className="category-select-card" onClick={() => handleCardClickPrompt('priority')}>
                <div className="card-left-specs">
                  <div className="tier-label-name">⭐ Priority Counter</div>
                  <p className="tier-subtext-descript">Reserved exclusively for Senior Citizens or physical assistance.</p>
                  <div className="metric-badge-pill pill-priority">Avg Wait: ~8 mins</div>
                </div>
                <div>▶</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}