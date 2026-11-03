# FinLedger — Full-Stack Expense Manager (Capstone Project)

A modern, production-grade personal finance and expense management platform built with Next.js App Router, Prisma ORM, and Neon Serverless PostgreSQL.

---

## Live Links & Repository

- **Live Production Deployment**: [https://expense-manager-hub.vercel.app](https://expense-manager-hub.vercel.app)
- **Public GitHub Repository**: [https://github.com/apandey-dev/expense-manager-capstone](https://github.com/apandey-dev/expense-manager-capstone)

---

## Technologies Used

- **Framework**: Next.js 16 (App Router with Server Components & Route Handlers)
- **Language**: JavaScript (ES2024 / React 19)
- **Database**: PostgreSQL (Serverless via Neon with Connection Pooling)
- **ORM**: Prisma ORM v6
- **Authentication**: JWT signed via `jose` (Edge Runtime compatible) stored in HTTP-only cookies
- **Password Hashing**: `bcryptjs`
- **Client State & Cache**: SWR (Stale-While-Revalidate) with Context API
- **Charts & Visualizations**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod & React Hook Form

---

## Core Features

1. **Strict Multi-Tenant Isolation**: Every database operation verifies user identity on the server; users can only read, create, update, and delete their own expenses.
2. **Interactive Financial Analytics**:
   - Total all-time expenses, current month expenditures, and month-over-month comparison (% delta).
   - 6-month historical spending trend area chart.
   - Categorized distribution donut chart (Food, Travel, Shopping, Bills, Entertainment, Health, Education, Other).
3. **Comprehensive Expense CRUD**:
   - Add new transactions with title, amount (₹ INR), category, date, payment method (UPI, Cards, Cash), and notes.
   - Search by title with automatic debouncing.
   - Multi-category filtering and date range presets (This Month, Last Month, 7 Days, 30 Days).
   - Server-side sorting and multi-page pagination.
   - Safe confirmation modal before permanent record deletion.
4. **Edge Middleware Route Protection**: Edge-compatible `middleware.js` blocks unauthenticated access to `/dashboard`, `/expenses`, `/profile`, and `/settings` with automated redirect to `/login`.
5. **Incremental Static Regeneration (ISR)**: The public `/insights` benchmark page is statically generated and cached on the edge with a 60-second revalidation TTL.

---

## Project Structure

```text
expense-manager-capstone/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   ├── me/route.js
│   │   │   └── register/route.js
│   │   ├── dashboard/stats/route.js
│   │   ├── expenses/
│   │   │   ├── [id]/route.js
│   │   │   └── route.js
│   │   └── user/profile/route.js
│   ├── dashboard/page.js
│   ├── expenses/
│   │   ├── [id]/edit/page.js
│   │   ├── new/page.js
│   │   └── page.js
│   ├── insights/page.js
│   ├── login/page.js
│   ├── profile/page.js
│   ├── register/page.js
│   ├── settings/page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── DashboardLayout.js
│   ├── DeleteModal.js
│   ├── ExpenseCharts.js
│   ├── ExpenseForm.js
│   ├── Navbar.js
│   ├── PublicFooter.js
│   ├── PublicNavbar.js
│   └── Sidebar.js
├── context/
│   └── AuthContext.js
├── lib/
│   ├── auth.js
│   ├── formatters.js
│   ├── prisma.js
│   └── validations.js
├── prisma/
│   └── schema.prisma
├── .env.example
├── middleware.js
├── next.config.mjs
└── package.json
```

---

## Environment Variables Required

Create a `.env.local` file based on `.env.example`:

| Variable Name | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon pooled connection string (with PgBouncer) |
| `DIRECT_URL` | Neon direct connection string (for Prisma migrations) |
| `AUTH_SECRET` | 32-byte secret key used for signing HS256 JWT tokens |
| `NEXT_PUBLIC_APP_URL` | Base application URL (`http://localhost:3000` locally) |

---

## Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/apandey-dev/expense-manager-capstone.git
   cd expense-manager-capstone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your Neon PostgreSQL connection strings and secret
   ```

4. **Push database schema to Neon**:
   ```bash
   npx prisma db push
   ```

5. **Run the test suite**:
   ```bash
   npm test
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Application Previews

*(Screenshots placeholder: Accessible directly on the live deployment at [https://expense-manager-hub.vercel.app](https://expense-manager-hub.vercel.app))*

---

## Security & Architecture Highlights

- **Passwords**: Hashed with 10 salt rounds using `bcryptjs`.
- **Cookies**: HTTP-only, SameSite=Lax, and Secure in production.
- **Data Protection**: Prepared statements and Prisma query abstraction prevent SQL injection.
- **Edge Compatible**: Authentication verification is lightweight and executes natively at the CDN edge.
