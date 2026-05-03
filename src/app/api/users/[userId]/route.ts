import { NextRequest, NextResponse } from 'next/server';
import { getUser, ErrorResponse, GetUserResponse } from '@/lib/handlers';
import { Types } from 'mongoose';
import { getSession } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<GetUserResponse> | NextResponse<ErrorResponse>> {

  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      { error: 'WRONG_PARAMS', message: 'Invalid user ID.' },
      { status: 400 }
    );
  }

  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      { error: 'NOT_AUTHORIZED', message: 'Unauthorized access.' },
      { status: 403 }
    );
  }

  try {
    const user = await getUser(params.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
