import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.AUTH_SECRET || 'expense-manager-capstone-default-super-secret-key-32bytes';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Hash a plain password using bcryptjs
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password against hash
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Create a signed JWT token with user payload
 * Expiration: 7 days
 */
export async function createToken(payload) {
  return new SignJWT({
    id: payload.id,
    name: payload.name,
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

/**
 * Verify JWT token using jose (Edge Runtime compatible)
 */
export async function verifyToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract authenticated user from request cookie (for API route handlers)
 */
export async function getAuthUser(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [k, ...v] = c.split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );

    const token = cookies[TOKEN_COOKIE_NAME];
    if (!token) return null;

    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Cookie options for secure session handling
 */
export const cookieOptions = {
  name: TOKEN_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
