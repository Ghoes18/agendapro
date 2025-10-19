# MVP.md: AgendaPro - The Anti-Fresha Platform

## 1. MVP Vision: "Your Business, Your Clients."

**Pitch:** "AgendaPro is the scheduling platform that puts your business first. We provide a 'white-label' booking widget that integrates perfectly into *your* website, letting you capture clients without paying marketplace commissions. Our price is a simple, transparent monthly subscription. Your clients are yours. Period."

**Initial Target Audience:** Small service-based businesses (hairdressers, barbers, estheticians, therapists) who already have a website (WordPress, Squarespace, Wix) or a strong Instagram/Facebook presence and are frustrated with Fresha's fees.

## 2. Tech Stack: Next.js + Supabase

The choice of **Next.js** and **Supabase** is strategic for development speed, performance, and scalability.

* **Frontend (Business Dashboard & Booking Widget): Next.js (App Router)**
    * **Why?** It allows us to build a management dashboard (login protected) and a public-facing booking widget using the same technology.
    * **Dashboard (App Router):** We'll use Server Components to load business data (appointments, clients) securely and quickly. The UI will be reactive (e.g., drag-and-drop on the calendar) using Client Components.
    * **Booking Widget (Pages Router or App Router):** The booking page (`agendapro.com/[businessname]`) will be server-rendered (SSR) or static (SSG/ISR) for maximum speed and SEO. The goal is for it to be *blazingly fast*.
    * **Hosting:** Vercel (native integration with Next.js).

* **Backend & Database: Supabase**
    * **Why?** It's the perfect backend-as-a-service that gives us everything we need in one place, saving months of development.
    * **Database (PostgreSQL):** The heart of Supabase. We'll use it to store `businesses`, `services`, `staff`, `clients`, and `appointments`.
    * **Authentication (Supabase Auth):** To manage business owner logins for their dashboard.
    * **APIs (PostgREST):** Supabase auto-generates a RESTful API from our database. Next.js will communicate with this API.
    * **Realtime (Supabase Realtime):** Essential. When a client books, the business's calendar updates *in real-time* for all logged-in staff, no refresh needed.
    * **Storage (Supabase Storage):** To store staff avatars, service photos, and the business logo.
    * **Edge Functions (Deno):** For backend logic, like sending confirmation emails (via Postmark/SendGrid) after a booking.

## 3. Core MVP Features (The "Minimum Viable")

Total focus on solving the core problem: booking and management.

**A. The Owner's Dashboard (The "Admin")**

1.  **Simple Onboarding:** Create an account (Supabase Auth), set up business name, address, and opening hours.
2.  **Service Management:** CRUD (Create, Read, Update, Delete) for services. Fields: `name`, `duration` (in minutes), `price`.
3.  **Staff Management:** CRUD for team members. Fields: `name`, `email`, `work_hours` (e.g., 9-6, off on Mondays), `services_performed` (many-to-many relationship with services).
4.  **The Calendar:** The *core* feature.
    * View by day, week, and by staff member.
    * Ability to see all appointments.
    * Ability to add "blocks" manually (e.g., "lunch break" or "vacation").
    * Manually add a booking (e.g., for a client who calls on the phone).
5.  **Client Management (Mini-CRM):**
    * A list of all clients who have booked.
    * View a single client's booking history.
    * *Key Feature:* **"Export Client List (CSV)" Button**. (Our "your data is yours" promise).

**B. The End-Client Flow (The "Booking")**

1.  **Public Booking Page:** A simple, clean page at `agendapro.com/[businessname]`.
2.  **4-Step Flow:**
    * **Step 1:** Choose Service(s).
    * **Step 2:** (Optional) Choose Professional (if multiple staff perform the service).
    * **Step 3:** Choose Date & Time (showing only available slots based on staff/service rules).
    * **Step 4:** Enter details: `name`, `email`, `phone`.
3.  **Confirmation:** "Booking Confirmed" page and an automatic email (via Supabase Edge Function + SendGrid).

**What we will NOT include in the MVP (to maintain focus):**

* **Payment Processing:** Fresha uses this to justify fees. Our MVP will be 100% "Pay at the Venue." This removes enormous complexity (Stripe, PCI compliance, disputes).
* **Voucher or Product Sales:** Focus *only* on service booking.
* **Native Mobile App:** The dashboard and widget will be *mobile-responsive*.
* **Email/SMS Marketing:** A "Premium" feature for the future.

## 4. Proprietary Features & Differentiation (The "Secret Sauce")

This is where we beat Fresha.

1.  **The White-Label Widget (Our Main Weapon):**
    * **The Problem:** Fresha forces the client to leave the salon's site and go to the Fresha marketplace.
    * **Our Solution:** AgendaPro generates **one line of code** (`<script>...`) that the business owner pastes into their site (Wix, WordPress, etc.).
    * **The Result:** Our booking flow (Steps 1-4) appears *directly* on the client's site, branded with their logo and colors. The customer *never* leaves the business's domain.
    * **The Benefit:** **Marketplace fee = 0%.** The client was captured by the salon's marketing, on the salon's site. We are just the technology.

2.  **Open CRM with Export (Our Promise):**
    * **The Problem:** Fresha "owns" the client relationship.
    * **Our Solution:** The AgendaPro dashboard has a prominent button to **"Export all my clients"** to a CSV file.
    * **The Benefit:** Combats vendor lock-in. The business feels safe knowing they can leave at any time and take their data with them.

3.  **No Marketplace (Our Philosophy):**
    * **The Problem:** Fresha's marketplace lists your business right next to your direct competitors and charges you 20% for it.
    * **Our Solution:** We *do not have* a public marketplace. AgendaPro is a B2B tool, not a B2C platform. We don't compete with our customers; we empower them to compete.

## 5. Business Model (Total Transparency)

* **"Free" Plan (The Hook):**
    * Very limited. 1 Staff Member, 20 Bookings/month.
    * *Goal:* Allow the owner to test the software frictionlessly.

* **"Pro" Plan (Our Core Product):**
    * **Price:** A flat monthly subscription (e.g., **$29/month**).
    * **Includes:** Unlimited Staff, Unlimited Services, Unlimited Bookings, White-Label Widget, Priority Email Support.
    * **Marketing:** "Pay $29/month and keep 100% of your revenue. One 'new' client that Fresha would charge you 20% for (e.g., $20 on a $100 bill) already pays for almost our entire month."

* **"Premium" Plan (Post-MVP):**
    * Price: $49/month.
    * Includes everything in "Pro" + SMS Reminders + Payments Integration (Stripe, with standard processing fees) + API.