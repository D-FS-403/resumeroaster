import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Verify Razorpay payment signature
function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      email,
    } = await request.json();

    // Verify the payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Payment verified - upgrade user
    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({
          is_pro: true,
          razorpay_payment_id,
          razorpay_order_id,
          pro_since: new Date().toISOString(),
        })
        .eq('id', userId);
    } else if (email) {
      // Find user by email and upgrade
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const matchedUser = users?.users?.find(u => u.email === email);
      if (matchedUser) {
        await supabaseAdmin
          .from('profiles')
          .update({
            is_pro: true,
            razorpay_payment_id,
            razorpay_order_id,
            pro_since: new Date().toISOString(),
          })
          .eq('id', matchedUser.id);
      }
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
