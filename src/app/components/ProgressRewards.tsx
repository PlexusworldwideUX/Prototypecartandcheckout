import React from 'react';
import { useCart } from '../store/cart-context';
import { useContent } from '../store/content-context';

interface ProgressRewardsProps {
  variant?: 'mobile' | 'desktop';
}

const DOT = 14;

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
  const lastAchieved = [...milestones].reverse().find(m => subtotal >= m.threshold);
  const rightAmount = lastAchieved ? lastAchieved.threshold : 0;
  const progressPct = Math.min((subtotal / maxThreshold) * 100, 100);

  return (
    <div style={{ width: '100%', paddingTop: '8px', paddingBottom: '4px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', position: 'relative' }}>

        {/* Grey background track + animated red fill — contained to milestone columns only */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${DOT / 2}px`,
          height: '2px',
          transform: 'translateY(-50%)',
          zIndex: 0,
          overflow: 'hidden',
        }}>
          {/* Grey background */}
          <div style={{ position: 'absolute', inset: 0, background: '#e0d0d2', borderRadius: '2px' }} />
          {/* Animated red fill */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: `${progressPct}%`,
            background: '#C8102E',
            borderRadius: '2px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>

        {/* Milestone columns — dot + label grouped, space-between */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, position: 'relative', zIndex: 1 }}>
          {milestones.map((m) => {
            const achieved = subtotal >= m.threshold;
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                {/* Dot with white ring to create visual gap from line */}
                <div style={{
                  width: `${DOT}px`,
                  height: `${DOT}px`,
                  borderRadius: '50%',
                  background: achieved ? '#C8102E' : '#ffffff',
                  border: '2px solid #C8102E',
                  boxShadow: '0 0 0 4px #ffffff',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                  zIndex: 2,
                  transition: 'background 0.3s ease',
                }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#C8102E', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Amount label */}
        <span style={{
          flexShrink: 0,
          marginLeft: '10px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#C8102E',
          whiteSpace: 'nowrap',
          lineHeight: `${DOT}px`,
          position: 'relative',
          zIndex: 1,
        }}>
          ${rightAmount.toFixed(2)}
        </span>

      </div>
    </div>
  );
}
