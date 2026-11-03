'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatINR, CATEGORY_COLORS } from '@/lib/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg border border-slate-800">
        <p className="font-semibold">{label}</p>
        <p className="text-emerald-400 font-mono mt-0.5">
          {formatINR(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg border border-slate-800">
        <p className="font-semibold">{data.name}</p>
        <p className="text-emerald-400 font-mono mt-0.5">{formatINR(data.value)}</p>
        <p className="text-slate-400 text-[11px] mt-0.5">{data.payload.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

export function MonthlyTrendChart({ data }) {
  const hasData = data && data.length > 0 && data.some((item) => item.spending > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-medium">No spending records in the past 6 months</p>
        <p className="text-xs text-slate-400 mt-1">Expenses will dynamically visualize here as you log them</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="spending"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#spendingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ data }) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-medium">No categorized spending data</p>
        <p className="text-xs text-slate-400 mt-1">Add expenses to view category breakdown</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.amount,
    percentage: item.percentage,
    color: CATEGORY_COLORS[item.name] || '#64748b',
  }));

  return (
    <div className="h-72 w-full flex flex-col sm:flex-row items-center justify-center">
      <div className="w-full sm:w-1/2 h-52 sm:h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full sm:w-1/2 flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
        {chartData.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-medium text-slate-700 truncate">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-900 font-semibold">{formatINR(cat.value)}</span>
              <span className="text-slate-400 text-[11px]">({cat.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
