'use client';

import { motion, AnimatePresence } from 'framer-motion';
import UPIPayment from './UPIPayment';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  const handlePaymentComplete = () => {
    onUpgrade();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <UPIPayment
          onPaymentComplete={handlePaymentComplete}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

