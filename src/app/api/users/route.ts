import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/handlers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.email ||
      !body.password ||
      !body.name ||
      !body.surname ||
      !body.address ||
      !body.birthdate
    ) {
      return NextResponse.json(
        { error: 'Invalid or incomplete request.' },
        { status: 400 }
      );
    }

    const createdUser = await createUser({
      email: body.email,
      password: body.password,
      name: body.name,
      surname: body.surname,
      address: body.address,
      birthdate: body.birthdate,
    });

    if (!createdUser) {
      return NextResponse.json(
        { error: 'Email address already in use.' },
        { status: 400 }
      );
    }

    return NextResponse.json(createdUser, {
      status: 201,
      headers: {
        Location: `/api/users/${createdUser._id}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
