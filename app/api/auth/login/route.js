import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, createToken, cookieOptions } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid login details', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await createToken(safeUser);

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: safeUser,
    });

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Unable to authenticate. Please try again later.' },
      { status: 500 }
    );
  }
}
