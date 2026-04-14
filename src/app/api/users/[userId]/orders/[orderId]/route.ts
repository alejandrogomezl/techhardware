import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/handlers';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string; orderId: string } }
) {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.orderId)
  ) {
    return NextResponse.json(
      { error: 'Invalid user ID or invalid order ID.' },
      { status: 400 }
    );
  }

  try {
    const order = await getOrder(params.userId, params.orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'User not found or order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
