import Razorpay from 'razorpay';

let _razorpay: InstanceType<typeof Razorpay> | null = null;

export function getRazorpay() {
  if (!_razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
    }
    _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _razorpay;
}

export const PLANS = {
  pro_monthly: {
    name: 'Pro Monthly',
    amount: 29900, // ₹299 in paise
    priceDisplay: '₹299',
    period: '/month',
    description: 'ResuméRoast Pro - Monthly',
  },
  pro_yearly: {
    name: 'Pro Yearly',
    amount: 199900, // ₹1999 in paise (~₹167/mo, save 44%)
    priceDisplay: '₹1,999',
    period: '/year',
    description: 'ResuméRoast Pro - Yearly (Save 44%)',
  },
} as const;
