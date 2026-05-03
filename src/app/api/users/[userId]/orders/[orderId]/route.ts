import { NextRequest, NextResponse } from 'next/server';
import { getOrder, ErrorResponse, GetOrderResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string; orderId: string } }
): Promise<NextResponse<GetOrderResponse> | NextResponse<ErrorResponse>> {
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
    !Types.ObjectId.isValid(params.orderId)
  ) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid user ID or invalid order ID.' },
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
    const order = await getOrder(params.userId, params.orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found or order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
