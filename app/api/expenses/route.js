import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { expenseSchema } from '@/lib/validations';

export async function GET(request) {
  const authSession = await getAuthUser(request);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const dateRange = searchParams.get('dateRange')?.trim() || 'all';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Base filter: strictly current user
    const where = {
      userId: authSession.id,
    };

    // Category filter
    if (category && category !== 'All') {
      where.category = category;
    }

    // Title search
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Date range filter
    const now = new Date();
    if (dateRange === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      where.date = { gte: startOfMonth, lte: endOfMonth };
    } else if (dateRange === 'last_month') {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      where.date = { gte: startOfLastMonth, lte: endOfLastMonth };
    } else if (dateRange === '7_days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      where.date = { gte: sevenDaysAgo };
    } else if (dateRange === '30_days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      where.date = { gte: thirtyDaysAgo };
    } else if (dateRange === 'custom' && (startDateParam || endDateParam)) {
      const dateFilter = {};
      if (startDateParam) dateFilter.gte = new Date(startDateParam);
      if (endDateParam) {
        const end = new Date(endDateParam);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }
      where.date = dateFilter;
    }

    // Sorting
    const orderBy = {};
    if (['date', 'amount', 'title'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.date = 'desc';
    }

    const [total, expenses, aggregate] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
        _avg: { amount: true },
      }),
    ]);

    const formattedExpenses = expenses.map((e) => ({
      ...e,
      amount: parseFloat(e.amount.toString()),
      date: e.date.toISOString(),
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      expenses: formattedExpenses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      summary: {
        filteredTotal: aggregate._sum.amount ? parseFloat(aggregate._sum.amount.toString()) : 0,
        filteredAverage: aggregate._avg.amount ? parseFloat(aggregate._avg.amount.toString()) : 0,
        count: total,
      },
    });
  } catch (err) {
    console.error('Fetch expenses error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve expenses. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const authSession = await getAuthUser(request);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parseResult = expenseSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, amount, category, date, paymentMethod, description } = parseResult.data;

    const expense = await prisma.expense.create({
      data: {
        userId: authSession.id,
        title,
        amount,
        category,
        date: new Date(date),
        paymentMethod,
        description: description || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Expense added successfully',
        expense: {
          ...expense,
          amount: parseFloat(expense.amount.toString()),
          date: expense.date.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create expense error:', err);
    return NextResponse.json(
      { error: 'Unable to record expense. Please try again.' },
      { status: 500 }
    );
  }
}
