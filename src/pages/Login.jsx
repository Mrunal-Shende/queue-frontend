import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Authentication & Dynamic Step Management States
  const [viewMode, setViewMode] = useState('login'); // 'login', 'signup_email', 'signup_otp', 'signup_details'
  const [form, setForm] = useState({ email: '', password: '' });
  
  // Registration State Matrix
  const [signupEmail, setSignupEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegFormChange = (e) =>
    setRegistrationForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ORIGINAL CREDENTIAL LOGIN HANDLER (Kept Exactly Same)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(form);
      const { user, token } = res.data;
      loginUser(user, token);

      if (user.role === 'staff') {
        navigate('/staff', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: SEND OTP SIMULATION
  const handleRequestOTP = (e) => {
    e.preventDefault();
    if (!signupEmail) return;
    
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`🔢 Verification OTP sent to ${signupEmail}`);
      setViewMode('signup_otp');
    }, 1200);
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpValue.length < 4) {
      setError('Please enter the full 4-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('');
      setViewMode('signup_details'); // Moves to registration credentials confirmation step
    }, 1000);
  };

  // STEP 3: NEW NAME & PASSWORD CONFIRMATION HANDLER
  const handleCompleteRegistration = (e) => {
    e.preventDefault();
    setError('');

    if (registrationForm.password !== registrationForm.confirmPassword) {
      setError('Passwords do not match. Please verify credentials again.');
      return;
    }

    if (registrationForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert(`🎉 Account successfully created for ${registrationForm.fullName}!`);
      
      // Auto populate fields into active login schema fields for best UX experience
      setForm({ email: signupEmail, password: registrationForm.password });
      setSuccessMsg('Registration verified! Please sign in with your new password.');
      setViewMode('login');
    }, 1200);
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

        /* 🟢 HOME-PAGE MATCHING ATTRACTIVE GRADIENT CORE HEADER HEADER AREA */
        .auth-app-header {
          background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          padding: 32px 24px 36px 24px; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; 
          color: #ffffff; text-align: center; flex-shrink: 0; box-shadow: 0 4px 20px rgba(74, 35, 182, 0.15);
        }
        .auth-logo-box {
          width: 52px; height: 52px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px);
          border-radius: 14px; display: flex; justify-content: center; align-items: center; margin: 0 auto 12px auto;
        }
        .auth-app-header h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .auth-app-header p { font-size: 13px; opacity: 0.85; margin-top: 2px; font-weight: 500; }

        .auth-scrollable-body {
          flex-grow: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; background: #f9fafb;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .auth-scrollable-body::-webkit-scrollbar { display: none; }

        /* Form Controls Setup */
        .auth-card-wrapper { background: #ffffff; border: 1px solid #f3f4f6; border-radius: 20px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
        .auth-view-title { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.3px; }

        .form-field-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
        .form-field-group label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .form-custom-input {
          height: 46px; background: #ffffff; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 0 14px; color: #1f2937; font-family: inherit; font-size: 13.5px; outline: none; transition: all 0.2s;
        }
        .form-custom-input:focus { border-color: #6d28d9; box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.08); }

        /* 🟢 CORE SIGNATURE BUTTON MATCHING CORE BRAND COLORS */
        .btn-theme-submit {
          width: 100%; height: 48px; background: linear-gradient(135deg, #6d28d9 0%, #4a23b6 100%);
          color: #ffffff; border: none; border-radius: 14px; font-size: 14.5px; font-weight: 700;
          cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px;
          box-shadow: 0 4px 15px rgba(74, 35, 182, 0.2); transition: transform 0.15s;
        }
        .btn-theme-submit:active { transform: scale(0.98); }
        .btn-theme-submit:disabled { opacity: 0.6; }

        .switch-flow-footer-link { text-align: center; margin-top: 18px; font-size: 13px; color: #6b7280; font-weight: 500; }
        .switch-flow-footer-link span { color: #6d28d9; font-weight: 700; cursor: pointer; text-decoration: underline; margin-left: 4px; }

        .alert-strip-box { font-size: 12.5px; font-weight: 600; padding: 10px 14px; border-radius: 12px; margin-bottom: 12px; line-height: 1.4; }
        .alert-strip-error { background: #fff5f5; border: 1px solid #fecaca; color: #e11d48; }
        .alert-strip-success { background: #e6fbf1; border: 1px solid #bbf7d0; color: #059669; }

        .demo-credentials-footer { text-align: center; font-size: 11px; color: #9ca3af; font-weight: 600; margin-top: auto; padding-top: 10px; }
      `}</style>

      <div className="mobile-layout">
        
        {/* PREMIUM UNIFORM APP BAR LAYER */}
        <div className="auth-app-header">
          <div className="auth-logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx9="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h1>SmartQueue Terminal</h1>
          <p>Skip the wait. Join smart.</p>
        </div>

        <div className="auth-scrollable-body">
          
          {error && <div className="alert-strip-box alert-strip-error">{error}</div>}
          {successMsg && <div className="alert-strip-box alert-strip-success">{successMsg}</div>}

          {/* VIEW BLOCKS PANEL 1: SYSTEM SECURE LOGIN FORMS */}
          {viewMode === 'login' && (
            <div className="auth-card-wrapper">
              <h2 className="auth-view-title">Welcome Back</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-field-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@domain.com" className="form-custom-input" required />
                </div>
                <div className="form-field-group">
                  <label>Account Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="form-custom-input" required />
                </div>
                <button type="submit" disabled={loading} className="btn-theme-submit">
                  {loading ? 'Validating Session...' : 'Sign In'}
                </button>
                <div className="switch-flow-footer-link">
                  Don't have an account? <span onClick={() => { setViewMode('signup_email'); setError(''); setSuccessMsg(''); }}>Create Account</span>
                </div>
              </form>
            </div>
          )}

          {/* VIEW BLOCKS PANEL 2: DISPATCH SIGNUP VERIFICATION PIN */}
          {viewMode === 'signup_email' && (
            <div className="auth-card-wrapper">
              <h2 className="auth-view-title">New Account (Step 1/3)</h2>
              <form onSubmit={handleRequestOTP}>
                <div className="form-field-group">
                  <label>Your Email Account</label>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@domain.com" className="form-custom-input" required />
                </div>
                <button type="submit" disabled={loading} className="btn-theme-submit">
                  {loading ? 'Sending verification...' : 'Send OTP Code'}
                </button>
                <div className="switch-flow-footer-link">
                  Already registered? <span onClick={() => { setViewMode('login'); setError(''); setSuccessMsg(''); }}>Sign In</span>
                </div>
              </form>
            </div>
          )}

          {/* VIEW BLOCKS PANEL 3: CONFIRM SECURITY NUMERIC TOKEN LOG */}
          {viewMode === 'signup_otp' && (
            <div className="auth-card-wrapper">
              <h2 className="auth-view-title">Verification (Step 2/3)</h2>
              <form onSubmit={handleVerifyOTP}>
                <div className="form-field-group">
                  <label>4-Digit Token OTP</label>
                  <input type="text" maxLength={4} value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g,''))} placeholder="0000" style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '16px', fontWeight: 700 }} className="form-custom-input" required />
                </div>
                <button type="submit" className="btn-theme-submit">Verify OTP Token</button>
                <div className="switch-flow-footer-link">
                  Wrong email? <span onClick={() => { setViewMode('signup_email'); setError(''); setSuccessMsg(''); }}>Go Back</span>
                </div>
              </form>
            </div>
          )}

          {/* 🟢 VIEW BLOCKS PANEL 4: NEW CREDENTIAL SPECIFICATION & CONFIRMATION FIELDS */}
          {viewMode === 'signup_details' && (
            <div className="auth-card-wrapper">
              <h2 className="auth-view-title">Setup Profile (Step 3/3)</h2>
              <form onSubmit={handleCompleteRegistration}>
                <div className="form-field-group">
                  <label>Full Legal Name</label>
                  <input type="text" name="fullName" value={registrationForm.fullName} onChange={handleRegFormChange} placeholder="John Doe" className="form-custom-input" required />
                </div>
                <div className="form-field-group">
                  <label>Setup Password</label>
                  <input type="password" name="password" value={registrationForm.password} onChange={handleRegFormChange} placeholder="Min 6 characters" className="form-custom-input" required />
                </div>
                <div className="form-field-group">
                  <label>Confirm Account Password</label>
                  <input type="password" name="confirmPassword" value={registrationForm.confirmPassword} onChange={handleRegFormChange} placeholder="Re-enter password" className="form-custom-input" required />
                </div>
                <button type="submit" disabled={loading} className="btn-theme-submit">
                  {loading ? 'Creating Account Logs...' : 'Complete Account Registration'}
                </button>
              </form>
            </div>
          )}

          <div className="demo-credentials-footer">
            Demo Sandbox: customer@demo.com · staff@demo.com / password123
          </div>

        </div>
      </div>
    </div>
  );
}