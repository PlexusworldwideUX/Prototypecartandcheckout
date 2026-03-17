import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import { useCart } from '../store/cart-context';
import { useContent } from '../store/content-context';
import { ET } from './EditableText';

export function AuthPage() {
  const { signInAsMember, signUpAsUser, setPage, authReturnPage } = useCart();
  const { get } = useContent();

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('tarl@plexus.com');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [showSignInPw, setShowSignInPw] = useState(false);

  // Create Account form state
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPw, setShowSignUpPw] = useState(false);
  const [ambassadorId, setAmbassadorId] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const handleSignIn = () => {
    signInAsMember();
    setPage(authReturnPage);
  };

  const handleSignUp = () => {
    if (!fullName.trim()) return;
    signUpAsUser(fullName.trim());
    setPage(authReturnPage);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #d0d0d0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <div className="min-h-[calc(100vh-120px)]" style={{ background: '#FFFFFF' }}>
      {/* Back to cart */}
      <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-2">
        <button
          className="flex items-center gap-1.5 text-[#555] bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-[#C8102E]"
          style={{ fontSize: '14px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}
          onClick={() => setPage('cart')}
        >
          <ArrowLeft size={16} />
          <ET k="auth.backToCart" />
        </button>
      </div>

      {/* Heading */}
      <div className="max-w-[1280px] mx-auto px-6 pb-6">
        <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#1a1a1a', margin: 0 }}>
          <ET k="auth.heading" />
        </h1>
      </div>

      {/* Two-column layout (desktop) / stacked (mobile) */}
      <div className="max-w-[1280px] mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Sign In Panel */}
          <div className="flex-1 p-6 md:p-8">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 24px 0' }}>
              <ET k="auth.signIn.title" />
            </h2>

            {/* Email */}
            <div className="mb-4">
              <label style={labelStyle}><ET k="auth.signIn.emailLabel" /></label>
              <input
                type="email"
                placeholder={get('auth.signIn.emailPlaceholder')}
                value={signInEmail}
                onChange={e => setSignInEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label style={labelStyle}><ET k="auth.signIn.passwordLabel" /></label>
              <div className="relative">
                <input
                  type={showSignInPw ? 'text' : 'password'}
                  placeholder={get('auth.signIn.passwordPlaceholder')}
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#999] p-0"
                  onClick={() => setShowSignInPw(!showSignInPw)}
                  type="button"
                >
                  {showSignInPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="mb-6">
              <a
                className="text-[#C8102E] cursor-pointer no-underline hover:underline"
                style={{ fontSize: '13px', fontWeight: 500 }}
              >
                <ET k="auth.signIn.forgotPassword" />
              </a>
            </div>

            {/* Sign In button */}
            <button
              className="w-full bg-[#C8102E] text-white py-3.5 rounded-full border-none cursor-pointer transition-all hover:bg-[#a00d24]"
              style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.3px', fontFamily: "'DM Sans', sans-serif" }}
              onClick={handleSignIn}
            >
              <ET k="auth.signIn.submitBtn" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex md:hidden items-center gap-4 px-6">
            <hr className="flex-1 border-t border-[#CCCCCC]" />
            <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
              <ET k="auth.dividerText" />
            </span>
            <hr className="flex-1 border-t border-[#CCCCCC]" />
          </div>
          <div className="hidden md:block w-px bg-[#CCCCCC] self-stretch" />

          {/* Create Account Panel */}
          <div className="flex-1 p-6 md:p-8">
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 24px 0' }}>
              <ET k="auth.createAccount.title" />
            </h2>

            {/* Full Name */}
            <div className="mb-4">
              <label style={labelStyle}><ET k="auth.createAccount.fullNameLabel" /></label>
              <input
                type="text"
                placeholder={get('auth.createAccount.fullNamePlaceholder')}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label style={labelStyle}><ET k="auth.createAccount.emailLabel" /></label>
              <input
                type="email"
                placeholder={get('auth.createAccount.emailPlaceholder')}
                value={signUpEmail}
                onChange={e => setSignUpEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label style={labelStyle}><ET k="auth.createAccount.passwordLabel" /></label>
              <div className="relative">
                <input
                  type={showSignUpPw ? 'text' : 'password'}
                  placeholder={get('auth.createAccount.passwordPlaceholder')}
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#999] p-0"
                  onClick={() => setShowSignUpPw(!showSignUpPw)}
                  type="button"
                >
                  {showSignUpPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Ambassador ID */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  <ET k="auth.createAccount.ambassadorLabel" />
                </label>
                <a
                  className="text-[#C8102E] cursor-pointer no-underline hover:underline"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  <ET k="auth.createAccount.skipLabel" />
                </a>
              </div>
              <input
                type="text"
                placeholder={get('auth.createAccount.ambassadorPlaceholder')}
                value={ambassadorId}
                onChange={e => setAmbassadorId(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* reCAPTCHA mock */}
            <div
              className="mb-4 flex items-center gap-3 rounded-lg border border-[#d0d0d0] px-4 py-3 cursor-pointer select-none"
              style={{ background: '#fafafa' }}
              onClick={() => setCaptchaChecked(!captchaChecked)}
            >
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                style={{
                  borderColor: captchaChecked ? '#C8102E' : '#bbb',
                  background: captchaChecked ? '#C8102E' : 'transparent',
                }}
              >
                {captchaChecked && <Check size={14} className="text-white" />}
              </div>
              <span style={{ fontSize: '13px', color: '#333' }}>
                <ET k="auth.createAccount.captchaText" />
              </span>
              <span className="ml-auto text-[#999]" style={{ fontSize: '10px' }}>
                <ET k="auth.createAccount.captchaLabel" />
              </span>
            </div>

            {/* Privacy / Terms */}
            <div className="mb-6" style={{ fontSize: '12px', color: '#777', lineHeight: 1.6 }}>
              <ET k="auth.createAccount.privacyText" />{' '}
              <a className="text-[#C8102E] cursor-pointer no-underline hover:underline">
                <ET k="auth.createAccount.privacyLink" />
              </a>{' '}
              <ET k="auth.createAccount.andText" />{' '}
              <a className="text-[#C8102E] cursor-pointer no-underline hover:underline">
                <ET k="auth.createAccount.termsLink" />
              </a>.
            </div>

            {/* Sign Up button */}
            <button
              className="w-full bg-[#C8102E] text-white py-3.5 rounded-full border-none cursor-pointer transition-all hover:bg-[#a00d24] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.3px', fontFamily: "'DM Sans', sans-serif" }}
              onClick={handleSignUp}
              disabled={!fullName.trim()}
            >
              <ET k="auth.createAccount.submitBtn" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}