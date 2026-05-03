import { NextRequest, NextResponse } from 'next/server';
import { putUserCart, deleteUserCart, ErrorResponse, PutUserCartResponse, DeleteUserCartResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<PutUserCartResponse> | NextResponse<ErrorResponse>> {
  // 1. Authentication
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  // 2. Validate params
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid user ID or invalid product ID.' },
      { status: 400 }
    );
  }

  // 3. Authorization
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    if (body.qty === undefined || body.qty <= 0) {
      return NextResponse.json(
        { error: 'WRONG_PARAMS', message: 'Number of items not greater than 0.' },
        { status: 400 }
      );
    }

    const res = await putUserCart(params.userId, params.productId, body.qty);

    if (!res) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found or product not found.' },
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
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Invalid request body or server error.' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<DeleteUserCartResponse> | NextResponse<ErrorResponse>> {
  // 1. Authentication
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  // 2. Validate params
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid user ID or invalid product ID.' },
      { status: 400 }
    );
  }

  // 3. Authorization
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    );
  }

  try {
    const res = await deleteUserCart(params.userId, params.productId);

    if (!res) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found or product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cartItems: res.cartItems }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
