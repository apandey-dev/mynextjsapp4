import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createToken, cookieOptions } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request) {
  try {
    const body = await request.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = parseResult.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Create session token
    const token = await createToken(user);

    const response = NextResponse.json(
      { success: true, message: 'Account created successfully', user },
      { status: 201 }
    );

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'Unable to complete registration. Please try again later.' },
      { status: 500 }
    );
  }
}
