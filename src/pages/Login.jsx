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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegFormChange = (e) =>
    setRegistrationForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 🌐 SOCIAL AUTHENTICATION ROUTERS
  const handleSocialOAuth = (provider) => {
    setError('');
    const BACKEND_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${BACKEND_BASE_URL}/api/auth/${provider}`;
  };

  // 🔐 REFINED LOGIN HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const targetEmail = form.email.trim().toLowerCase();
    const targetPassword = form.password;

    // Sandbox/Demo Accounts System Bypass
    if (targetEmail === 'customer@demo.com' && targetPassword === 'password123') {
      const mockUser = { email: 'customer@demo.com', role: 'customer', fullName: 'Demo Customer' };
      loginUser(mockUser, 'mock-sandbox-jwt-token');
      navigate('/', { replace: true });
      setLoading(false);
      return;
    }

    if (targetEmail === 'staff@demo.com' && targetPassword === 'password123') {
      const mockUser = { email: 'staff@demo.com', role: 'staff', fullName: 'Demo Staff' };
      loginUser(mockUser, 'mock-sandbox-jwt-token');
      navigate('/staff', { replace: true });
      setLoading(false);
      return;
    }

    // New local registered users logic match
    const localUsers = JSON.parse(localStorage.getItem('smartqueue_local_users') || '{}');
    if (localUsers[targetEmail] && localUsers[targetEmail].password === targetPassword) {
      const mockUser = { email: targetEmail, role: 'customer', fullName: localUsers[targetEmail].fullName };
      loginUser(mockUser, 'mock-local-jwt-token');
      navigate('/', { replace: true });
      setLoading(false);
      return;
    }

    // Fallback directly to PostgreSQL backend
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
      setSuccessMsg(`Verification OTP sent to ${signupEmail}`);
      setViewMode('signup_otp');
    }, 1200);
  };

  // STEP 2: VERIFY OTP SIMULATION
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
      setViewMode('signup_details'); 
    }, 1000);
  };

  // STEP 3: REGISTRATION SCHEMAS COMMITMENT
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
      
      const currentLocalUsers = JSON.parse(localStorage.getItem('smartqueue_local_users') || '{}');
      currentLocalUsers[signupEmail.trim().toLowerCase()] = {
        fullName: registrationForm.fullName,
        password: registrationForm.password
      };
      localStorage.setItem('smartqueue_local_users', JSON.stringify(currentLocalUsers));

      alert(`Account successfully created for ${registrationForm.fullName}!`);
      
      setForm({ email: signupEmail, password: registrationForm.password });
      setSuccessMsg('Registration verified! Please sign in with your new password.');
      setViewMode('login');
    }, 1200);
  };

  return (
    <div className="app-viewport-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        
        .app-viewport-wrapper {
          width: 100vw; height: 100vh; height: 100dvh; background-color: #5e4ae3;
          font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: center; align-items: center; padding: 12px;
        }

        /* 📱 Flexible Universal Mobile Layout Container */
        .mobile-app-shell {
          width: 100%; max-width: 410px; height: 100%; max-height: 800px;
          background: #ffffff; border-radius: 32px; display: flex; flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); overflow: hidden; position: relative;
        }

        /* 👥 Premium Horizontal Queue Banner Block integrated at the very top */
        .queue-header-banner {
          width: 100%; height: 110px; background: #eedffa; display: flex; 
          align-items: flex-end; justify-content: center; padding: 0 16px; 
          border-bottom: 1px solid rgba(94, 74, 227, 0.1); flex-shrink: 0; overflow: hidden;
        }
        .queue-banner-svg-wrapper { width: 100%; max-width: 320px; height: 95px; }

        .mobile-scroll-container {
          flex: 1; overflow-y: auto; padding: 28px 28px; display: flex; flex-direction: column;
          -ms-overflow-style: none; scrollbar-width: none;
        }
        .mobile-scroll-container::-webkit-scrollbar { display: none; }

        .app-identity-block { margin-bottom: 28px; text-align: left; }
        .app-identity-block h1 { font-size: 16px; font-weight: 500; color: #7e849c; }
        .app-identity-block .app-primary-title { font-size: 26px; font-weight: 800; color: #5e4ae3; line-height: 1.2; margin-top: 2px; }

        .social-button-stack { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .social-btn-item {
          width: 100%; height: 52px; background: #ffffff; border: 1px solid #e2e4ee;
          border-radius: 14px; display: flex; justify-content: center; align-items: center;
          gap: 14px; font-size: 13.5px; font-weight: 600; color: #4a4d61; cursor: pointer;
          transition: background-color 0.2s, border-color 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.01);
        }
        .social-btn-item:hover { background: #f9fafc; border-color: #cbd0e1; }
        
        .provider-logo-svg { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }

        .text-divider-row {
          display: flex; align-items: center; text-align: center; color: #a3a9c2;
          font-size: 12px; font-weight: 700; margin: 16px 0 24px 0; text-transform: uppercase; letter-spacing: 0.6px;
        }
        .text-divider-row::before, .text-divider-row::after { content: ''; flex: 1; border-bottom: 1px solid #eef0f6; }
        .text-divider-row:not(:empty)::before { margin-right: 1.2em; }
        .text-divider-row:not(:empty)::after { margin-left: 1.2em; }

        .form-layout-matrix { display: flex; flex-direction: column; gap: 18px; }
        
        .input-composite-box {
          background: #f1f3f7; border: 1px solid transparent; border-radius: 14px;
          padding: 10px 18px; display: flex; align-items: center; gap: 14px; transition: all 0.2s;
          height: 58px;
        }
        .input-composite-box:focus-within { background: #ffffff; border-color: #5e4ae3; box-shadow: 0 0 0 4px rgba(94, 74, 227, 0.1); }
        
        .input-icon-node { color: #4a4d61; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
        .input-internal-layout { flex: 1; display: flex; flex-direction: column; width: 100%; }
        .label-stacked-title { font-size: 10.5px; color: #7e849c; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
        
        .input-field-core {
          background: transparent; border: none; outline: none;
          font-family: inherit; font-size: 14.5px; color: #1f2235; font-weight: 600; width: 100%;
        }
        .input-field-core::placeholder { color: #9da3b4; font-weight: 500; }
        
        .visibility-toggle-btn { background: none; border: none; color: #8e94a6; cursor: pointer; padding: 4px; display: flex; align-items: center; }
        .visibility-toggle-btn svg { width: 20px; height: 20px; }

        .meta-utilities-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin: 2px 2px; }
        .checkbox-label-node { display: flex; align-items: center; gap: 8px; color: #787d91; font-weight: 500; cursor: pointer; }
        .checkbox-label-node input { width: 16px; height: 16px; accent-color: #5e4ae3; cursor: pointer; }
        .link-forgot-pass { color: #5e4ae3; font-weight: 700; text-decoration: none; }
        .link-forgot-pass:hover { text-decoration: underline; }

        .btn-prime-action {
          width: 100%; height: 54px; background: #5e4ae3; color: #ffffff;
          border: none; border-radius: 14px; font-size: 15px; font-weight: 700;
          cursor: pointer; display: flex; justify-content: center; align-items: center;
          transition: background-color 0.2s, transform 0.1s; margin-top: 8px;
          box-shadow: 0 8px 22px rgba(94, 74, 227, 0.2);
        }
        .btn-prime-action:hover { background: #4b39ca; }
        .btn-prime-action:active { transform: scale(0.99); }
        .btn-prime-action:disabled { opacity: 0.6; cursor: not-allowed; }

        .flow-switch-helper { text-align: center; margin-top: 28px; font-size: 14px; color: #787d91; font-weight: 500; padding-bottom: 8px; }
        .flow-switch-helper span { color: #5e4ae3; font-weight: 700; cursor: pointer; margin-left: 4px; }
        .flow-switch-helper span:hover { text-decoration: underline; }

        .system-banner-msg { font-size: 13px; font-weight: 600; padding: 12px 16px; border-radius: 12px; margin-bottom: 16px; line-height: 1.4; }
        .banner-err { background: #ffebeb; color: #ea3d3d; border: 1px solid #ffd1d1; }
        .banner-suc { background: #ebfbf3; color: #1cb867; border: 1px solid #c7f2dc; }

        .loader-element {
          width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.2);
          border-top-color: #ffffff; border-radius: 50%; animation: rotation 0.6s linear infinite;
        }
        @keyframes rotation { to { transform: rotate(360deg); } }

        @media (max-height: 680px) {
          .queue-header-banner { height: 90px; }
          .queue-banner-svg-wrapper { height: 75px; }
          .mobile-scroll-container { padding: 20px 24px; }
          .app-identity-block { margin-bottom: 18px; }
        }
      `}</style>

      <div className="mobile-app-shell">
        
        {/* Horizontal Banner Sticker Graphic mirroring the provided queue reference */}
        <div className="queue-header-banner">
          <div className="queue-banner-svg-wrapper">
            <svg width="100%" height="100%" viewBox="0 0 320 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Service Counter Desk */}
              <path d="M260 95V45H310V95H260Z" fill="#2d8a81" />
              <path d="M255 45H315V52H255V45Z" fill="#1b5a54" />
              {/* Executive Teller Counter Staff */}
              <circle cx="285" cy="24" r="7" fill="#ff7070" />
              <path d="M272 45C272 35 278 32 285 32C292 32 298 35 298 45H272Z" fill="#ffcc4d" />
              <path d="M298 22C302 24 306 20 304 34" stroke="#2d8a81" strokeWidth="3" strokeLinecap="round" />
              
              {/* Customer 1 (Front of Queue submitting receipt ticket) */}
              <circle cx="225" cy="36" r="7" fill="#ff914d" />
              <path d="M210 62C210 50 216 45 225 45C234 45 240 50 240 62V95H210V62Z" fill="#ff6f61" />
              <path d="M232 55H250V68H232V55Z" fill="#d2d4f0" transform="rotate(-15 241 61)" />
              
              {/* Customer 2 (Middle Line holding backpack profile asset) */}
              <circle cx="155" cy="28" r="7" fill="#ffd1a9" />
              <path d="M140 54C140 44 146 38 155 38C164 38 170 44 170 54V95H140V54Z" fill="#2c7a5f" />
              <path d="M136 43H146V65H136V43Z" fill="#8d5b4c" rx="3" /> {/* Backpack */}

              {/* Customer 3 (Standing behind center) */}
              <circle cx="95" cy="34" r="7" fill="#fca311" />
              <path d="M80 58C80 48 86 43 95 43C104 43 110 48 110 58V95H80V58Z" fill="#ffb703" />

              {/* Customer 4 (Tail end user profile) */}
              <circle cx="35" cy="32" r="7" fill="#a06cd5" />
              <path d="M20 56C20 46 26 41 35 41C44 41 50 46 50 56V95H20V56Z" fill="#00b4d8" />
            </svg>
          </div>
        </div>

        <div className="mobile-scroll-container">
          
          {/* Header Typography layout block */}
          <div className="app-identity-block">
            <h1>Welcome to</h1>
            <div className="app-primary-title">SmartQueue Terminal</div>
          </div>

          {error && <div className="system-banner-msg banner-err">{error}</div>}
          {successMsg && <div className="system-banner-msg banner-suc">{successMsg}</div>}

          {/* VIEW BLOCKS: 1. LOGIN */}
          {viewMode === 'login' && (
            <>
              <div className="social-button-stack">
                <button type="button" onClick={() => handleSocialOAuth('google')} className="social-btn-item">
                  <div className="provider-logo-svg">
                    <svg viewBox="0 0 24 24" width="100%" height="100%">
                      <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.24 1 3.2 3.74 1.25 7.73l3.87 3a7 7 0 0 1 6.88-5.69z"/>
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46a5.5 5.5 0 0 1-2.4 3.63l3.72 2.89c2.17-2 3.71-4.94 3.71-8.67z"/>
                      <path fill="#FBBC05" d="M5.12 14.73a7 7 0 0 1 0-4.46l-3.87-3A11.94 11.94 0 0 0 0 12c0 1.76.38 3.44 1.06 4.97l4.06-3.24z"/>
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.72-2.89a7 7 0 0 1-4.24 1.22 7 7 0 0 1-6.88-5.69l-3.9 3.02C3.23 20.24 7.27 23 12 23z"/>
                    </svg>
                  </div>
                  Login with Google
                </button>
                
                <button type="button" onClick={() => handleSocialOAuth('facebook')} className="social-btn-item">
                  <div className="provider-logo-svg">
                    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  Login with Facebook
                </button>
              </div>

              <div className="text-divider-row">Or</div>

              <form onSubmit={handleSubmit} className="form-layout-matrix">
                <div className="input-composite-box">
                  <div className="input-icon-node">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="input-internal-layout">
                    <span className="label-stacked-title">Email Address</span>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@domain.com" className="input-field-core" required />
                  </div>
                </div>

                <div className="input-composite-box">
                  <div className="input-icon-node">
                    <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="input-internal-layout">
                    <span className="label-stacked-title">Password</span>
                    <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••••••" className="input-field-core" required />
                  </div>
                  <button type="button" className="visibility-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>

                <div className="meta-utilities-row">
                  <label className="checkbox-label-node">
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#forgot" className="link-forgot-pass">Forgot Password?</a>
                </div>

                <button type="submit" disabled={loading} className="btn-prime-action">
                  {loading ? <div className="loader-element" /> : 'Sign In'}
                </button>

                <div className="flow-switch-helper">
                  Don't have an account? <span onClick={() => { setViewMode('signup_email'); setError(''); setSuccessMsg(''); }}>Register</span>
                </div>
              </form>
            </>
          )}

          {/* VIEW BLOCKS: 2. ENTER EMAIL FOR SIGNUP */}
          {viewMode === 'signup_email' && (
            <form onSubmit={handleRequestOTP} className="form-layout-matrix">
              <div className="input-composite-box">
                <div className="input-icon-node">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="input-internal-layout">
                  <span className="label-stacked-title">Registration Account Email</span>
                  <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@domain.com" className="input-field-core" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-prime-action">
                {loading ? <div className="loader-element" /> : 'Send Verification OTP'}
              </button>

              <div className="flow-switch-helper">
                Return to account <span onClick={() => { setViewMode('login'); setError(''); setSuccessMsg(''); }}>Sign In</span>
              </div>
            </form>
          )}

          {/* VIEW BLOCKS: 3. OTP VERIFICATION */}
          {viewMode === 'signup_otp' && (
            <form onSubmit={handleVerifyOTP} className="form-layout-matrix">
              <div className="input-composite-box" style={{ height: '64px' }}>
                <div className="input-internal-layout" style={{ alignItems: 'center' }}>
                  <span className="label-stacked-title" style={{ marginBottom: '4px' }}>4-Digit Verification Token</span>
                  <input type="text" maxLength={4} value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g,''))} placeholder="0000" style={{ textAlign: 'center', letterSpacing: '14px', fontSize: '22px', fontWeight: '800' }} className="input-field-core" required />
                </div>
              </div>

              <button type="submit" className="btn-prime-action">Verify Token</button>

              <div className="flow-switch-helper">
                Wrong email path? <span onClick={() => { setViewMode('signup_email'); setError(''); setSuccessMsg(''); }}>Go Back</span>
              </div>
            </form>
          )}

          {/* VIEW BLOCKS: 4. SETUP CREDENTIAL DETAILS */}
          {viewMode === 'signup_details' && (
            <form onSubmit={handleCompleteRegistration} className="form-layout-matrix">
              <div className="input-composite-box">
                <div className="input-icon-node">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="input-internal-layout">
                  <span className="label-stacked-title">Full Profile Name</span>
                  <input type="text" name="fullName" value={registrationForm.fullName} onChange={handleRegFormChange} placeholder="John Doe" className="input-field-core" required />
                </div>
              </div>

              <div className="input-composite-box">
                <div className="input-icon-node">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="input-internal-layout">
                  <span className="label-stacked-title">Secure Password</span>
                  <input type="password" name="password" value={registrationForm.password} onChange={handleRegFormChange} placeholder="Min 6 characters" className="input-field-core" required />
                </div>
              </div>

              <div className="input-composite-box">
                <div className="input-icon-node">
                  <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="input-internal-layout">
                  <span className="label-stacked-title">Confirm Access Password</span>
                  <input type="password" name="confirmPassword" value={registrationForm.confirmPassword} onChange={handleRegFormChange} placeholder="Re-enter password" className="input-field-core" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-prime-action">
                {loading ? <div className="loader-element" /> : 'Complete Registration'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}