import React from 'react';
import { useCart } from '../store/cart-context';
import { useContent } from '../store/content-context';
import { ProgressRewards } from './ProgressRewards';
import { Plus, Star, Truck, Gift, Edit } from 'lucide-react';
import { ET } from './EditableText';

interface OrderSummaryProps {
  showProgress?: boolean;
  showCheckoutBtn?: boolean;
  showPaypal?: boolean;
  showPromo?: boolean;
  showRewards?: boolean;
  showAttainedBenefits?: boolean;
  title?: string;
  onCheckout?: () => void;
}

export function OrderSummary({
  showProgress = true,
  showCheckoutBtn = false,
  showPaypal = false,
  showPromo = false,
  showRewards = false,
  showAttainedBenefits = false,
  title,
  onCheckout,
}: OrderSummaryProps) {
  const {
    hasMembership,
    effectiveMembership,
    isSignedInMember,
    addMembership,
    getOrderLines,
    getSubtotal,
    getTotalPV,
    getShipping,
    getTax,
    getTotal,
    getVipSavings,
    getItemCount,
    getProductSubtotal,
    getPromoDiscount,
    getVoucherDiscount,
    promoCode,
    promoApplied,
    setPromoCode,
    setPromoApplied,
    voucherCode,
    voucherApplied,
    shippingState,
    currentPage,
  } = useCart();
  const { get } = useContent();

  const lines = getOrderLines();
  const subtotal = getSubtotal();
  const totalPV = getTotalPV();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const vipSavings = getVipSavings();
  const itemCount = getItemCount();
  const productSubtotal = getProductSubtotal();
  const earnedFreeShipping = productSubtotal >= 75;
  const promoDiscount = getPromoDiscount();
  const voucherDiscount = getVoucherDiscount();

  const [promoOpen, setPromoOpen] = React.useState(false);
  const [promoInput, setPromoInput] = React.useState(promoCode);
  const [promoError, setPromoError] = React.useState(false);

  const rewards: { text: string; icon: typeof Star }[] = [];
  if (subtotal >= 35 && !isSignedInMember) rewards.push({ text: get('rewards.membershipUnlocked'), icon: Star });
  if (earnedFreeShipping) rewards.push({ text: get('rewards.freeShippingUnlocked'), icon: Truck });
  if (subtotal >= 150) rewards.push({ text: get('rewards.freeGiftUnlocked'), icon: Gift });

  const displayTitle = title || get('orderSummary.title');

  return (
    <div>
      {/* Progress rewards — outside grey container, desktop only (mobile shows in sticky header) */}
      {showProgress && (
        <div className="hidden lg:block mb-2">
          <ProgressRewards variant="desktop" />
        </div>
      )}

      {/* Order summary grey container */}
      <div className="bg-[#f5f5f5] rounded-2xl p-6">

      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '22px', fontWeight: 400, marginBottom: '16px' }}>
        {displayTitle}
      </div>

      {/* Product lines — computed, not editable */}
      <div>
        {lines.map((l, i) => (
          <div key={i} className="flex justify-between items-baseline mb-2" style={{ fontSize: '14px' }}>
            <span className="text-[#555]">
              {l.name}{l.qty > 1 ? ` x${l.qty}` : ''}
            </span>
            <span style={{ fontWeight: 500 }}>${(l.price * l.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* PV Total */}
      {effectiveMembership && (
      <div
        className="flex justify-between py-2.5 my-2 border-t border-b border-[#e0e0e0]"
        style={{ fontSize: '14px', fontWeight: 700 }}
      >
        <span><ET k="orderSummary.pvTotal" /></span>
        <span>{totalPV} {get('cartItem.pvSuffix')}</span>
      </div>
      )}

      {/* Divider before Subtotal when no PV Total */}
      {!effectiveMembership && <hr className="border-t border-[#e0e0e0] my-2" />}

      {/* Promos & Vouchers section — between PV and Subtotal */}
      {(promoApplied || voucherApplied) && (
        <div className="py-2 my-1">
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Promos & Vouchers
          </div>
          {promoApplied && (
            <div className="flex justify-between items-baseline mb-1.5" style={{ fontSize: '13px' }}>
              <span className="text-[#2e7d32]">Promo: {promoCode}</span>
              <span className="text-[#2e7d32]" style={{ fontWeight: 600 }}>-${promoDiscount.toFixed(2)}</span>
            </div>
          )}
          {voucherApplied && (
            <div className="flex justify-between items-baseline mb-1.5" style={{ fontSize: '13px' }}>
              <span className="text-[#2e7d32]">Voucher: {voucherCode}</span>
              <span className="text-[#2e7d32]" style={{ fontWeight: 600 }}>-${voucherDiscount.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Subtotal */}
      <div className="flex justify-between items-baseline mb-2" style={{ fontSize: '14px' }}>
        <span className="text-[#555]"><ET k="orderSummary.subtotalLabel" /> ({itemCount} Item{itemCount !== 1 ? 's' : ''})</span>
        <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-baseline mb-2" style={{ fontSize: '14px' }}>
        <span className="text-[#555]"><ET k="orderSummary.shippingLabel" /></span>
        <span style={{ fontWeight: 500, color: earnedFreeShipping ? '#2e7d32' : undefined }}>
          {earnedFreeShipping ? get('orderSummary.freeText') : `$${shipping.toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between items-baseline mb-2" style={{ fontSize: '14px' }}>
        <span className="text-[#555]">
          {shippingState ? `Tax (${shippingState} 8.9%)` : <ET k="orderSummary.taxLabel" />}
        </span>
        <span style={{ fontWeight: 500 }}>
          {shippingState ? `$${tax.toFixed(2)}` : <ET k="orderSummary.taxValue" />}
        </span>
      </div>

      <hr className="border-t border-[#e0e0e0] my-3" />

      {/* Total */}
      <div className="flex justify-between items-baseline mb-1">
        <span style={{ fontSize: '15px', fontWeight: 700 }}>
          {currentPage === 'checkout' ? 'Order Total' : <ET k="orderSummary.estimatedTotal" />}
        </span>
        <span style={{ fontSize: '20px', fontWeight: 800 }}>${total.toFixed(2)}</span>
      </div>

      {/* VIP Savings */}
      {effectiveMembership ? (
        <div
          className="text-center rounded-md my-2.5 py-2 px-2"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            background: '#e8f5e9',
            color: '#2e7d32',
          }}
        >
          {get('orderSummary.vipSavingsPrefix')} ${vipSavings.toFixed(2)} {get('orderSummary.vipSavingsSuffix')}
        </div>
      ) : (
        <button
          className="w-full flex items-center justify-center gap-1.5 rounded-md my-2.5 py-2 px-2 border-none cursor-pointer transition-colors hover:bg-[#e8e8e8]"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            background: '#f3f3f3',
            color: currentPage === 'checkout' ? '#970F21' : '#3E8040',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onClick={() => addMembership()}
        >
          <Plus size={14} />
          {get('orderSummary.addVipPrefix')} ${(subtotal * 0.25).toFixed(2)}!
        </button>
      )}

      {/* Promo code */}
      {showPromo && (
        <div className="mt-3">
          {promoApplied ? (
            /* Confirmed state */
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[#2e7d32]" style={{ fontSize: '13px', fontWeight: 600 }}>
                <span>✓</span>
                <span>Promo Confirmed</span>
              </div>
              <span className="text-[#555]" style={{ fontSize: '12px' }}>"{promoCode}" added</span>
              <button
                className="bg-transparent border-none cursor-pointer p-0.5 text-[#888] hover:text-[#C8102E] transition-colors"
                onClick={() => {
                  setPromoApplied(false);
                  setPromoInput(promoCode);
                  setPromoOpen(true);
                }}
              >
                <Edit size={14} />
              </button>
            </div>
          ) : promoOpen ? (
            /* Input state */
            <div>
              <div className="flex gap-2 mt-0">
                <input
                  type="text"
                  placeholder={get('orderSummary.promoPlaceholder')}
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value); if (promoError) setPromoError(false); }}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none ${promoError ? 'border-[#d32f2f] bg-[#fff5f5]' : 'border-[#e0e0e0] focus:border-[#C8102E]'}`}
                  style={{ fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
              {promoError && (
                <div className="text-[#d32f2f] mt-1" style={{ fontSize: '12px', fontWeight: 500 }}>Required</div>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-[#C8102E] text-white px-3.5 py-2 rounded-md border-none cursor-pointer"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                  onClick={() => {
                    if (promoInput.trim()) {
                      setPromoCode(promoInput.trim());
                      setPromoApplied(true);
                      setPromoOpen(false);
                      setPromoError(false);
                    } else {
                      setPromoError(true);
                    }
                  }}
                >
                  Apply
                </button>
                <button
                  className="bg-transparent text-[#888] px-3.5 py-2 rounded-md border border-[#e0e0e0] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                  style={{ fontSize: '13px', fontWeight: 600 }}
                  onClick={() => {
                    setPromoOpen(false);
                    setPromoInput('');
                    setPromoError(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Toggle state */
            <button
              className="flex items-center gap-1 text-[#C8102E] bg-transparent border-none cursor-pointer p-0"
              style={{ fontSize: '13px', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
              onClick={() => setPromoOpen(true)}
            >
              <span style={{ fontSize: '15px' }}>+</span> <ET k="orderSummary.promoLabel" />
            </button>
          )}
        </div>
      )}

      {/* Checkout button */}
      {showCheckoutBtn && (
        <button
          className="w-full bg-[#C8102E] text-white py-3.5 px-7 rounded-full border-none cursor-pointer mt-4 transition-all hover:bg-[#a00d24] hidden lg:block"
          style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.3px' }}
          onClick={onCheckout}
        >
          <ET k="orderSummary.checkoutBtn" />
        </button>
      )}

      {/* PayPal section */}
      {showPaypal && (
        <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
          <button
            className="w-full bg-[#009cde] text-white py-3 rounded-full border-none cursor-pointer flex items-center justify-center gap-2 transition-colors hover:bg-[#007ab8] hidden lg:flex mb-2"
            style={{ fontSize: '15px', fontWeight: 700 }}
          >
            <span style={{ fontWeight: 800, fontSize: '16px' }}><ET k="orderSummary.paypalLabel" /></span> <ET k="orderSummary.paypalBuyNow" />
          </button>
          <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#555' }}>
            <strong style={{ color: '#003087' }}>{get('orderSummary.paypalLabel')}</strong> {get('orderSummary.paypalPay4')} $
            {(total / 4).toFixed(2)}.{' '}
            <a className="text-[#009cde] cursor-pointer"><ET k="orderSummary.paypalLearnMore" /></a>
          </div>
        </div>
      )}

      {/* Rewards */}
      {showRewards && rewards.length > 0 && (
        <div className="mt-3 bg-[#f9e8eb] rounded-lg p-2.5">
          {rewards.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-center gap-1.5 text-[#C8102E] mb-1" style={{ fontSize: '12px', fontWeight: 600 }}>
                <Icon size={14} strokeWidth={2.5} />
                {r.text}
              </div>
            );
          })}
        </div>
      )}

      {/* Attained Benefits — checkout only */}
      {showAttainedBenefits && rewards.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#e0e0e0]">
          {subtotal >= 35 && !isSignedInMember && (
            <div className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2e7d32' }}>
              <Star size={15} strokeWidth={2.5} />
              <span>{get('rewards.membershipUnlocked')}</span>
            </div>
          )}
          {earnedFreeShipping && (
            <div className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2e7d32' }}>
              <Truck size={15} strokeWidth={2.5} />
              <span>{get('rewards.freeShippingUnlocked')}</span>
            </div>
          )}
          {subtotal >= 150 && (
            <div className="flex items-center gap-2 mb-2" style={{ fontSize: '13px', fontWeight: 600, color: '#2e7d32' }}>
              <Gift size={15} strokeWidth={2.5} />
              <span>{get('rewards.freeGiftUnlocked')}</span>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}