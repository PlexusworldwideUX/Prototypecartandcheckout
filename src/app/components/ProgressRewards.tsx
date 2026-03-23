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
  const progress = Math.min((subtotal / maxThreshold) * 100, 100);

  // Position each dot as a percentage of the track width (excluding the right label)
  // Track spans from 0% to 100%; dots sit at each milestone's fraction of max
  const getDotPosition = (threshold: number) =>
    `${(threshold / maxThreshold) * 100}%`;

  return (
    <div className="w-full pt-3 pb-3">
      {/* Track row: line + dots + $150 label at right end */}
      <div className="relative flex items-center" style={{ height: '20px' }}>
        {/* Background track */}
        <div
          className="absolute left-0 right-0 bg-[#e0e0e0] rounded-full"
          style={{ height: '2px', top: '50%', transform: 'translateY(-50%)' }}
        />
        {/* Progress fill */}
        <motion.div
          className="absolute left-0 bg-[#C8102E] rounded-full"
          style={{ height: '2px', top: '50%', transform: 'translateY(-50%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* Milestone dots */}
        {milestones.map(m => {
          const achieved = subtotal >= m.threshold;
          return (
            <div
              key={m.id}
              className="absolute"
              style={{
                left: getDotPosition(m.threshold),
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #C8102E',
                  background: achieved ? '#C8102E' : '#fff',
                }}
              />
            </div>
          );
        })}
        {/* $150 label pinned to far right of track */}
        <div
          className="absolute right-0"
          style={{ transform: 'translateX(0)' }}
        >
          <span className="text-[#C8102E]" style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            ${maxThreshold.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Labels row — positioned under each dot */}
      <div className="relative" style={{ height: '20px', marginTop: '6px' }}>
        {milestones.map(m => {
          const achieved = subtotal >= m.threshold;
          // Use same percentage positioning but offset the label to avoid overflow
          const pct = (m.threshold / maxThreshold) * 100;
          return (
            <div
              key={m.id}
              className="absolute text-center"
              style={{
                left: `${pct}%`,
                transform: pct > 80 ? 'translateX(-80%)' : pct < 20 ? 'translateX(-20%)' : 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: achieved ? 600 : 400,
                  color: achieved ? '#C8102E' : '#999',
                }}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}