/**
 * ==============================================================================
 * 💳 PAYMENT, BANK ACCOUNT & UPI QR CONFIGURATION
 * ==============================================================================
 * You can change your UPI ID, Merchant Name, Bank Account Number, IFSC, and
 * pricing here in this file, or update it directly from the Master Admin Panel (/admin).
 *
 * Any update here will automatically update the QR Code and Payment Modals across
 * the entire website in real-time!
 */

export type PaymentConfigType = {
  upiId: string;
  merchantName: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  currency: string;
  monthlyPrice: number;
  annualPrice: number;
  supportEmail: string;
  supportPhone: string;
};

// ==============================================================================
// 🎟️ PROMOTIONAL & TEST COUPON CODES
// ==============================================================================
export type CouponType = {
  code: string;
  discountPct: number; // e.g. 99 for 99% off
  description: string;
  isTestOnly?: boolean;
};

export const AVAILABLE_COUPONS: Record<string, CouponType> = {
  TEST99: {
    code: 'TEST99',
    discountPct: 99,
    description: 'Special 99% Testing Discount',
    isTestOnly: true,
  },
  SHIVAM99: {
    code: 'SHIVAM99',
    discountPct: 99,
    description: 'Shivam VIP 99% Off Testing Code',
    isTestOnly: true,
  },
  VIP99: {
    code: 'VIP99',
    discountPct: 99,
    description: 'Exclusive 99% Off VIP Pass',
    isTestOnly: true,
  },
  PRO100: {
    code: 'PRO100',
    discountPct: 100,
    description: '100% Free Developer Test Pass',
    isTestOnly: true,
  },
  EARLYBIRD50: {
    code: 'EARLYBIRD50',
    discountPct: 50,
    description: 'Early Bird 50% Off Launch Offer',
    isTestOnly: false,
  },
};

export function validateCouponCode(inputCode: string): {
  valid: boolean;
  coupon?: CouponType;
  discountPct: number;
  error?: string;
} {
  const cleanCode = inputCode.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountPct: 0, error: 'Please enter a coupon code.' };
  }

  const found = AVAILABLE_COUPONS[cleanCode];
  if (found) {
    return {
      valid: true,
      coupon: found,
      discountPct: found.discountPct,
    };
  }

  return {
    valid: false,
    discountPct: 0,
    error: `Invalid coupon code "${inputCode.trim()}". Try TEST99 or SHIVAM99 for testing.`,
  };
}

const PAYMENT_STORAGE_KEY = 'investoriq_payment_config';

export const DEFAULT_PAYMENT_CONFIG: PaymentConfigType = {
  // 1. Your UPI ID / VPA (e.g. yourname@okaxis, yourphone@upi, business@icici, etc.)
  upiId: 'investor.shivam5049@ybl',

  // 2. Your Merchant / Business Name (displayed on GPay, PhonePe, Paytm, CRED)
  merchantName: 'Investor Intelligence Research Inc',

  // 3. Bank Account Details (for direct NEFT / IMPS / RTGS transfers)
  accountHolder: 'Investor Intelligence Inc',
  bankName: 'HDFC Bank',
  accountNumber: '50100419751029',
  ifscCode: 'HDFC0001882',

  // 4. Currency & Pricing
  currency: 'INR',
  monthlyPrice: 299,
  annualPrice: 2399,

  // 5. Support Contact
  supportEmail: 'billing@investorintelligence.in',
  supportPhone: '+91 98765 43210',
};

export function getPaymentConfig(): PaymentConfigType {
  if (typeof window === 'undefined') {
    return DEFAULT_PAYMENT_CONFIG;
  }

  try {
    const raw = window.localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(DEFAULT_PAYMENT_CONFIG));
      return DEFAULT_PAYMENT_CONFIG;
    }
    return { ...DEFAULT_PAYMENT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function savePaymentConfig(config: Partial<PaymentConfigType>): PaymentConfigType {
  if (typeof window === 'undefined') {
    return DEFAULT_PAYMENT_CONFIG;
  }

  const current = getPaymentConfig();
  const updated: PaymentConfigType = {
    ...current,
    ...config,
  };

  window.localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export const PAYMENT_CONFIG = {
  ...DEFAULT_PAYMENT_CONFIG,

  // Helper function to generate standard NPCI compliant UPI Intent URI
  getUpiPaymentUrl: (amount: number, note: string = 'Pro Subscription') => {
    const config = getPaymentConfig();
    const encodedMerchant = encodeURIComponent(config.merchantName);
    const encodedNote = encodeURIComponent(note);
    return `upi://pay?pa=${config.upiId}&pn=${encodedMerchant}&am=${amount}&cu=INR&tn=${encodedNote}`;
  },

  // Dynamic high-resolution QR code generator for GPay/PhonePe/Paytm
  getQrCodeImageUrl: (amount: number, note: string = 'Investor Intelligence Pro') => {
    const upiUrl = PAYMENT_CONFIG.getUpiPaymentUrl(amount, note);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}&margin=10`;
  },
};
