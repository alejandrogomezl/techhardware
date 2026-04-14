import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/handlers';
import { Types } from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
  }

  try {
    const user = await getUser(params.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
