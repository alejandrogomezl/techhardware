import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// ─── Payload ──────────────────────────────────────────────────────────────────

interface Payload extends JWTPayload {
  userId: string
}

// ─── Encode / Decode ──────────────────────────────────────────────────────────

async function encode(payload: Payload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

async function decode(session: string | undefined = ''): Promise<Payload | null> {
  try {
    const { payload } = await jwtVerify<Payload>(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function createSession(payload: Payload): Promise<void> {
  const session = await encode(payload)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<Payload | null> {
  const session = cookies().get('session')?.value
  const payload = await decode(session)

  if (!session || !payload) {
    return null
  }

  return payload
}

export function deleteSession(): void {
  cookies().delete('session')
}
