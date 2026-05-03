import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders, createOrder, getUser, ErrorResponse, GetUserOrdersResponse, CreateOrderResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<GetUserOrdersResponse> | NextResponse<ErrorResponse>> {
  // 1. Authentication
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  // 2. Validate param
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid user ID.' },
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
    const orders = await getUserOrders(params.userId);

    if (!orders) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<CreateOrderResponse> | NextResponse<ErrorResponse>> {
  // 1. Authentication
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  // 2. Validate param
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid user ID.' },
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

    if (!body.address || !body.cardHolder || !body.cardNumber) {
      return NextResponse.json(
        { error: 'WRONG_PARAMS', message: 'Invalid or incomplete request.' },
        { status: 400 }
      );
    }

    const user = await getUser(params.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found.' },
        { status: 404 }
      );
    }

    const res = await createOrder(
      params.userId,
      body.address,
      body.cardHolder,
      body.cardNumber
    );

    if (!res) {
      return NextResponse.json(
        { error: 'BAD_REQUEST', message: 'Cart is empty or invalid request.' },
        { status: 400 }
      );
    }

    return NextResponse.json(res, {
      status: 201,
      headers: {
        Location: `/api/users/${params.userId}/orders/${res._id}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Invalid request body or server error.' },
      { status: 400 }
    );
  }
}
