# Pitch Hub MUJ — Official Pitchers Club Website

Turning ideas into impact. This is the official web portal of the **Pitchers Club (the Entrepreneurship & Event Management Club)** at **Manipal University Jaipur (MUJ)**. From wild events to real startups, Pitch Hub provides a stunning, interactive platform for freshers, founders, sponsors, and organizers.

## 🚀 Key Features

- **Stunning UI/UX**: High-fidelity dark mode with glassmorphic cards, custom warp shaders, and smooth micro-animations.
- **Event Explorer**: Showcases upcoming club events, bootcamps, and business seminars, with detailed dynamic event pages.
- **Team Directory**: Beautifully showcases the Core Team, Executives, and Advisors.
- **Interactive Forms**: User-friendly portals for joining the club, sponsorship requests, and contact queries.
- **Admin Command Center**: A secure admin portal for managing events, team members, announcements, sponsorships, and join requests.
- **Payment Sandbox**: Sandbox integration with Razorpay Checkout for event registrations.

---

## 🛠️ Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (Server-side rendering built on TanStack Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database / Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Payment Gateway**: [Razorpay Standard Checkout](https://razorpay.com/)
- **Animations**: Framer Motion / Motion

---

## ⚙️ Local Development Setup

### 1. Prerequisites

You will need either [Node.js](https://nodejs.org/) (v20+) or [Bun](https://bun.sh/) installed.

### 2. Configure Environment Variables

Copy the template `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
# Public Environment Variables (VITE_ prefix exposes them to client-side code)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id

# Private Environment Variables (Server-side only, never committed or exposed to the browser)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
DATABASE_URL=your-database-connection-string
```

### 3. Installation

Install the project dependencies:

```bash
# Using Bun (Recommended)
bun install

# Or using NPM
npm install
```

### 4. Running the Dev Server

Start the local development server:

```bash
# Using Bun
bun dev

# Or using NPM
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🗄️ Database Utility Scripts

All utility scripts are organized under the `scripts/` directory. They read credentials securely from your environment variables, meaning **no credentials are committed to GitHub**.

To run these scripts, you must load the `.env` file first.

```bash
# Using Bun (loads env variables automatically)
bun run scripts/check_users.js

# Using Node.js (requires v20+ for native --env-file)
node --env-file=.env scripts/check_users.js
```

### Available Scripts:

- `scripts/check_users.js`: View registered authentication users.
- `scripts/check_auth_triggers.js`: Inspect triggers on the `auth.users` schema.
- `scripts/check_team_schema.js`: Display column definitions of the `team` table.
- `scripts/check_constraints.js`: Query PostgreSQL constraints on the `team` table.
- `scripts/test_team.js`: Test basic query and insert operations on the `team` table using the anonymous API key.
- `scripts/test_team_authenticated.js`: Verify PostgreSQL RLS rules for the `authenticated` role.
- `scripts/migrate_existing_drive_urls.js`: Migrate and transform old Google Drive image URLs to direct hotlink URLs.
- `scripts/test_image_status.js`: Verify connection status of representative image URLs.

---

## ☁️ Vercel Deployment Workflow

To deploy the website to production on **Vercel** with automatic updates from **GitHub**, follow these steps:

### Step 1: Upload to GitHub

1. Create a new repository on GitHub.
2. Initialize Git locally and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Organized codebase"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```
   _(Note: The `.env` file is ignored automatically by `.gitignore` and won't be pushed.)_

### Step 2: Import Project on Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
2. Connect your GitHub account and import your repository.

### Step 3: Add Environment Variables on Vercel

1. Under **Environment Variables**, add each of the keys listed in your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_SECRET`
   - `DATABASE_URL`
2. Click **Deploy**.

### Step 4: Automatic Continuous Deployment (CI/CD)

Once the initial deployment succeeds:

- Every time you commit and push changes to the `main` branch of your GitHub repository, **Vercel will automatically fetch the updates, run the production build, and redeploy the site** within seconds.
- Every commit on other branches will automatically receive a **Preview Deployment** link to test your features before merging them!
