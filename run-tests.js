// Automated QA Test Suite for FinLedger Expense Manager Capstone
const { registerSchema, loginSchema, expenseSchema, EXPENSE_CATEGORIES } = require('./lib/validations');
const { formatINR, formatDate, CATEGORY_COLORS } = require('./lib/formatters');
const bcrypt = require('bcryptjs');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✔ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✘ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=== FinLedger Capstone Test Suite ===\n');

  // Suite 1: Formatter Tests
  console.log('[Suite 1: Formatter & Utility Functions]');
  assert(formatINR(1500).includes('1,500'), 'formatINR correctly formats thousand values');
  assert(formatINR(125000).includes('1,25,000'), 'formatINR formats Indian numbering system (Lakhs)');
  assert(formatINR(0).includes('0.00'), 'formatINR handles zero amount gracefully');
  assert(formatDate('2026-11-03').includes('2026'), 'formatDate formats valid date');
  assert(formatDate(null) === '—', 'formatDate returns em-dash for null input');
  assert(CATEGORY_COLORS['Food'] === '#10b981', 'CATEGORY_COLORS has emerald for Food');

  // Suite 2: Validation Schemas
  console.log('\n[Suite 2: Zod Validation Schemas]');
  const validRegister = registerSchema.safeParse({
    name: 'Arpit Pandey',
    email: 'arpit@example.com',
    password: 'securepassword123',
  });
  assert(validRegister.success === true, 'registerSchema accepts valid registration payload');

  const invalidEmailRegister = registerSchema.safeParse({
    name: 'Arpit',
    email: 'notanemail',
    password: 'password123',
  });
  assert(invalidEmailRegister.success === false, 'registerSchema rejects malformed email');

  const shortPassword = registerSchema.safeParse({
    name: 'Arpit',
    email: 'test@example.com',
    password: '123',
  });
  assert(shortPassword.success === false, 'registerSchema rejects short passwords (< 6 chars)');

  const validExpense = expenseSchema.safeParse({
    title: 'AWS Neon Hosting Bill',
    amount: 1450.75,
    category: 'Bills',
    date: '2026-11-03',
    paymentMethod: 'Credit Card',
    description: 'Cloud database compute invoice',
  });
  assert(validExpense.success === true, 'expenseSchema validates valid expense payload');

  const negativeAmount = expenseSchema.safeParse({
    title: 'Refund attempt',
    amount: -50,
    category: 'Bills',
    date: '2026-11-03',
  });
  assert(negativeAmount.success === false, 'expenseSchema rejects negative amounts');

  const invalidCategory = expenseSchema.safeParse({
    title: 'Random Item',
    amount: 100,
    category: 'NotACategory',
    date: '2026-11-03',
  });
  assert(invalidCategory.success === false, 'expenseSchema rejects invalid category enum');

  // Suite 3: Password Hashing
  console.log('\n[Suite 3: Cryptographic Operations]');
  const plain = 'superSecurePass2026!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(plain, salt);
  assert(hash !== plain, 'bcrypt produces non-plaintext hash');
  const match = await bcrypt.compare(plain, hash);
  assert(match === true, 'bcrypt matches correct password against hash');
  const mismatch = await bcrypt.compare('wrongPassword', hash);
  assert(mismatch === false, 'bcrypt rejects incorrect password');

  console.log('\n=======================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('=======================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
