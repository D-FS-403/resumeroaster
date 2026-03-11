import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, PLANS } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, email } = await request.json();

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const order = await getRazorpay().orders.create({
      amount: selectedPlan.amount,
      currency: 'INR',
      receipt: `pro_${userId || 'anon'}_${Date.now()}`,
      notes: {
        userId: userId || '',
        email: email || '',
        plan,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
