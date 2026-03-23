import React from 'react';
import { useCart } from '../store/cart-context';
import { useContent } from '../store/content-context';
import { motion } from 'motion/react';

interface ProgressRewardsProps {
  variant?: 'mobile' | 'desktop';
}

export function ProgressRewards({ variant = 'mobile' }: ProgressRewardsProps) {
  const { getProductSubtotal, isSignedInMember } = useCart();
  const { get } = useContent();
  const subtotal = getProductSubtotal();

  const allMilestones = [
    { threshold: 35,  label: get('progress.membership'),  id: 'membership' },
    { threshold: 75,  label: get('progress.freeShipping'), id: 'shipping'  },
    { threshold: 150, label: get('progress.freeGift'),     id: 'gift'      },
  ];

  const milestones = isSignedInMember
    ? allMilestones.filter(m => m.id !== 'membership')
    : allMilestones;

  const maxThreshold = milestones[milestones.length - 1]?.threshold ?? 150;
  const DOT = 12; // dot diameter in px

  return (
    <div className="w-full py-4 px-1">

      {/* ── TRACK ROW ── */}
      {/* Structure: [line][dot][line][dot][line][dot][line] $150 */}
      <div className="flex items-center">
        {milestones.map((m, i) => {
          const achieved = subtotal >= m.threshold;
          const prevThreshold = i === 0 ? 0 : milestones[i - 1].threshold;
          const segFill =
            subtotal <= prevThreshold ? 0
            : subtotal >= m.threshold ? 1
            : (subtotal - prevThreshold) / (m.threshold - prevThreshold);

          return (
            <React.Fragment key={m.id}>
              {/* Line segment before this dot */}
              <div className="relative flex-1" style={{ height: '2px' }}>
                <div className="absolute inset-0 rounded-full" style={{ background: '#e8c0c8' }} />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#C8102E]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${segFill * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              {/* Dot */}
              <div
                className="flex-shrink-0 rounded-full transition-all duration-300"
                style={{
                  width: `${DOT}px`,
                  height: `${DOT}px`,
                  background: achieved ? '#C8102E' : '#fff',
                  border: '2px solid #C8102E',
                }}
              />
            </React.Fragment>
          );
        })}

        {/* Trailing line after last dot */}
        {(() => {
          const filled = subtotal >= (milestones[milestones.length - 1]?.threshold ?? 0);
          return (
            <div className="relative flex-1" style={{ height: '2px', minWidth: '16px' }}>
              <div className="absolute inset-0 rounded-full" style={{ background: '#e8c0c8' }} />
              {filled && <div className="absolute inset-0 rounded-full bg-[#C8102E]" />}
            </div>
          );
        })()}

        {/* $150.00 label inline with track */}
        <span className="flex-shrink-0 ml-3 text-[#C8102E]" style={{ fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
          ${maxThreshold.toFixed(2)}
        </span>
      </div>

      {/* ── LABELS ROW ── */}
      {/* Mirrors track structure exactly: [flex-1][DOT-wide label][flex-1][DOT-wide label]... [flex-1] */}
      {/* This ensures each label is perfectly centered under its dot */}
      <div className="flex items-start" style={{ marginTop: '8px' }}>
        {milestones.map((m, i) => {
          const achieved = subtotal >= m.threshold;
          return (
            <React.Fragment key={m.id}>
              {/* flex-1 spacer mirrors the line segment */}
              <div className="flex-1" />
              {/* DOT-wide cell mirrors the dot, text overflows centered */}
              <div
                className="flex-shrink-0 flex justify-center"
                style={{ width: `${DOT}px`, overflow: 'visible' }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: achieved ? 600 : 400,
                    color: achieved ? '#C8102E' : '#aaa',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {m.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
        {/* Trailing spacer mirrors trailing line */}
        <div className="flex-1" style={{ minWidth: '16px' }} />
      </div>

    </div>
  );
}
