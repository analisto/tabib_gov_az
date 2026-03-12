# Platform Problems — Deep Analysis
> mwp.codes / codeplace | Date: 2026-03-12

---

## Executive Summary

You built a technically solid platform, but the business model has fundamental cracks that can't be patched with more features. This document categorizes every problem found — technical, product, business, legal, and strategic — and ends with an honest recommendation.

---

## 1. CRITICAL BUGS (Live Site Broken Right Now)

### 1.1 Templates Page Shows "0 Projects" on Load
**What's happening:** `/templates` is a pure client-side component (`'use client'`). It fetches data via `useEffect` after hydration. WebFetch and search engine crawlers see the initial render: "Showing 0 projects."

**Evidence:** The API at `/api/templates` returns 16 templates correctly. The UI starts empty and fills in only after the client-side fetch completes — meaning for the ~500ms before data arrives, visitors see a broken empty marketplace.

**Why it matters:** First impressions kill trust. A new visitor sees "0 projects" and leaves. Google indexes the empty state. This is a conversion killer.

**Fix:** Convert to a Server Component with `async/await` or use `getServerSideProps`-style data fetching in the App Router (`fetch` at the page level with no `'use client'`).

### 1.2 No Payment Gating — Everything is Free Regardless of Price
The `price` field and `isPaid` flag exist in the database, and templates show prices (e.g. $2,000 for "Kreditor"). But there is **zero payment processing code** anywhere in the codebase. A buyer can:
1. Click a template marked "$2,000"
2. Reveal the seller's email/phone for free
3. Contact them outside the platform
4. Pay (or not pay) however they want

The platform shows prices but collects no money. It is a contact directory, not a marketplace.

### 1.3 No Download Gating Either
ZIP files are stored on Cloudflare R2 with public URLs. Anyone who finds the URL can download without paying. There is no signed URL expiry enforced on the buyer flow.

### 1.4 Category Mismatch
The template upload form allows categories from the DB schema (e.g. "SaaS Platform", "Marketplace", "AI/ML"), but the filter on the `/templates` page only shows: Landing Page, Dashboard, E-commerce, Blog, Portfolio, Admin Panel, Authentication, Components, Other.

Templates uploaded with categories outside this list are never surfaced via filters.

---

## 2. PRODUCT PROBLEMS

### 2.1 Identity Crisis — What Is This Platform?
The README says: "buying and selling MVPs, SaaS templates, and fullstack applications."
The homepage says: "Full-Stack Projects."
The page title says: "MVP Marketplace."
The domain says: "mwp.codes" (mwp = MVP? unclear).

You are simultaneously positioning as:
- A **template marketplace** (ThemeForest competitor)
- A **full-stack app marketplace** (buying working software)
- A **code boilerplate store** (Vercel templates competitor)

These are fundamentally different products with different buyers, different price expectations, and different support models. A $0 landing page template and a $2,000 loan application platform are not the same category of product.

### 2.2 The "hasSupport" Feature Is Meaningless
There is a `hasSupport` badge on templates. But:
- There is no SLA definition
- No support ticket system
- No communication channel on the platform
- No refund or dispute mechanism if support is not provided
- It's just a checkbox the seller ticks themselves

This badge misleads buyers. A seller can claim support, take the money, and disappear.

### 2.3 Analytics Track Vanity Metrics
The analytics model tracks: views, email reveals, phone reveals, view time. These are contact directory metrics, not marketplace metrics. Useful data would be: purchases, conversion rate, revenue, repeat buyers. The current metrics tell you that people looked at a profile — nothing commercially useful.

### 2.4 No Buyer Account Value
Buyers register but gain almost nothing. There is no purchase history, no saved items, no notifications, no recommended items. Registration is pointless for buyers, so they don't register, so sellers get less signal, so the network never develops.

### 2.5 mwp.codes Domain Is Unmemorable
- "mwp" is not intuitive — people will not remember it
- ".codes" TLD is niche and not trusted like .com or .io
- You mentioned buying a domain name — this is actually necessary, not optional

---

## 3. BUSINESS MODEL PROBLEMS

### 3.1 No Revenue Model
The platform takes **zero commission** on any transaction. There is no subscription fee. There is no listing fee. Even if 100 transactions happened tomorrow, you would earn $0 from the platform. You built infrastructure that earns nothing.

### 3.2 Stripe Is Not Available in Azerbaijan
This is the single biggest structural problem. Stripe covers 46+ countries. Azerbaijan is not one of them. Neither is PayPal in a merchant capacity. Your realistic options are:
- **Paddle** — acts as Merchant of Record, works in AZ, takes 5% + $0.50
- **LemonSqueezy** — similar to Paddle, works for digital products
- **Gumroad** — works internationally, 10% fee
- **Wire transfer / bank transfer** — manual, doesn't scale
- **Crypto** — possible but niche and volatile
- **PayPal personal** — possible for small amounts but TOS violation for business

