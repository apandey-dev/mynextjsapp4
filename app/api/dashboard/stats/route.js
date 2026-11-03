import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const authSession = await getAuthUser(request);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = authSession.id;
    const now = new Date();

    // 1. Current month date boundaries
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 2. Previous month date boundaries
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Run parallel database queries
    const [
      allTimeAggregate,
      currentMonthAggregate,
      prevMonthAggregate,
      recentExpenses,
      categoryExpenses,
      allExpensesForTrend,
    ] = await Promise.all([
      // Total expenses and count all-time
      prisma.expense.aggregate({
        where: { userId },
        _sum: { amount: true },
        _avg: { amount: true },
        _count: { id: true },
      }),
      // Current month sum
      prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: currentMonthStart, lte: currentMonthEnd },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // Previous month sum
      prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: prevMonthStart, lte: prevMonthEnd },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // Recent transactions (last 6)
      prisma.expense.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 6,
      }),
      // Category grouped data
      prisma.expense.groupBy({
        by: ['category'],
        where: { userId },
        _sum: { amount: true },
        _count: { id: true },
      }),
      // Expenses for monthly trend (last 6 months)
      prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
        select: {
          date: true,
          amount: true,
        },
      }),
    ]);

    // Format numbers
    const totalExpenses = allTimeAggregate._sum.amount
      ? parseFloat(allTimeAggregate._sum.amount.toString())
      : 0;
    const totalTransactions = allTimeAggregate._count.id || 0;
    const averageExpense = allTimeAggregate._avg.amount
      ? parseFloat(allTimeAggregate._avg.amount.toString())
      : 0;

    const currentMonthTotal = currentMonthAggregate._sum.amount
      ? parseFloat(currentMonthAggregate._sum.amount.toString())
      : 0;
    const currentMonthCount = currentMonthAggregate._count.id || 0;

    const prevMonthTotal = prevMonthAggregate._sum.amount
      ? parseFloat(prevMonthAggregate._sum.amount.toString())
      : 0;

    // Month-over-month comparison
    let monthOverMonthChange = 0;
    if (prevMonthTotal > 0) {
      monthOverMonthChange = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    } else if (currentMonthTotal > 0) {
      monthOverMonthChange = 100;
    }

    // Category breakdown with percentages
    const categoryData = categoryExpenses
      .map((item) => {
        const amount = item._sum.amount ? parseFloat(item._sum.amount.toString()) : 0;
        return {
          name: item.category,
          amount,
          count: item._count.id,
          percentage: totalExpenses > 0 ? parseFloat(((amount / totalExpenses) * 100).toFixed(1)) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Compute monthly trend for the last 6 calendar months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrendMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear() % 100}`;
      monthlyTrendMap[key] = 0;
    }

    allExpensesForTrend.forEach((item) => {
      const itemDate = new Date(item.date);
      const key = `${monthNames[itemDate.getMonth()]} ${itemDate.getFullYear() % 100}`;
      if (monthlyTrendMap[key] !== undefined) {
        monthlyTrendMap[key] += parseFloat(item.amount.toString());
      }
    });

    const monthlyTrend = Object.keys(monthlyTrendMap).map((month) => ({
      month,
      spending: parseFloat(monthlyTrendMap[month].toFixed(2)),
    }));

    return NextResponse.json({
      userName: authSession.name,
      stats: {
        totalExpenses,
        totalTransactions,
        averageExpense,
        currentMonthTotal,
        currentMonthCount,
        prevMonthTotal,
        monthOverMonthChange: parseFloat(monthOverMonthChange.toFixed(1)),
      },
      monthlyTrend,
      categoryData,
      recentExpenses: recentExpenses.map((e) => ({
        ...e,
        amount: parseFloat(e.amount.toString()),
        date: e.date.toISOString(),
      })),
    });
  } catch (err) {
    console.error('Dashboard stats calculation error:', err);
    return NextResponse.json(
      { error: 'Failed to compute dashboard metrics' },
      { status: 500 }
    );
  }
}
