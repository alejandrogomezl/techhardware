import { NextRequest, NextResponse } from 'next/server';
import { getUserCart } from '@/lib/handlers';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    const cart = await getUserCart(params.userId);

    if (!cart) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
