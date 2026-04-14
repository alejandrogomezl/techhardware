import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders, createOrder, getUser } from '@/lib/handlers';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    const orders = await getUserOrders(params.userId);

    if (!orders) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    const body = await request.json();

    if (!body.address || !body.cardHolder || !body.cardNumber) {
      return NextResponse.json(
        { error: 'Invalid or incomplete request.' },
        { status: 400 }
      );
    }

    const user = await getUser(params.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const res = await createOrder(
      params.userId,
      body.address,
      body.cardHolder,
      body.cardNumber
    );

    if (!res) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid request.' },
        { status: 400 }
      );
    }

    return NextResponse.json(res, {
      status: 201,
      headers: {
        Location: `/api/users/${params.userId}/orders/${res._id}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body or server error.' },
      { status: 400 }
    );
  }
}
