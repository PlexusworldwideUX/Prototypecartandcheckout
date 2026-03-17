import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, Smartphone, Check, CheckCircle, Link as LinkIcon, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../store/content-context';
import { ET } from './EditableText';

/* SHARE CART MODAL */
interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShareCartModal({ open, onClose }: ShareModalProps) {
  const { get } = useContent();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    if (open) setStep('form');
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/55 z-[1000] flex items-center justify-center p-5" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-[480px]"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
      >
        {step === 'form' ? (
          <>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', marginBottom: '8px' }}>
              <ET k="modal.share.title" />
            </h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', lineHeight: 1.6 }}>
              <ET k="modal.share.subtitle" />
            </p>
            <div className="mb-3">
              <label className="block mb-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>
                <ET k="modal.share.promoLabel" />
              </label>
              <input
                type="text"
                placeholder={get('modal.share.promoPlaceholder')}
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="w-full px-3.5 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#C8102E]"
                style={{ fontSize: '14px', fontFamily: "'DM Sans', sans-serif" }}
              />
              <span style={{ fontSize: '11.5px', color: '#888', marginTop: '6px', display: 'block' }}>
                <ET k="modal.share.promoHint" />
              </span>
            </div>
            <div className="flex gap-2.5 mt-4">
              <button
                className="flex-1 bg-[#C8102E] text-white py-2.5 px-5 rounded-full border-none cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 600 }}
                onClick={() => setStep('success')}
              >
                <ET k="modal.share.generateBtn" />
              </button>
              <button
                className="flex-1 bg-white text-[#1a1a1a] py-2.5 px-5 rounded-full border border-[#e0e0e0] cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 600 }}
                onClick={onClose}
              >
                <ET k="modal.share.cancelBtn" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-3">
              <CheckCircle size={40} className="text-[#2e7d32] mx-auto" />
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', marginTop: '8px' }}>
                <ET k="modal.share.linkCreated" />
              </h2>
            </div>
            <div
              className="bg-[#f9e8eb] border border-[#e8c0c8] rounded-lg p-3 my-3 break-all"
              style={{ fontSize: '13px', fontFamily: 'monospace', color: '#C8102E' }}
            >
              https://plexus.com/cart/share?id=PLX-XC8821K&promo={promoCode || 'SAVE10'}
            </div>
            <p style={{ fontSize: '11.5px', color: '#888', marginBottom: '12px', lineHeight: 1.5 }}>
              <ET k="modal.share.linkDisclaimer" />
            </p>
            <div className="flex justify-center gap-4 my-4">
              <button className="w-11 h-11 rounded-full bg-[#1877f2] text-white flex items-center justify-center cursor-pointer border-none hover:scale-110 transition-transform" title="Facebook">
                <span style={{ fontWeight: 900, fontSize: '20px' }}>f</span>
              </button>
              <button className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center cursor-pointer border-none hover:scale-110 transition-transform" title="X">
                <span style={{ fontWeight: 900, fontSize: '16px' }}>{'\uD835\uDD4F'}</span>
              </button>
              <button className="w-11 h-11 rounded-full bg-[#34c759] text-white flex items-center justify-center cursor-pointer border-none hover:scale-110 transition-transform" title="Text Message">
                <Smartphone size={18} />
              </button>
              <button className="w-11 h-11 rounded-full bg-[#ea4335] text-white flex items-center justify-center cursor-pointer border-none hover:scale-110 transition-transform" title="Email">
                <Mail size={18} />
              </button>
              <button
                className="w-11 h-11 rounded-full bg-[#6b7280] text-white flex items-center justify-center cursor-pointer border-none hover:scale-110 transition-transform"
                title="Copy Link"
                onClick={() => navigator.clipboard?.writeText('https://plexus.com/cart/share?id=PLX-XC8821K&promo=SAVE10')}
              >
                <LinkIcon size={18} />
              </button>
            </div>
            <button
              className="w-full bg-[#1a1a1a] text-white py-3 rounded-full border-none cursor-pointer"
              style={{ fontSize: '14px', fontWeight: 600 }}
              onClick={onClose}
            >
              <ET k="modal.share.closeBtn" />
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* MFA MODAL */
interface MFAModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function MFAModal({ open, onClose, onVerified }: MFAModalProps) {
  const { get } = useContent();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<'email' | 'sms' | null>(null);
  const [codes, setCodes] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setStep(1);
      setMethod(null);
      setCodes(['', '', '', '', '']);
    }
  }, [open]);

  if (!open) return null;

  const handleCodeChange = (index: number, value: string) => {
    const v = value.replace(/[^0-9]/g, '');
    const newCodes = [...codes];
    newCodes[index] = v;
    setCodes(newCodes);
    if (v && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const sendCode = () => {
    if (!method) return;
    setStep(2);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const verify = () => {
    if (codes.join('').length < 5) return;
    setStep(3);
    setTimeout(() => {
      onVerified();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/55 z-[1000] flex items-center justify-center p-5" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-[380px]"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
      >
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', marginBottom: '8px' }}>
              <ET k="modal.mfa.title" />
            </h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', lineHeight: 1.6 }}>
              <ET k="modal.mfa.subtitle" />
            </p>
            <div className="flex gap-3 my-4">
              <button
                className={`flex-1 py-3.5 px-3 border-2 rounded-xl cursor-pointer text-center transition-all ${
                  method === 'email' ? 'border-[#C8102E] bg-[#f9e8eb]' : 'border-[#e0e0e0] bg-white'
                }`}
                onClick={() => setMethod('email')}
              >
                <Mail size={28} className="text-[#C8102E] mx-auto mb-1.5" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}><ET k="modal.mfa.emailLabel" /></span>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}><ET k="modal.mfa.emailHint" /></div>
              </button>
              <button
                className={`flex-1 py-3.5 px-3 border-2 rounded-xl cursor-pointer text-center transition-all ${
                  method === 'sms' ? 'border-[#C8102E] bg-[#f9e8eb]' : 'border-[#e0e0e0] bg-white'
                }`}
                onClick={() => setMethod('sms')}
              >
                <Smartphone size={28} className="text-[#C8102E] mx-auto mb-1.5" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}><ET k="modal.mfa.smsLabel" /></span>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}><ET k="modal.mfa.smsHint" /></div>
              </button>
            </div>
            <div className="flex gap-2.5 mt-4">
              <button
                className="flex-1 bg-[#C8102E] text-white py-2.5 px-5 rounded-full border-none cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 600 }}
                onClick={sendCode}
              >
                <ET k="modal.mfa.sendBtn" />
              </button>
              <button
                className="flex-1 bg-white text-[#1a1a1a] py-2.5 px-5 rounded-full border border-[#e0e0e0] cursor-pointer"
                style={{ fontSize: '14px', fontWeight: 600 }}
                onClick={onClose}
              >
                <ET k="modal.mfa.cancelBtn" />
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', marginBottom: '8px' }}>
              <ET k="modal.mfa.enterCodeTitle" />
            </h2>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px', lineHeight: 1.6 }}>
              We sent a 5-digit code to your {method === 'email' ? 'email' : 'phone number'}.
            </p>
            <div className="flex gap-2.5 justify-center my-5">
              {codes.map((c, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={c}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 border-2 border-[#e0e0e0] rounded-lg text-center focus:outline-none focus:border-[#C8102E]"
                  style={{ fontSize: '22px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
                />
              ))}
            </div>
            <p className="text-center text-[#888]" style={{ fontSize: '12px' }}><ET k="modal.mfa.enterCodeHint" /></p>
            <button
              className="w-full bg-[#C8102E] text-white py-2.5 rounded-full border-none cursor-pointer mt-4"
              style={{ fontSize: '14px', fontWeight: 600 }}
              onClick={verify}
            >
              <ET k="modal.mfa.verifyBtn" />
            </button>
            <button
              className="block mx-auto mt-2 bg-transparent border-none text-[#C8102E] cursor-pointer"
              style={{ fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setStep(1)}
            >
              &larr; <ET k="modal.mfa.backBtn" />
            </button>
          </>
        )}
        {step === 3 && (
          <div className="text-center">
            <CheckCircle size={48} className="text-[#2e7d32] mx-auto" />
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', marginTop: '8px' }}>
              <ET k="modal.mfa.verifiedTitle" />
            </h2>
            <p style={{ fontSize: '14px', color: '#555', marginTop: '8px' }}>
              <ET k="modal.mfa.verifiedText" />
            </p>
            <motion.div
              className="h-1 bg-[#C8102E] rounded mx-auto mt-4"
              initial={{ width: 0, opacity: 1 }}
              animate={{ width: 200, opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* VIP REMOVE MODAL */
interface VIPModalProps {
  open: boolean;
  savings: number;
  onKeep: () => void;
  onRemove: () => void;
}

export function VIPRemoveModal({ open, savings, onKeep, onRemove }: VIPModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[1001] flex items-center justify-center p-5">
      <motion.div
        className="bg-white rounded-2xl py-10 px-8 max-w-[440px] w-full text-center"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '26px', marginBottom: '10px' }}>
          <ET k="modal.vipRemove.title" />
        </h2>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, marginBottom: '20px' }}>
          <ET k="modal.vipRemove.subtitle" />
        </p>
        <button
          className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-full border-none cursor-pointer mb-3 transition-colors hover:bg-[#333]"
          style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
          onClick={onKeep}
        >
          <ET k="modal.vipRemove.keepBtn" />
        </button>
        <button
          className="bg-transparent border-none text-[#555] cursor-pointer underline"
          style={{ fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}
          onClick={onRemove}
        >
          <ET k="modal.vipRemove.removeBtn" />
        </button>
      </motion.div>
    </div>
  );
}

/* SUBSCRIPTION REMOVE MODAL */
interface SubModalProps {
  open: boolean;
  onKeep: () => void;
  onRemove: () => void;
}

export function SubscriptionRemoveModal({ open, onKeep, onRemove }: SubModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-[1001] flex items-center justify-center p-5">
      <motion.div
        className="bg-white rounded-2xl py-10 px-8 max-w-[440px] w-full text-center"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '26px', marginBottom: '10px' }}>
          <ET k="modal.subRemove.title" />
        </h2>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, marginBottom: '20px' }}>
          <ET k="modal.subRemove.subtitle" />
        </p>
        <button
          className="w-full bg-[#1a1a1a] text-white py-3.5 rounded-full border-none cursor-pointer mb-3 transition-colors hover:bg-[#333]"
          style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
          onClick={onKeep}
        >
          <ET k="modal.subRemove.keepBtn" />
        </button>
        <button
          className="bg-transparent border-none text-[#555] cursor-pointer underline"
          style={{ fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}
          onClick={onRemove}
        >
          <ET k="modal.subRemove.removeBtn" />
        </button>
      </motion.div>
    </div>
  );
}