None of these integrate as cleanly as Stripe. Paddle and LemonSqueezy are the most viable.

### 3.3 Support Burden Is Unsustainable
If you list your own full-stack apps and sell them, every buyer becomes your customer who expects:
- Bug fixes
- Updates as dependencies break
- Feature requests
- Deployment help
- Documentation

You are one person. If you sell 10 copies of a complex app, you have 10 clients demanding support simultaneously. This model does not scale to even 20 customers.

### 3.4 Chicken-and-Egg Problem
Marketplaces need supply AND demand simultaneously. Right now:
- No buyers → sellers don't list → no content → no buyers
- You have 16 listings, mostly your own projects
- There is no incentive structure to attract other sellers
- There is no marketing plan for attracting buyers

This is the classic marketplace bootstrapping problem that kills most platforms.

### 3.5 AI Era Commoditization
You mentioned this yourself, and it is real. In 2026:
- ChatGPT, Claude, Cursor, v0.dev, Bolt.new can generate functional MVPs in hours
- The value of "pre-built code" is collapsing rapidly
- Buyers who need a loan platform ($2,000) will just prompt an AI or hire a freelancer on Upwork
- Template buyers who need a landing page will use Framer, Webflow, or v0.dev

The market for selling code is shrinking, not growing.

### 3.6 Competition You Cannot Win
| Platform | Monthly Visitors | Trust | Payment | Categories |
|----------|-----------------|-------|---------|------------|
| ThemeForest (Envato) | 10M+ | Established 2008 | Full escrow | All |
| Gumroad | 5M+ | Established 2011 | Full payments | Digital |
| CodeCanyon | 3M+ | Established | Escrow | Code |
| LemonSqueezy | Growing | VC-backed | Full | Digital |

You are competing against platforms with millions in funding, 15+ years of SEO, established seller communities, and working payment infrastructure. Differentiating by being "also a marketplace" is not sufficient.

---

## 4. TRUST AND LEGAL PROBLEMS

### 4.1 No Escrow = No Trust for High-Value Transactions
"Kreditor" is listed at $2,000. There is no escrow. A buyer sends $2,000 via bank transfer, the seller disappears, there is no recourse. Or the reverse: buyer gets code, refuses to pay, seller has no recourse. This is not a theoretical problem — it is why marketplace trust infrastructure exists.

### 4.2 No Dispute Resolution
There is no mechanism for: refunds, disputes, quality complaints, code not working as described, seller delivering something different than shown. The Terms of Service page exists but likely doesn't cover marketplace-specific scenarios.

### 4.3 Exposing Seller Contact Info is a Privacy Risk
The "click to reveal email/phone" mechanism means any logged-in user can harvest seller contact data. There is no rate limiting on reveals. A competitor or spammer could register, reveal every seller's contact info, and export it. The analytics tracks reveals but does not block abuse.

### 4.4 No Intellectual Property Verification
When a seller uploads code, there is no check that:
- They own the code
- The code is not stolen from another developer
- The code is not scraped from open-source repos with restrictive licenses
- The code does not contain malware or backdoors

You are legally exposed as the platform operator if stolen code is sold here.

---

## 5. TECHNICAL DEBT

### 5.1 No SSR on Key Pages
All listing pages are `'use client'` with useEffect fetching. This means:
- Google sees empty pages
- Users see flash of empty state
- Social preview scrapers see no content
- Zero SEO benefit

### 5.2 No Search Engine Indexing of Content
Because templates load client-side, no template title, description, or tag is indexed by Google. A user searching "Next.js dashboard template" on Google will not find your platform.

### 5.3 Fake Stats on Landing Page
Landing page shows: "500+ Templates, 10K+ Developers, 50K+ Downloads." The actual database has 16 templates. These are fabricated numbers. Any journalist, competitor, or sophisticated user who checks the API will find 16 entries. This erodes trust.

### 5.4 File Download Has No Expiry
R2 file URLs are permanent public URLs. Once a buyer (or anyone) has a download link, they can share it infinitely. There's no signed URL with expiry per purchase.

### 5.5 No Rate Limiting
No rate limiting on:
- Contact info reveals (email/phone harvesting)
- API endpoints (abuse)
- Upload endpoints (storage abuse)
- Registration (bot accounts)

### 5.6 Price Stored as Decimal but Displayed Inconsistently
`price` is `Decimal` in Prisma but the frontend does `Number(template.price).toFixed(2)`. This works but loses Prisma's precision benefits. No currency display (just `$`) — no internationalization.

---

## 6. STRATEGIC ASSESSMENT

### Should You Continue This Platform As-Is?
**No.** The current model — a code marketplace operated by one person in Azerbaijan with no payment processing — is not viable as a business.

