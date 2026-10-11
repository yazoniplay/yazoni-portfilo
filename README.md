# Yazoni Labs

A GitHub Pages app catalogue with a Supabase-backed private admin studio.

## Setup
1. Use a **dedicated Supabase project** for Yazoni Labs.
2. In Supabase **SQL Editor**, run all of `supabase-setup.sql`.
3. In **Project Settings → API Keys**, copy the Project URL and **publishable key** (or legacy anon key) into `supabase-config.js`. Never put a service-role/secret key in browser code.
4. In **Authentication → Users**, create your admin account using email and password.
5. Copy the account's UUID, then run `insert into public.app_admins (user_id) values ('YOUR-USER-UUID');` in SQL Editor with the real UUID.
6. Enable GitHub Pages from branch `main`, folder `/(root)`. Open `/admin.html` and sign in.

## Features
- Add, edit, publish/unpublish and delete apps.
- Upload app icons and build files; add version, platform, release notes, accent color and price in SEK.
- Public app listings show only after publishing.
- Free builds use private Storage with a policy allowing downloads only for published free apps. Download links expire after one hour.
- Paid listings can show a price and checkout URL, but **a checkout link alone does not verify payment or protect paid downloads**. A secure payment provider + server-side verification/webhook must be integrated before selling paid builds. Paid listings without a checkout URL are automatically saved as drafts.

## Security
The publishable Supabase key is public by design. Security relies on Supabase Auth, Row Level Security and Storage policies. Never expose a service-role/secret key in this repository. Payment-provider account eligibility may require a parent/guardian.
