import React, { useState } from 'react';

export default function BestTimeGraph() {
  const [activeDay, setActiveDay] = useState('Today');
  
  // High-fidelity hourly data dictionary representing different traffic conditions per day profile
  const datasets = {
    Today: [
      { hour: '9 AM', load: 35, usual: 30, status: 'Clear' },
      { hour: '11 AM', load: 85, usual: 65, status: 'Busy' },
      { hour: '1 PM', load: 95, usual: 80, status: 'Peak' },
      { hour: '3 PM', load: 55, usual: 70, status: 'Moderate' },
      { hour: '5 PM', load: 40, usual: 50, status: 'Clear' },
      { hour: '7 PM', load: 20, usual: 25, status: 'Empty' }
    ],
    Tomorrow: [
      { hour: '9 AM', load: 60, usual: 45, status: 'Moderate' },
      { hour: '11 AM', load: 50, usual: 55, status: 'Moderate' },
      { hour: '1 PM', load: 70, usual: 75, status: 'Busy' },
      { hour: '3 PM', load: 90, usual: 85, status: 'Peak' },
      { hour: '5 PM', load: 65, usual: 60, status: 'Busy' },
      { hour: '7 PM', load: 30, usual: 30, status: 'Clear' }
    ]
  };

  // Select the active ledger source array matching the selected state key
  const activeDataset = datasets[activeDay];

  return (
    <div className="analytics-card-frame">
      <style>{`
        .analytics-card-frame {
          background: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px;
          padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 16px;
        }
        .analytics-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .analytics-title { font-size: 15px; font-weight: 800; color: #111827; }
        
        .day-toggle-pill-group { display: flex; background: #f3f4f6; padding: 3px; border-radius: 10px; gap: 4px; }
        .day-pill {
          border: none; background: none; font-size: 11.5px; font-weight: 700;
          padding: 5px 12px; border-radius: 8px; cursor: pointer; color: #6b7280;
          transition: all 0.2s;
        }
        .day-pill.active-pill { background: #ffffff; color: #6d28d9; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }

        .legend-strip {
          display: flex; gap: 12px; font-size: 11px; font-weight: 600; color: #6b7280;
          margin-bottom: 16px; padding-left: 2px;
        }
        .legend-item { display: flex; align-items: center; gap: 4px; }
        .legend-color-box { width: 12px; height: 12px; border-radius: 3px; }
        .legend-line-sample { width: 16px; height: 3px; background: #94a3b8; border-radius: 2px; }

        .bar-chart-container { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-end; 
          height: 140px; 
          padding: 10px 0; 
          margin-bottom: 14px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .chart-column-node { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: flex-end;
          gap: 8px; 
          width: 40px; 
          height: 100%;
          position: relative;
        }
        
        .interactive-load-bar {
          width: 24px; 
          border-top-left-radius: 6px; 
          border-top-right-radius: 6px; 
          background: #e5e7eb; 
          position: relative;
          cursor: pointer; 
          transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s;
          z-index: 5;
        }
        .interactive-load-bar:hover { 
          filter: brightness(0.9); 
          transform: translateY(-1px);
        }

        /* 🟢 NEW FEATURE: USUAL VISITING HOURS INDICATOR LINE BLOCK OVERLAY */
        .usual-baseline-marker {
          position: absolute;
          width: 28px;
          height: 3px;
          background: #94a3b8;
          border-radius: 2px;
          z-index: 10;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        
        .bar-load-clear { background: linear-gradient(to top, #10b981, #34d399); }
        .bar-load-moderate { background: linear-gradient(to top, #3b82f6, #60a5fa); }
        .bar-load-busy { background: linear-gradient(to top, #f59e0b, #fbbf24); }
        .bar-load-peak { background: linear-gradient(to top, #ef4444, #f87171); }

        .axis-hour-label { font-size: 10px; font-weight: 700; color: #9ca3af; white-space: nowrap; margin-top: 4px; }

        .smart-suggestion-box {
          background: #f5f3ff; border: 1px solid #e0d7ff; border-radius: 14px;
          padding: 12px; display: flex; gap: 10px; align-items: center;
        }
        .smart-suggestion-box span { font-size: 18px; }
        .smart-suggestion-box p { font-size: 12px; font-weight: 600; color: #5b21b6; line-height: 1.4; }
      `}</style>

      <div className="analytics-header-row">
        <h3 className="analytics-title">📊 Peak Hours Forecast</h3>
        <div className="day-toggle-pill-group">
          <button className={`day-pill ${activeDay === 'Today' ? 'active-pill' : ''}`} onClick={() => setActiveDay('Today')}>Today</button>
          <button className={`day-pill ${activeDay === 'Tomorrow' ? 'active-pill' : ''}`} onClick={() => setActiveDay('Tomorrow')}>Tomorrow</button>
        </div>
      </div>

      {/* 🟢 LEGEND GUIDE INDICATOR STRIP */}
      <div className="legend-strip">
        <div className="legend-item">
          <div className="legend-color-box bar-load-clear" style={{width: '10px', height: '10px'}}></div>
          <span>Live Rush</span>
        </div>
        <div className="legend-item">
          <div className="legend-line-sample"></div>
          <span>Normally (Usual Trend)</span>
        </div>
      </div>

      {/* Render Dynamic Live Grid Pillars */}
      <div className="bar-chart-container">
        {activeDataset.map((node, index) => {
          const loadTypeClass = node.load > 80 ? 'bar-load-peak' : node.load > 60 ? 'bar-load-busy' : node.load > 25 ? 'bar-load-moderate' : 'bar-load-clear';
          
          // Absolute bottom placement calibration formula mapping 
          // 140px is max chart height space, 10px handles baseline buffer offsets
          const usualBottomOffset = (node.usual / 100) * 120 + 4;

          return (
            <div className="chart-column-node" key={index}>
              {/* USUAL BASELINE LEVEL HORIZONTAL TICK INDICATOR */}
              <div 
                className="usual-baseline-marker" 
                style={{ bottom: `${usualBottomOffset}px` }}
                title={`Normally at ${node.hour}: ${node.usual}% traffic`}
              />

              {/* LIVE COUNTER BAR NODE */}
              <div 
                className={`interactive-load-bar ${loadTypeClass}`} 
                style={{ height: `${node.load}%` }}
                title={`Live Load at ${node.hour}: ${node.load}% (${node.status})`}
              />
              <span className="axis-hour-label">{node.hour}</span>
            </div>
          );
        })}
      </div>

      <div className="smart-suggestion-box">
        <span>💡</span>
        {activeDay === 'Today' ? (
          <p><strong>Live Recommendation:</strong> Current live rush is <strong>higher than usual</strong> by 15%. Heading out around <strong>5 PM</strong> instead will save you approximately <strong>22 minutes</strong>.</p>
        ) : (
          <p><strong>Tomorrow Outlook:</strong> Heavy peak load expected during mid-afternoon (3 PM) due to backlog clearance. Best window to visit manually is early morning <strong>9 AM</strong>.</p>
        )}
      </div>
    </div>
  );
}