import React from 'react';
import { useCart } from '../store/cart-context';
import { useContent } from '../store/content-context';

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

  // Each milestone as a % position along the track (0–100)
  // Image 2: dots sit at roughly 13%, 50%, 87% — evenly distributed
  // Simplest: evenly space them
  const n = milestones.length;
  const positions = milestones.map((_, i) => ((i + 1) / (n + 1)) * 100);

  return (
    <div style={{ width: '100%', paddingTop: '8px', paddingBottom: '4px', boxSizing: 'border-box' }}>

      {/* ── TRACK + DOTS + $LABEL ── */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 0 }}>

        {/* Track: flex-1, relative, holds line and dots */}
        <div style={{ flex: 1, position: 'relative', height: '14px' }}>

          {/* Full red line */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '2px',
            background: '#C8102E',
            transform: 'translateY(-50%)',
          }} />

          {/* Dots at evenly spaced % positions */}
          {milestones.map((m, i) => {
            const achieved = subtotal >= m.threshold;
            return (
              <div
                key={m.id}
                style={{
                  position: 'absolute',
                  left: `${positions[i]}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: achieved ? '#C8102E' : '#fff',
                  border: '2px solid #C8102E',
                  zIndex: 1,
                }}
              />
            );
          })}
        </div>

        {/* $150.00 */}
        <span style={{
          flexShrink: 0,
          marginLeft: '10px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#C8102E',
          whiteSpace: 'nowrap',
        }}>
          ${maxThreshold.toFixed(2)}
        </span>
      </div>

      {/* ── LABELS ── */}
      {/* Each label absolutely positioned under its dot, left-aligned to dot center */}
      <div style={{ position: 'relative', height: '18px', marginTop: '5px' }}>
        {milestones.map((m, i) => (
          <div
            key={m.id}
            style={{
              position: 'absolute',
              left: `${positions[i]}%`,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#C8102E',
            }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
