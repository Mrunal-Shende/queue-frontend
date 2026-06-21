import React, { useState } from 'react';

export default function HapticAccessibility() {
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // Trigger real mobile hardware vibration waveforms via browser layer API hooks
  const triggerSampleVibrationPattern = () => {
    if (navigator.vibrate) {
      // Custom double-pulse signature haptic rhythm
      navigator.vibrate([200, 100, 200]);
    } else {
      alert("Haptic pulse simulated on this dev browser profile!");
    }
  };

  // Trigger real browser layer textual speech synthesizer modules
  const triggerSampleAudioSpeech = () => {
    if ('speechSynthesis' in window) {
      const speechNode = new SpeechSynthesisUtterance("Attention. Your token number A- 23 is next in line at counter number 2.");
      speechNode.rate = 0.95;
      window.speechSynthesis.speak(speechNode);
    } else {
      alert("Speech synthesis simulation activated!");
    }
  };

  return (
    <div className="accessibility-panel-box">
      <style>{`
        .accessibility-panel-box {
          background: #ffffff; border: 1px solid #f3f4f6; border-radius: 24px;
          padding: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.01);
          font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 16px;
        }
        .access-title-block h4 { font-size: 14.5px; font-weight: 800; color: #111827; margin-bottom: 2px; }
        .access-title-block p { font-size: 12px; color: #6b7280; font-weight: 500; margin-bottom: 14px; }

        .control-toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-bottom: 1px solid #f3f4f6;
        }
        .control-toggle-row:last-of-type { border-bottom: none; }

        .label-group h5 { font-size: 13.5px; font-weight: 700; color: #1f2937; }
        .label-group span { font-size: 11.5px; color: #9ca3af; font-weight: 500; }

        /* Custom Interactive Button Pushes */
        .btn-test-trigger {
          border: none; border-radius: 10px; font-size: 11.5px; font-weight: 700;
          padding: 6px 12px; cursor: pointer; transition: background 0.2s;
        }
        .btn-active-state { background: #f5f3ff; color: #6d28d9; border: 1px solid #ccd; }
        .btn-inactive-state { background: #f3f4f6; color: #6b7280; }
      `}</style>

      <div className="access-title-block">
        <h4>🔊 Priority Assistance Accessibility Controls</h4>
        <p>Custom haptic navigation nodes built for visually impaired or senior citizen layers.</p>
      </div>

      {/* Control 1: Haptic Vibration Trigger */}
      <div className="control-toggle-row">
        <div className="label-group">
          <h5>Rhythmic Pulse Vibration</h5>
          <span>Vibrates phone as queue decreases</span>
        </div>
        <button 
          className={`btn-test-trigger ${isHapticsEnabled ? 'btn-active-state' : 'btn-inactive-state'}`}
          onClick={() => {
            setIsHapticsEnabled(!isHapticsEnabled);
            triggerSampleVibrationPattern();
          }}
        >
          {isHapticsEnabled ? '🟢 Active (Tap to Test)' : '🔴 Disabled'}
        </button>
      </div>

      {/* Control 2: Speech Synthesizer Voice Output Trigger */}
      <div className="control-toggle-row">
        <div className="label-group">
          <h5>Voice Synthesizer Broadcast</h5>
          <span>Speaks token queue instructions aloud</span>
        </div>
        <button 
          className={`btn-test-trigger ${isVoiceEnabled ? 'btn-active-state' : 'btn-inactive-state'}`}
          onClick={() => {
            setIsVoiceEnabled(!isVoiceEnabled);
            if (!isVoiceEnabled) triggerSampleAudioSpeech();
          }}
        >
          {isVoiceEnabled ? '🟢 Active (Tap to Test)' : '🔴 Disabled'}
        </button>
      </div>
    </div>
  );
}