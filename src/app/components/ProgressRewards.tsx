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

  return (
    <div style={{ width: '100%', paddingTop: '8px', paddingBottom: '4px', boxSizing: 'border-box' }}>

      {/* Single row: [dot+label] [line] [dot+label] [line] [dot+label] [line] [$150] */}
      {/* The line segments are flex-1, the dot columns are fixed-width */}
      {/* Dot and its label are in the same column div — guaranteed alignment */}

      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>

        {milestones.map((m, i) => {
          const achieved = subtotal >= m.threshold;
          const isLast = i === milestones.length - 1;
          const prevThreshold = i === 0 ? 0 : milestones[i - 1].threshold;
          const lineFill = subtotal <= prevThreshold ? 0
            : subtotal >= m.threshold ? 1
            : (subtotal - prevThreshold) / (m.threshold - prevThreshold);

          return (
            <React.Fragment key={m.id}>
              {/* Line segment before this dot */}
              <div style={{
                flex: 1,
                position: 'relative',
                height: '14px', // matches dot height
                minWidth: 0,
              }}>
                {/* bg line */}
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  top: '6px',
                  height: '2px',
                  background: '#e8c0c8',
                }} />
                {/* fill */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '6px',
                  height: '2px',
                  width: `${lineFill * 100}%`,
                  background: '#C8102E',
                  transition: 'width 0.5s ease',
                }} />
              </div>

              {/* Dot + label column — dot and label share same container so they are always aligned */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Dot */}
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: achieved ? '#C8102E' : '#fff',
                  border: '2px solid #C8102E',
                  flexShrink: 0,
                }} />
                {/* Label directly below dot, centered */}
                <span style={{
                  marginTop: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#C8102E',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}>
                  {m.label}
                </span>
              </div>

              {/* If last dot, add trailing line before $150 label */}
              {isLast && (
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '14px',
                  minWidth: 0,
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0,
                    top: '6px',
                    height: '2px',
                    background: achieved ? '#C8102E' : '#e8c0c8',
                  }} />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* $150.00 label — vertically centered on the dot row (top: 0, aligns with dot center) */}
        <div style={{ flexShrink: 0, paddingTop: '0px', display: 'flex', alignItems: 'flex-start' }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#C8102E',
            whiteSpace: 'nowrap',
            lineHeight: '14px', // match dot height so it sits on the line
            marginLeft: '8px',
          }}>
            ${maxThreshold.toFixed(2)}
          </span>
        </div>

      </div>
    </div>
  );
}
