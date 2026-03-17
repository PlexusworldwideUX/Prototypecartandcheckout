import { Star, Truck, Gift } from 'lucide-react';
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
    { threshold: 35, label: get('progress.membership'), icon: Star, id: 'membership', position: 20 },
    { threshold: 75, label: get('progress.freeShipping'), icon: Truck, id: 'shipping', position: 55 },
    { threshold: 150, label: get('progress.freeGift'), icon: Gift, id: 'gift', position: 85 },
  ];

  // Signed-in members already have membership — exclude that milestone
  const milestones = isSignedInMember
    ? allMilestones.filter(m => m.id !== 'membership').map((m, i, arr) => ({
        ...m,
        position: arr.length === 1 ? 50 : i === 0 ? 35 : 75,
      }))
    : allMilestones;

  const progress = Math.min((subtotal / 150) * 100, 100);

  const achievedMilestones = milestones.filter(m => subtotal >= m.threshold);
  const highestAchieved = achievedMilestones.length > 0
    ? achievedMilestones[achievedMilestones.length - 1]
    : null;

  const isDesktop = variant === 'desktop';
  const bgClass = isDesktop ? 'bg-transparent' : 'bg-white';
  const iconBg = isDesktop ? 'bg-[#F3F3F3]' : 'bg-white';

  return (
    <div className={`${bgClass} w-full py-3`}>
      <div className="flex items-start gap-0">
        <div className="flex-1 min-w-0">
          <div className="relative" style={{ height: '22px' }}>
            <div
              className="absolute left-0 right-0 h-[5px] bg-[#e0e0e0] rounded-full overflow-hidden"
              style={{ top: '9px' }}
            >
              <motion.div
                className="h-full bg-[#C8102E] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>

            {milestones.map(m => {
              const achieved = subtotal >= m.threshold;
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="absolute"
                  style={{
                    left: `${m.position}%`,
                    top: '1px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className={`w-[24px] h-[24px] ${iconBg} rounded-full flex items-center justify-center`}>
                    <Icon
                      size={18}
                      className={`transition-colors duration-300 ${
                        achieved ? 'text-[#C8102E]' : 'text-[#d0d0d0]'
                      }`}
                      strokeWidth={achieved ? 2.5 : 1.8}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative" style={{ height: '14px', marginTop: '1px' }}>
            {milestones.map(m => {
              const achieved = subtotal >= m.threshold;
              return (
                <div
                  key={m.id}
                  className="absolute text-center"
                  style={{
                    left: `${m.position}%`,
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    className={achieved ? 'text-[#C8102E]' : 'text-[#999]'}
                    style={{ fontSize: '12px', fontWeight: achieved ? 600 : 400 }}
                  >
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="flex-shrink-0 flex items-center justify-end"
          style={{ width: '64px', paddingTop: '4px' }}
        >
          <span
            className={highestAchieved ? 'text-[#C8102E]' : 'text-[#bbb]'}
            style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            {highestAchieved
              ? `+ $${highestAchieved.threshold.toFixed(2)}`
              : '$0.00'}
          </span>
        </div>
      </div>
    </div>
  );
}