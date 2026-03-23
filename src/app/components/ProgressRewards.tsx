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

  // Dynamic right label: show the next unachieved milestone threshold, or max if all achieved
  const nextMilestone = milestones.find(m => subtotal < m.threshold);
  const rightAmount = nextMilestone ? nextMilestone.threshold : maxThreshold;

  // Gap between line end and dot edge — px value as a string, used as margin
  const GAP = 4; // px — close but not touching

  return (
    <div style={{ width: '100%', paddingTop: '8px', paddingBottom: '4px', boxSizing: 'border-box' }}>
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
                height: '14px',
                minWidth: 0,
                // Inset by GAP on the dot side so line ends close to but not touching dot
                marginRight: `${GAP}px`,
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  top: '6px',
                  height: '2px',
                  background: '#e8c0c8',
                }} />
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

              {/* Dot + label column */}
              <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // Add right GAP margin so next line segment starts with gap after dot
                marginRight: isLast ? 0 : `${GAP}px`,
              }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: achieved ? '#C8102E' : '#fff',
                  border: '2px solid #C8102E',
                  flexShrink: 0,
                }} />
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

              {/* Trailing line after last dot */}
              {isLast && (
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '14px',
                  minWidth: 0,
                  marginLeft: `${GAP}px`,
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

        {/* Dynamic amount label */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', marginLeft: '8px' }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#C8102E',
            whiteSpace: 'nowrap',
            lineHeight: '14px',
          }}>
            ${rightAmount.toFixed(2)}
          </span>
        </div>

      </div>
    </div>
  );
}
