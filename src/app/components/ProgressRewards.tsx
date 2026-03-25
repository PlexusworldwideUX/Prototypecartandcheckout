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
  const lastAchieved = [...milestones].reverse().find(m => subtotal >= m.threshold);
  const rightAmount = lastAchieved ? lastAchieved.threshold : 0;

  const DOT = 14;

  return (
    <div style={{ width: '100%', paddingTop: '8px', paddingBottom: '4px', boxSizing: 'border-box' }}>

      {/* Outer row: [milestone columns spaced between] [$amount] */}
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', position: 'relative' }}>

        {/* Single red line running behind the milestone columns only — ends before $amount label */}

        {/* Milestone columns — space-between so they spread across full width */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Single red line inside milestone columns — stops at last dot, never reaches $label */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${DOT / 2}px`,
            height: '2px',
            background: '#C8102E',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }} />
          {milestones.map((m) => {
            const achieved = subtotal >= m.threshold;
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {/* Dot — white outline creates visual separation from the line */}
                <div style={{
                  width: `${DOT}px`,
                  height: `${DOT}px`,
                  borderRadius: '50%',
                  background: achieved ? '#C8102E' : '#fff',
                  border: '2px solid #C8102E',
                  outline: '3px solid #fff',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }} />
                {/* Label — always centered under its dot because it's in the same column */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#C8102E',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Amount label — vertically aligned with the dots */}
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
