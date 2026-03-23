import React from 'react';
import { useCart } from '../store/cart-context';
import { useContent } from '../store/content-context';

interface ProgressRewardsProps {
  variant?: 'mobile' | 'desktop';
}

const DOT = 14;        // dot diameter px
const GAP = 3;         // visual gap between line end and dot edge px

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

  return (
    <div style={{ width: '100%', paddingTop: '8px', paddingBottom: '4px', boxSizing: 'border-box' }}>

      {/* ── TRACK ROW ── */}
      {/*
        Structure per milestone: [line flex-1][dot DOT px]
        Then trailing [line flex-1] [$label]
        
        The trick: line segments use negative margins to "reach into" the dot column space,
        stopping GAP px away from the dot edge. The dot column is zero-margin so labels align perfectly.
        
        Specifically: line right edge should stop (DOT/2 + GAP) px before dot center.
        We achieve this by giving each line segment marginRight: -(DOT/2 - GAP) so it
        overlaps into the dot column space, with the line div itself ending GAP px before the dot.
      */}
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        {milestones.map((m, i) => {
          const achieved = subtotal >= m.threshold;
          const isLast = i === milestones.length - 1;
          const prevThreshold = i === 0 ? 0 : milestones[i - 1].threshold;
          const lineFill = subtotal <= prevThreshold ? 0
            : subtotal >= m.threshold ? 1
            : (subtotal - prevThreshold) / (m.threshold - prevThreshold);

          // How far the line extends into the dot column on the right side
          const lineRightOverhang = DOT / 2 - GAP;

          return (
            <React.Fragment key={m.id}>
              {/* Line segment — extends DOT/2-GAP px past its flex boundary into dot column */}
              <div style={{
                flex: 1,
                position: 'relative',
                height: `${DOT}px`,
                minWidth: 0,
                // Negative right margin lets this div visually bleed into the dot column
                marginRight: `-${lineRightOverhang}px`,
                // But we clip overflow so it doesn't draw on top of the dot
                // We'll handle z-index instead — dot renders after (higher z)
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  // Stop GAP px before the dot edge (dot edge is at right + lineRightOverhang)
                  right: `${GAP}px`,
                  top: '50%',
                  height: '2px',
                  transform: 'translateY(-50%)',
                  background: '#e8c0c8',
                }} />
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: `${GAP}px`,
                  top: '50%',
                  height: '2px',
                  transform: 'translateY(-50%)',
                  background: '#C8102E',
                  clipPath: `inset(0 ${(1 - lineFill) * 100}% 0 0)`,
                  transition: 'clip-path 0.5s ease',
                }} />
              </div>

              {/* Dot + label — no margin, so label centers exactly on dot */}
              <div style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
                position: 'relative',
                // Mirror negative margin on left of next line using positive marginRight
                // so next line's left side also starts GAP from this dot's right edge
                marginRight: isLast ? 0 : `-${lineRightOverhang}px`,
              }}>
                <div style={{
                  width: `${DOT}px`,
                  height: `${DOT}px`,
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
                  height: `${DOT}px`,
                  minWidth: 0,
                  marginLeft: `-${lineRightOverhang}px`,
                }}>
                  <div style={{
                    position: 'absolute',
                    // Start GAP px after the dot's right edge
                    left: `${GAP}px`,
                    right: 0,
                    top: '50%',
                    height: '2px',
                    transform: 'translateY(-50%)',
                    background: achieved ? '#C8102E' : '#e8c0c8',
                  }} />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Dynamic amount */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', marginLeft: '8px' }}>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#C8102E',
            whiteSpace: 'nowrap',
            lineHeight: `${DOT}px`,
          }}>
            ${rightAmount.toFixed(2)}
          </span>
        </div>

      </div>
    </div>
  );
}
