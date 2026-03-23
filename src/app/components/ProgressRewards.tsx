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
  const DOT = 14; // dot diameter px

  // Build segments: short | dot | long | dot | long | dot | short | $label
  // We treat it as: for N dots, there are N+1 segments
  // Segment widths: first=1fr, middle=2fr each, last=1fr (matches image proportions)
  // Actually looking at image 2: all gaps between dots appear equal, with a small lead-in on left
  // Simplest faithful reading: lead line (small fixed), then equal spacing between dots, then trail line (small fixed), then label

  return (
    <div style={{ width: '100%', paddingTop: '12px', paddingBottom: '8px', boxSizing: 'border-box' }}>

      {/* Outer flex: [track-area] [$150 label] */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

        {/* Track area — flex-1, holds line + dots */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>

          {/* Full background line */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${DOT / 2}px`,
            height: '2px',
            background: '#C8102E',
            transform: 'translateY(-50%)',
          }} />

          {/* Dots row — flex with equal spacing */}
          {/* Use justify-between with padding so dots sit with equal segments */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '16px',
            paddingRight: '16px',
            position: 'relative',
          }}>
            {milestones.map((m) => {
              const achieved = subtotal >= m.threshold;
              return (
                <div
                  key={m.id}
                  style={{
                    width: `${DOT}px`,
                    height: `${DOT}px`,
                    borderRadius: '50%',
                    background: achieved ? '#C8102E' : '#fff',
                    border: `2px solid #C8102E`,
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              );
            })}
          </div>

        </div>

        {/* $150 label */}
        <div style={{ flexShrink: 0, marginLeft: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#C8102E', whiteSpace: 'nowrap' }}>
            ${maxThreshold.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Labels row — same padding + justify-between as dots row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingLeft: '16px',
        paddingRight: '16px',
        marginTop: '6px',
      }}>
        {milestones.map((m) => {
          const achieved = subtotal >= m.threshold;
          return (
            <div
              key={m.id}
              style={{
                // Each label is centered under its dot via text-align center
                // and a width of 0 with overflow visible, anchored at dot center
                width: 0,
                overflow: 'visible',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#C8102E',
                whiteSpace: 'nowrap',
                display: 'block',
              }}>
                {m.label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
