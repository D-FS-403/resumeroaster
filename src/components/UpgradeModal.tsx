'use client';

import RazorpayCheckout from './RazorpayCheckout';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  userId?: string;
  email?: string;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade, userId, email }: UpgradeModalProps) {
  return (
    <RazorpayCheckout
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onUpgrade}
      userId={userId}
      email={email}
    />
  );
}