### Should You Abandon It Entirely?
**Also no.** You have:
- Working infrastructure (Next.js, PostgreSQL, Cloudflare R2, Auth)
- 16 real projects listed
- Some real traffic and contact reveals happening
- Development skills and domain knowledge

The platform is not worthless. But it needs a fundamental pivot, not more features.

---

## 7. PIVOT OPTIONS (Ordered by Viability)

### Option A: "Hire Me" Portfolio Platform (Highest Viability)
**Change the model:** Instead of selling code, use the platform to sell **yourself as a developer**. Each project becomes a case study. Buyers don't buy the code — they hire you to build something similar. This:
- Eliminates payment processing complexity (one-on-one client agreements)
- Eliminates support scalability problem (you're already billing hourly)
- Uses your existing projects as portfolio evidence
- Actually works with wire transfers, bank transfers, local payment methods
- Solves the "AI era" problem — clients who trust a specific developer will pay more than an AI prompt

**Effort to pivot:** Low. Rename "price" to "starting from" and add a "Hire Me" CTA.

### Option B: Developer Directory for Azerbaijani Developers (Medium Viability)
**Change the audience:** Stop competing globally. Become the go-to platform for Azerbaijani companies to find developers and for developers to showcase work. Local trust, local payments, local language.
- Add LinkedIn-style developer profiles
- Companies post projects, developers apply
- Use local payment methods (Kapital Bank, PAŞA Bank APIs)
- Partner with tech communities (BAKU.DEV, etc.)

**Effort to pivot:** Medium. Requires new features (job postings, applications).

### Option C: Productized Service Marketplace (Medium Viability)
**Change what's sold:** Instead of code, sell **services with fixed scopes**. Example: "I will deploy this app for you for $200", "I will customize this template for $500." This is the Fiverr model but focused on your tech stack.
- Easier to scope and deliver
- Easier to price
- Works with any payment method
- You deliver time, not a product that needs maintenance

**Effort to pivot:** Medium. Requires messaging system and order management.

### Option D: Fix the Marketplace (Lowest Recommended Priority)
If you want to stay a marketplace:
1. Integrate Paddle or LemonSqueezy for payments
2. Gate downloads behind purchase
3. Fix SSR so Google can index content
4. Delete fake stats
5. Add real dispute resolution policy
6. Focus on ONE category (e.g., only Next.js templates)
7. Get 10 high-quality sellers before launching publicly

**Effort:** High. Requires payment integration, legal framework, trust infrastructure.

### Option E: Kill and Reuse (Honest Option)
The infrastructure is valuable. The marketplace concept in this form is not. You could:
- Open-source the platform and gain developer reputation
- Use the codebase as a "for sale" project on Acquire.com or Microacquire
- Strip it down to your personal portfolio
- Build something completely different solving an Azerbaijan-specific problem

---

## 8. IMMEDIATE ACTION ITEMS (If You Continue)

### This Week (Fixes):
- [ ] Fix fake landing page stats (replace with real numbers)
- [ ] Convert `/templates` page to Server Component to fix SEO and "0 projects" flash
- [ ] Fix category mismatch between upload form and filter
- [ ] Add rate limiting to contact reveal endpoints

### This Month (Strategic):
- [ ] Choose one of the pivot options above
- [ ] Buy a memorable .com or .io domain
- [ ] Integrate Paddle or LemonSqueezy if staying as marketplace
- [ ] Remove or clarify the `hasSupport` feature — it's misleading without infrastructure

### Longer Term:
- [ ] Define exactly ONE target user (seller type + buyer type)
- [ ] Write real Terms of Service covering marketplace transactions
- [ ] Reach out to 5 real developers to list projects before marketing to buyers
- [ ] Decide: global or Azerbaijan-focused? (you cannot do both with current resources)

---

## 9. BOTTOM LINE

The platform is not broken because of bad code. The code is actually good. It is broken because:

1. **The payment problem is structural** — without payment processing that works in Azerbaijan, there is no marketplace, only a contact directory
2. **The support model doesn't scale** — selling your own apps means you become support staff for every buyer
3. **The market is moving against you** — AI tools are eliminating the demand for pre-built code
4. **You're competing where you can't win** — against global platforms with years of trust and millions of listings

The most honest path forward: **pivot to a "hire the developer" model.** Your projects become proof of skill, not products for sale. You earn more per project, eliminate the payment complexity, and differentiate from AI by offering a relationship and accountability.

If the marketplace idea still excites you, pick **one narrow category** (e.g., "Next.js SaaS boilerplates for Azerbaijani startups"), integrate Paddle for payments, and build supply (sellers) before marketing to buyers.

---

*This document was generated via deep codebase analysis, live site inspection, and API testing on 2026-03-12.*
