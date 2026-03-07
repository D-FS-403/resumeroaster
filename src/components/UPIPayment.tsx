'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UPIPaymentProps {
  onPaymentComplete: () => void;
  onClose: () => void;
}

const UPI_ID = 'akhil.akhil.aki@ybl';
const PHONE = '9513873791';
const AMOUNT = 9;

export default function UPIPayment({ onPaymentComplete, onClose }: UPIPaymentProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Resumeroast&am=${AMOUNT}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = `Hi! I've made a payment of ₹${AMOUNT} to upgrade to ResuméRoast Pro. Please verify and activate my account. UPI Ref: [Your ref number]`;
    const url = `https://wa.me/91${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#0D0D0D]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-[#0D0D0D] border border-[#FF3B30] rounded-2xl p-8 max-w-md w-full text-center"
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F5F0E8]/40 hover:text-[#F5F0E8]"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FF3B30]/20 flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-[#FF3B30]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <h2 className="font-playfair text-3xl font-bold text-[#F5F0E8] mb-2">
          Upgrade to Pro
        </h2>
        <p className="text-[#F5F0E8]/60 font-mono mb-6">
          One-time payment of ₹{AMOUNT}
        </p>

        {!showQR ? (
          <div className="space-y-4">
            <motion.button
              onClick={() => setShowQR(true)}
              className="w-full py-4 bg-[#FF3B30] text-[#F5F0E8] font-mono font-bold rounded-lg text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Show QR Code
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F5F0E8]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0D0D0D] text-[#F5F0E8]/40">or</span>
              </div>
            </div>

            <motion.button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-[#25D366] text-[#F5F0E8] font-mono font-bold rounded-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact on WhatsApp
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl inline-block">
              <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
            </div>

            <div className="p-4 bg-[#F5F0E8]/10 rounded-lg">
              <p className="text-[#F5F0E8]/60 text-sm font-mono mb-1">Scan with any UPI app</p>
              <p className="text-[#FF9500] font-mono font-bold">Amount: ₹{AMOUNT}</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <code className="px-3 py-2 bg-[#F5F0E8]/10 rounded font-mono text-sm text-[#F5F0E8]">
                {UPI_ID}
              </code>
              <motion.button
                onClick={handleCopyUPI}
                className="p-2 bg-[#F5F0E8]/10 rounded hover:bg-[#F5F0E8]/20 transition-colors"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#F5F0E8]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </motion.button>
            </div>

            <motion.button
              onClick={() => setShowQR(false)}
              className="text-[#F5F0E8]/60 font-mono text-sm hover:text-[#F5F0E8]"
            >
              ← Back to options
            </motion.button>

            <div className="pt-4 border-t border-[#F5F0E8]/20">
              <p className="text-[#F5F0E8]/40 text-xs font-mono">
                After payment, we'll verify and activate Pro within 24 hours
              </p>
            </div>
          </div>
        )}

        <p className="mt-6 text-[#F5F0E8]/40 font-mono text-sm">
          Cancel anytime. No questions asked.
        </p>
      </motion.div>
    </motion.div>
  );
}

