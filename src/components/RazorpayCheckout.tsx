'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RazorpayCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId?: string;
  email?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '₹299',
    period: '/month',
    savings: null,
    popular: true,
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: '₹1,999',
    period: '/year',
    savings: 'Save 44%',
    popular: false,
  },
];

export default function RazorpayCheckout({ isOpen, onClose, onSuccess, userId, email }: RazorpayCheckoutProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setError('Failed to load payment gateway');
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleCheckout = async () => {
    if (!scriptLoaded) {
      setError('Payment gateway is loading. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create order on server
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, userId, email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create order');

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'ResuméRoast',
        description: selectedPlan === 'pro_yearly' ? 'Pro Yearly Plan' : 'Pro Monthly Plan',
        order_id: data.orderId,
        prefill: {
          email: email || '',
        },
        theme: {
          color: '#FF3B30',
          backdrop_color: 'rgba(0, 0, 0, 0.85)',
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
        handler: async (response: any) => {
          // Step 3: Verify payment on server
          try {
            const verifyResponse = await fetch('/api/webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                email,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              onSuccess();
              onClose();
              // Redirect to success page
              window.location.href = '/upgrade/success';
            } else {
              setError('Payment verification failed. Contact support.');
            }
          } catch {
            setError('Payment verification failed. Contact support.');
          }
          setIsLoading(false);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
      });
      razorpay.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const features = [
    { icon: '🔥', text: 'Unlimited savage roasts' },
    { icon: '🎯', text: 'AI Interview Prep from your resume' },
    { icon: '✉️', text: 'AI Cover Letter Generator' },
    { icon: '✏️', text: 'Unlimited Bullet Rewriter' },
    { icon: '📊', text: 'Job Match ATS Analyzer' },
    { icon: '📸', text: 'HD PNG & PDF Exports' },
    { icon: '⚡', text: 'Priority AI processing' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FF3B30]/20 to-transparent pointer-events-none" />

            <div className="relative p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B30]/10 rounded-full mb-4">
                  <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] text-[#FF3B30] uppercase tracking-widest font-bold">
                    Upgrade to Pro
                  </span>
                </div>
                <h2 className="font-playfair text-3xl font-bold text-white mb-2">
                  Unlock Everything
                </h2>
                <p className="font-mono text-sm text-white/40">
                  Cancel anytime. Instant access.
                </p>
              </div>

              {/* Plan selector */}
              <div className="flex gap-3 mb-8">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`flex-1 relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'border-[#FF3B30] bg-[#FF3B30]/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    {plan.savings && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#34C759] text-black text-[9px] font-bold rounded-full uppercase tracking-wider">
                        {plan.savings}
                      </span>
                    )}
                    <div className="text-center">
                      <span className="font-playfair text-2xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/40 font-mono text-xs">{plan.period}</span>
                    </div>
                    <p className="font-mono text-[10px] text-white/40 mt-1">{plan.name}</p>
                  </button>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm">{feature.icon}</span>
                    <span className="font-mono text-sm text-white/70">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl">
                  <p className="font-mono text-xs text-[#FF3B30]">{error}</p>
                </div>
              )}

              {/* CTA */}
              <motion.button
                onClick={handleCheckout}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#FF3B30] text-white font-mono text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-[#FF3B30]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,59,48,0.3)]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay & Go Pro'
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 mt-6 font-mono text-[10px] text-white/30">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secured by Razorpay
                </span>
                <span>UPI / Cards / Wallets</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
