import { NextRequest, NextResponse } from 'next/server';
import { putUserCart, deleteUserCart } from '@/lib/handlers';
import { Types } from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json(
      { error: 'Invalid user ID or invalid product ID.' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    if (body.qty === undefined || body.qty <= 0) {
      return NextResponse.json(
        { error: 'Number of items not greater than 0.' },
        { status: 400 }
      );
    }

    const res = await putUserCart(params.userId, params.productId, body.qty);

    if (!res) {
      return NextResponse.json(
        { error: 'User not found or product not found.' },
        { status: 404 }
      );
    }

    if (res.isNew) {
      return NextResponse.json(
        { cartItems: res.cartItems },
        {
          status: 201,
          headers: {
            Location: `/api/users/${params.userId}/cart/${params.productId}`,
          },
        }
      );
    }

    return NextResponse.json({ cartItems: res.cartItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body or server error.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json(
      { error: 'Invalid user ID or invalid product ID.' },
      { status: 400 }
    );
  }

  try {
    const res = await deleteUserCart(params.userId, params.productId);

    if (!res) {
      return NextResponse.json(
        { error: 'User not found or product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cartItems: res.cartItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
