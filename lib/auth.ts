import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.ADMIN_PASSWORD)

export async function signToken() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
