import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TokenConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve data from router state context or initialize realistic defaults
  const tokenDetails = location.state || {
    tokenNumber: 'A-284',
    venueName: 'Max Care Hospital',
    queueType: 'Regular Line Tier',
    estimatedWait: '20 - 25 mins',
    initialWaitingCount: 14
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

        .scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 30px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f9fafb;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .scrollable-body::-webkit-scrollbar { display: none; }

        /* Success Spark Head Ring */
        .success-checkmark-circle {
          width: 60px; height: 60px; background: #d1fae5; color: #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 24px; margin-bottom: 16px;
        }

        .headline-success { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 6px; text-align: center; }
        .subheadline-success { font-size: 14px; color: #6b7280; text-align: center; margin-bottom: 24px; font-weight: 500; }

        /* High-Contrast Token Voucher Blueprint Card */
        .voucher-ticket-frame {
          width: 100%; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.02); text-align: center; position: relative; margin-bottom: 24px;
        }

        .voucher-venue-title { font-size: 15px; font-weight: 700; color: #4b5563; margin-bottom: 2px; }
        .voucher-tier-tag { font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; }

        .voucher-token-id-display {
          font-size: 48px; font-weight: 800; color: #4a23b6; line-height: 1; margin-bottom: 6px; letter-spacing: -1px;
        }
        .voucher-token-label { font-size: 12px; font-weight: 700; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 24px; }

        .dashed-divider-line { width: 100%; border-top: 2px dashed #e5e7eb; margin: 4px 0 20px 0; }

        .specs-grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left; }
        .spec-cell { display: flex; flex-direction: column; gap: 4px; }
        .spec-cell label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; }
        .spec-cell p { font-size: 14px; font-weight: 700; color: #1f2937; }

        /* Core Call To Action Button Link Trigger */
        .btn-track-live-queue {
          width: 100%; background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%); color: #ffffff; border: none; border-radius: 16px; height: 54px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 6px 18px rgba(74, 35, 182, 0.15); transition: transform 0.15s ease;
        }
        .btn-track-live-queue:active { transform: scale(0.99); }
      `}</style>

      <div className="mobile-layout">
        <div className="scrollable-body">
          
          <div className="success-checkmark-circle">✓</div>
          <h1 className="headline-success">Booking Confirmed!</h1>
          <p className="subheadline-success">Your position inside the queue lane server is secured.</p>

          {/* Ticket Voucher Blueprint Box Area */}
          <div className="voucher-ticket-frame">
            <h3 className="voucher-venue-title">{tokenDetails.venueName}</h3>
            <div className="voucher-tier-tag">{tokenDetails.queueType}</div>

            {/* Displays unique randomized output explicitly */}
            <div className="voucher-token-id-display">{tokenDetails.tokenNumber}</div>
            <div className="voucher-token-label">Your Token Number</div>

            <div className="dashed-divider-line"></div>

            <div className="specs-grid-row">
              <div className="spec-cell">
                <label>Estimated Wait</label>
                <p style={{ color: '#10b981' }}>{tokenDetails.estimatedWait}</p>
              </div>
              <div className="spec-cell">
                <label>People Ahead</label>
                <p>{tokenDetails.initialWaitingCount} Customers</p>
              </div>
            </div>
          </div>

          <button className="btn-track-live-queue" onClick={() => navigate('/live-queue')}>
            <span>Track Live Position</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

        </div>
      </div>
    </div>
  );
}