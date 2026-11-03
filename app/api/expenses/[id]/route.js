import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { expenseSchema } from '@/lib/validations';

export async function GET(request, { params }) {
  const authSession = await getAuthUser(request);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: authSession.id, // Strictly verify ownership
      },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({
      expense: {
        ...expense,
        amount: parseFloat(expense.amount.toString()),
        date: expense.date.toISOString(),
      },
    });
  } catch (err) {
    console.error('Fetch expense error:', err);
    return NextResponse.json({ error: 'Failed to retrieve expense' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const authSession = await getAuthUser(request);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check ownership first
    const existing = await prisma.expense.findFirst({
      where: {
        id,
        userId: authSession.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Expense not found or access denied' }, { status: 404 });
    }

    const body = await request.json();
    const parseResult = expenseSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, amount, category, date, paymentMethod, description } = parseResult.data;

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        title,
        amount,
        category,
        date: new Date(date),
        paymentMethod,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Expense updated successfully',
      expense: {
        ...updated,
        amount: parseFloat(updated.amount.toString()),
        date: updated.date.toISOString(),
      },
    });
  } catch (err) {
    console.error('Update expense error:', err);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authSession = await getAuthUser(request);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Verify ownership
    const existing = await prisma.expense.findFirst({
      where: {
        id,
        userId: authSession.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Expense not found or access denied' }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (err) {
    console.error('Delete expense error:', err);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
