import { z } from 'zod';

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

export const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash', 'Other'];

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const expenseSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(100, 'Title too long'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid expense category' }),
  }),
  date: z.string().min(1, 'Date is required'),
  paymentMethod: z.enum(PAYMENT_METHODS).default('UPI'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
});
