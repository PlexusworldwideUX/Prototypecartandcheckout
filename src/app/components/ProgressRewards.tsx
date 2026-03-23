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
  const progress = Math.min(subtotal / maxThreshold, 1);

  // Number of segments = milestones.length + 1 (before first, between each, after last — but last segment leads to $label)
  // Layout: [line]•[line]•[line]•[line] $150.00
  // Each segment is equal width. Dots sit at junctions.
  const DOT_SIZE = 12; // px
  const SEGMENT_COUNT = milestones.length + 1; // e.g. 4 segments for 3 dots

  return (
    <div className="w-full py-4 px-1">
      {/* Track row */}
      <div className="flex items-center" style={{ gap: 0 }}>
        {milestones.map((m, i) => {
          const achieved = subtotal >= m.threshold;
          // Progress through this segment
          const segStart = i === 0 ? 0 : milestones[i - 1].threshold;
          const segEnd = m.threshold;
          const segProgress = Math.min(Math.max((subtotal - segStart) / (segEnd - segStart), 0), 1);
          const lineBeforeFilled = subtotal >= segStart;
          const lineBeforeProgress = lineBeforeFilled
            ? subtotal >= segEnd ? 1 : segProgress
            : 0;

          return (
            <div key={m.id} className="flex items-center" style={{ flex: 1 }}>
              {/* Line segment before this dot */}
              <div className="relative flex-1" style={{ height: '2px' }}>
                <div className="absolute inset-0 bg-[#e0d0d5] rounded-full" />
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#C8102E] rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${lineBeforeProgress * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              {/* Dot */}
              <div
                className="flex-shrink-0 rounded-full transition-all duration-300"
                style={{
                  width: `${DOT_SIZE}px`,
                  height: `${DOT_SIZE}px`,
                  background: achieved ? '#C8102E' : '#fff',
                  border: '2px solid #C8102E',
                  zIndex: 1,
                }}
              />
            </div>
          );
        })}

        {/* Final line segment after last dot */}
        {(() => {
          const lastMilestone = milestones[milestones.length - 1];
          const filled = subtotal >= (lastMilestone?.threshold ?? 0);
          return (
            <div className="relative flex-1" style={{ height: '2px', minWidth: '20px' }}>
              <div className="absolute inset-0 bg-[#e0d0d5] rounded-full" />
              {filled && <div className="absolute inset-0 bg-[#C8102E] rounded-full" />}
            </div>
          );
        })()}

        {/* $150.00 label — right of last segment, same line */}
        <div className="flex-shrink-0 ml-3">
          <span className="text-[#C8102E]" style={{ fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            ${maxThreshold.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Labels row — aligned under each dot */}
      <div className="flex items-start" style={{ gap: 0, marginTop: '8px' }}>
        {milestones.map((m, i) => {
          const achieved = subtotal >= m.threshold;
          return (
            <div key={m.id} className="flex items-start" style={{ flex: 1 }}>
              {/* Spacer matching the line before the dot — flex-1 */}
              <div className="flex-1" />
              {/* Label centered on dot — dot is DOT_SIZE wide */}
              <div
                className="flex-shrink-0 text-center"
                style={{ width: '0px', overflow: 'visible' }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: achieved ? 600 : 400,
                    color: achieved ? '#C8102E' : '#aaa',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    transform: 'translateX(-50%)',
                  }}
                >
                  {m.label}
                </span>
              </div>
            </div>
          );
        })}
        {/* Trailing spacer to match final segment */}
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}
