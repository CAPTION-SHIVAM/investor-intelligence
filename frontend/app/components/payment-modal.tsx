'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown,
  CheckCircle2,
  X,
  QrCode,
  CreditCard,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
  Download,
  Sparkles,
  Lock,
  Copy,
  Tag,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { postJson } from '../../lib/api';
import {
  getStoredUser,
  saveUserProfile,
  computeExpiryDate,
  submitPaymentRequest,
  validateUpiUtr,
  type UserPlan,
} from '../../lib/user-profile';
import {
  getPaymentConfig,
  validateCouponCode,
  type CouponType,
} from '../../lib/payment-config';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: UserPlan;
  onSuccess?: () => void;
};

export function PaymentModal({ isOpen, onClose, initialPlan = 'PRO', onSuccess }: PaymentModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [step, setStep] = useState<'SELECT' | 'CHECKOUT' | 'PENDING_VERIFICATION' | 'SUCCESS'>('SELECT');
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [config, setConfig] = useState(getPaymentConfig());

  // Discreet Coupon State (Private)
  const [showPromoBox, setShowPromoBox] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponType | null>(null);
  const [couponError, setCouponError] = useState('');

  // Payment Verification Fields (Mandatory UTR / Transaction Reference ID)
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const [invoiceData, setInvoiceData] = useState<{
    invoiceId: string;
    amount: number;
    originalAmount: number;
    discountAmount: number;
    couponCode?: string;
    plan: string;
    txnRef: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(getPaymentConfig());
      setPaymentError('');
      setUtrNumber('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const planPrices = {
    FREE: { monthly: 0, annual: 0 },
    PRO: { monthly: config.monthlyPrice, annual: config.annualPrice },
    INSTITUTIONAL: { monthly: 799, annual: 7999 },
  };

  const rawBaseAmount = billingCycle === 'annual' ? planPrices[selectedPlan].annual : planPrices[selectedPlan].monthly;
  const discountAmount = appliedCoupon ? Math.floor((rawBaseAmount * appliedCoupon.discountPct) / 100) : 0;

  // If 100% discount, final amount is 0; if 99% discount, ensure minimum ₹1
  const finalAmount = appliedCoupon
    ? appliedCoupon.discountPct === 100
      ? 0
      : Math.max(1, rawBaseAmount - discountAmount)
    : rawBaseAmount;

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCouponError('');

    const res = validateCouponCode(couponInput);
    if (!res.valid || !res.coupon) {
      setCouponError(res.error || 'Invalid coupon code.');
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(res.coupon);
    setCouponError('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(config.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  const handleStartCheckout = () => {
    if (selectedPlan === 'FREE') {
      const user = getStoredUser();
      saveUserProfile({ ...user, plan: 'FREE' });
      onClose();
      if (onSuccess) onSuccess();
      return;
    }
    setStep('CHECKOUT');
  };

  // STRICT VERIFICATION & SUBMISSION: Requires genuine 12-digit numeric non-dummy UTR
  const handleVerifyAndCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    const cleanUtr = utrNumber.trim();

    // If payment is greater than 0, user MUST enter a valid, non-dummy 12-digit numeric UTR
    if (finalAmount > 0) {
      const validation = validateUpiUtr(cleanUtr);
      if (!validation.valid) {
        setPaymentError(validation.error || 'Please enter a valid 12-digit numeric UPI Reference / UTR Number.');
        return;
      }
    }

    setLoading(true);

    try {
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const txnRef = cleanUtr || `FREE-PASS-${Date.now().toString().slice(-6)}`;

      const res = await submitPaymentRequest({
        utrRef: txnRef,
        plan: selectedPlan,
        billingCycle: billingCycle,
        amount: finalAmount,
        couponCode: appliedCoupon?.code,
      });

      setInvoiceData({
        invoiceId: orderId,
        amount: finalAmount,
        originalAmount: rawBaseAmount,
        discountAmount: discountAmount,
        couponCode: appliedCoupon?.code,
        plan: selectedPlan,
        txnRef: txnRef,
      });

      if (res.instantUnlock) {
        // Free promo code (₹0) -> instant success
        setStep('SUCCESS');
        if (onSuccess) onSuccess();
      } else {
        // Paid subscription -> Pending Admin Verification
        setStep('PENDING_VERIFICATION');
        // DO NOT call onSuccess() and DO NOT redirect! User remains on FREE until admin approves.
      }
    } catch (err: any) {
      console.error('Payment submission failed:', err);
      setPaymentError(err?.message || 'Failed to submit payment reference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSubmissionSlip = () => {
    if (!invoiceData) return;
    const content = `=====================================================
PAYMENT SUBMISSION SLIP - PENDING ADMIN VERIFICATION
INVESTOR INTELLIGENCE RESEARCH PLATFORMS INDIA
=====================================================
Submission ID: ${invoiceData.invoiceId}
Transaction Ref / UTR: ${invoiceData.txnRef}
Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
Status: UNDER VERIFICATION (Pending Admin Approval)

Requested Plan: ${invoiceData.plan} Investor Intelligence Membership
Billing Term: ${billingCycle.toUpperCase()}
Amount Paid: ₹${invoiceData.amount} INR
${invoiceData.couponCode ? `Coupon Applied: ${invoiceData.couponCode} (-₹${invoiceData.discountAmount})\n` : ''}Payee UPI ID: ${config.upiId} (${config.merchantName})
Bank Account: ${config.accountNumber} (${config.bankName}, IFSC: ${config.ifscCode})

-----------------------------------------------------
NOTICE & ACTIVATION POLICY:
Your 12-digit transaction reference has been logged in
the verification queue. Once verified against our bank
statement by the administration team, your Pro Plan
will be automatically unlocked within 5–15 minutes.
-----------------------------------------------------
For billing support: ${config.supportEmail}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SubmissionSlip_${invoiceData.invoiceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReceipt = () => {
    if (!invoiceData) return;
    const content = `=====================================================
TAX INVOICE & SUBSCRIPTION RECEIPT
INVESTOR INTELLIGENCE RESEARCH PLATFORMS INDIA
=====================================================
Invoice ID: ${invoiceData.invoiceId}
Transaction Ref / UTR: ${invoiceData.txnRef}
Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
Status: VERIFIED & ACTIVE (Pro Plan Unlocked)

Customer Plan: ${invoiceData.plan} Investor Intelligence Membership
Billing Term: ${billingCycle.toUpperCase()}
UPI ID / Payee: ${config.upiId} (${config.merchantName})
Bank Account: ${config.accountNumber} (${config.bankName}, IFSC: ${config.ifscCode})

-----------------------------------------------------
Original Price: ₹${invoiceData.originalAmount}
Discount Applied: -₹${invoiceData.discountAmount} ${invoiceData.couponCode ? `(Coupon: ${invoiceData.couponCode})` : ''}
Subtotal: ₹${invoiceData.amount}
GST (18% inclusive): ₹${Math.round((invoiceData.amount * 18) / 118)}
Total Paid: ₹${invoiceData.amount} INR
-----------------------------------------------------
Thank you for subscribing to Investor Intelligence Pro!
For billing support: ${config.supportEmail}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceData.invoiceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.merchantName)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(
      `Pro Sub ${appliedCoupon?.code || ''}`
    )}`
  )}&margin=8`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      {/* Properly Proportioned, Scrollable Modal Box */}
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-700/80 bg-[#080e1c] p-5 sm:p-7 shadow-2xl my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        {/* Close Button (Keeps User on Free Plan if closed) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition z-10"
        >
          <X size={18} />
        </button>

        {/* STEP 1: PLAN SELECTOR */}
        {step === 'SELECT' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-1">
                <Crown size={15} />
                <span>Upgrade Workspace</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white">Choose Your Intelligence Tier</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Unlock institutional 6-pillar reality scores, live GMP tracking, and DRHP red-flag analysis.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center">
              <div className="inline-flex rounded-full border border-slate-800 bg-slate-900 p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`rounded-full px-4 py-1 text-xs font-bold transition ${
                    billingCycle === 'monthly' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`rounded-full px-4 py-1 text-xs font-bold transition ${
                    billingCycle === 'annual' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annual <span className="ml-1 text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">Save 20%</span>
                </button>
              </div>
            </div>

            {/* Plans List */}
            <div className="space-y-2.5">
              {/* Pro Plan */}
              <div
                onClick={() => setSelectedPlan('PRO')}
                className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                  selectedPlan === 'PRO'
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/15'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-base font-bold text-white">Pro Investor</span>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-black text-cyan-300">POPULAR</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">Full 6-pillar reality scores, live GMP radar, &amp; Gift Point verdicts</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-xl font-black text-white">
                      ₹{billingCycle === 'annual' ? config.annualPrice : config.monthlyPrice}
                    </p>
                    <p className="text-[10px] text-slate-400">{billingCycle === 'annual' ? '/year' : '/month'}</p>
                  </div>
                </div>
              </div>

              {/* Institutional Plan */}
              <div
                onClick={() => setSelectedPlan('INSTITUTIONAL')}
                className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                  selectedPlan === 'INSTITUTIONAL'
                    ? 'border-purple-500 bg-purple-500/10 shadow-md shadow-purple-500/15'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles size={15} className="text-purple-400" /> Institutional VIP
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5">For family offices, multi-seat teams, and custom DRHP audits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg font-black text-white">
                      ₹{billingCycle === 'annual' ? '7,999' : '799'}
                    </p>
                    <p className="text-[10px] text-slate-400">{billingCycle === 'annual' ? '/year' : '/month'}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartCheckout}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01]"
            >
              <span>Continue to Payment (₹{rawBaseAmount})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: CHECKOUT & PAYMENT GATEWAY WITH MANDATORY UTR VERIFICATION */}
        {step === 'CHECKOUT' && (
          <form onSubmit={handleVerifyAndCompletePayment} className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-white">Secure Checkout &amp; Activation</h3>
                <p className="text-xs text-slate-400">
                  Plan: <strong className="text-white">{selectedPlan}</strong> ({billingCycle} billing)
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                <Lock size={11} /> 256-Bit SSL
              </span>
            </div>

            {/* DISCREET PROMO CODE (Private) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
              {!appliedCoupon ? (
                <div>
                  {!showPromoBox ? (
                    <button
                      type="button"
                      onClick={() => setShowPromoBox(true)}
                      className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold hover:underline"
                    >
                      <Tag size={13} />
                      <span>Have a promo code?</span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                          <Tag size={13} className="text-cyan-400" /> Enter Promo Code
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPromoBox(false)}
                          className="text-[11px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-white uppercase font-mono-code placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-extrabold text-slate-950 hover:bg-cyan-400 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-1 text-[11px] font-medium text-rose-400 flex items-center gap-1">
                          <AlertCircle size={12} /> {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="font-mono-code font-bold text-emerald-300">{appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-400 font-extrabold">({appliedCoupon.discountPct}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Original Price:</span>
                <span>₹{rawBaseAmount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount ({appliedCoupon.discountPct}% Off):</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-800 pt-1 text-xs font-bold text-white">
                <span>Total Amount to Pay:</span>
                <span className="text-cyan-400 font-black text-sm">₹{finalAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-bold transition ${
                  paymentMethod === 'UPI'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <QrCode size={16} />
                <span>Instant UPI (₹{finalAmount})</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-bold transition ${
                  paymentMethod === 'CARD'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <CreditCard size={16} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-bold transition ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <Building size={16} />
                <span>Bank / NEFT</span>
              </button>
            </div>

            {/* Compact Live UPI QR Code Container */}
            {paymentMethod === 'UPI' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
                <p className="text-xs font-bold text-slate-200">1. Scan &amp; Pay with any UPI App</p>
                <p className="text-[11px] text-cyan-400 font-bold mb-2">Exact Amount: ₹{finalAmount}</p>

                {/* Real Dynamic High-Resolution QR Code */}
                <div className="mx-auto h-32 w-32 rounded-xl bg-white p-1.5 shadow-lg flex items-center justify-center">
                  <img
                    src={qrImageUrl}
                    alt="UPI Payment QR Code"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-xs font-mono-code text-cyan-400 font-bold bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                    {config.upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="rounded-lg bg-slate-800 p-1 text-slate-300 hover:bg-slate-700 transition"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                {copiedUpi && <p className="text-[10px] text-emerald-400 font-bold mt-0.5">UPI ID Copied!</p>}
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
                <input
                  placeholder="Card Number (e.g. 4242 •••• •••• 4242)"
                  defaultValue="4242 4242 4242 4242"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="MM / YY"
                    defaultValue="12/28"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    placeholder="CVV"
                    defaultValue="888"
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs space-y-1.5">
                <p className="font-bold text-cyan-300 text-xs">Bank Transfer Details (NEFT / IMPS):</p>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Account Holder:</span>
                  <span className="font-bold text-white">{config.accountHolder}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Bank Name:</span>
                  <span className="font-bold text-white">{config.bankName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Account Number:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-code font-bold text-cyan-400">{config.accountNumber}</span>
                    <button type="button" onClick={handleCopyAccount} className="text-slate-400 hover:text-white">
                      {copiedAccount ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-mono-code font-bold text-emerald-400">{config.ifscCode}</span>
                </div>
              </div>
            )}

            {/* MANDATORY PAYMENT VERIFICATION: 12-DIGIT UTR / TRANSACTION REF INPUT */}
            {finalAmount > 0 && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-amber-300">
                    2. Enter 12-Digit UPI Ref / UTR No. (Mandatory)
                  </label>
                  <span
                    className={`font-mono-code text-[11px] font-bold px-2 py-0.5 rounded transition ${
                      utrNumber.length === 12
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {utrNumber.length}/12 digits {utrNumber.length === 12 ? '✓' : ''}
                  </span>
                </div>
                <input
                  required
                  type="text"
                  maxLength={12}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="e.g. 423819283921 (12 digits from GPay / PhonePe / Paytm)"
                  className="w-full rounded-lg border border-amber-500/50 bg-slate-950 px-3 py-2 text-white font-mono-code text-xs placeholder:text-slate-500 focus:border-amber-400 focus:outline-none tracking-wider"
                />
                <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-2.5 text-[10px] text-slate-300 space-y-1">
                  <p className="flex items-center gap-1 text-amber-300 font-semibold">
                    <ShieldCheck size={12} />
                    <span>Payment Verification &amp; Anti-Fraud Policy:</span>
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Your Pro access will be verified and unlocked once your 12-digit UTR is confirmed against our bank statement by the admin. Unpaid or fake transaction references will not be approved.
                  </p>
                </div>
              </div>
            )}

            {paymentError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-xs text-rose-300 font-semibold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-400" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="rounded-xl border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 py-2.5 text-xs font-extrabold text-slate-950 shadow-md shadow-cyan-500/25 transition hover:scale-[1.01] disabled:opacity-50"
              >
                {loading
                  ? 'Submitting Reference...'
                  : finalAmount === 0
                  ? `Activate Free Pass & Unlock ${selectedPlan}`
                  : `Submit 12-Digit UTR for Verification`}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3A: PENDING VERIFICATION (For Paid UPI / UTR) */}
        {step === 'PENDING_VERIFICATION' && invoiceData && (
          <div className="text-center py-2 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg animate-pulse">
              <Clock size={30} />
            </div>
            <div>
              <h3 className="font-heading text-xl font-black text-white">Payment Submitted for Verification</h3>
              <p className="mt-0.5 text-xs text-amber-300 font-bold">
                ⚠️ Premium Access Remains Locked (Your Plan is FREE)
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-3 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Submission ID:</span>
                <span className="font-mono-code font-bold text-white">{invoiceData.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted UTR Ref:</span>
                <span className="font-mono-code font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                  {invoiceData.txnRef}
                </span>
              </div>
              {invoiceData.couponCode && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Applied:</span>
                  <span className="font-bold">{invoiceData.couponCode} (-₹{invoiceData.discountAmount})</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Amount to Verify:</span>
                <span className="font-bold text-white">₹{invoiceData.amount} ({billingCycle} plan)</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                <span className="text-slate-400">Current Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[10px] uppercase tracking-wider">
                  <Clock size={11} /> Pending Admin Verification
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-amber-950/30 border border-amber-500/30 p-3 text-left text-[11px] text-amber-200/90 leading-relaxed space-y-1">
              <p>
                🔒 <strong className="text-white">Anti-Fraud &amp; Ledger Check:</strong> Entering a 12-digit UTR does not grant instant Pro access.
              </p>
              <p className="text-slate-300">
                Our administration desk verifies this reference directly in our bank statement. Once verified, your Pro membership will unlock automatically within 5–15 minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadSubmissionSlip}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
              >
                <Download size={13} />
                <span>Download Slip</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/ipos');
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
              >
                <span>Continue Free Version →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3B: INSTANT SUCCESS (For 100% Free Coupon Passes) */}
        {step === 'SUCCESS' && invoiceData && (
          <div className="text-center py-3 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg">
              <CheckCircle2 size={30} />
            </div>
            <div>
              <h3 className="font-heading text-xl font-black text-white">Premium Unlocked!</h3>
              <p className="mt-0.5 text-xs text-slate-300">
                Welcome to <strong className="text-cyan-400">Investor Intelligence {invoiceData.plan}</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice ID:</span>
                <span className="font-mono-code font-bold text-white">{invoiceData.invoiceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference:</span>
                <span className="font-mono-code font-bold text-emerald-400">{invoiceData.txnRef}</span>
              </div>
              {invoiceData.couponCode && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Applied:</span>
                  <span className="font-bold">{invoiceData.couponCode} (100% Free Pass)</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-white">₹{invoiceData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Status:</span>
                <span className="font-bold text-emerald-400 uppercase">PRO ACTIVE</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
              >
                <Download size={13} />
                <span>Tax Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/dashboard');
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2 text-xs font-black text-slate-950 shadow-md transition hover:scale-105"
              >
                Start Exploring Premium →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
