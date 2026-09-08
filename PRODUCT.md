# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step. Deployed via GitHub Pages on the custom domain `vamore.shop` (see `CNAME`). Confirmed by the user: the site must stay buildless so it can be published straight from the repository.

## Users

FiveM roleplay server owners and their developers, evaluating paid server scripts. They arrive from Discord, a store listing, or a script showcase video, usually already running a framework (ESX, QBCore, or Qbox) and a patchwork of scripts from different vendors. They are deciding whether one specific script is worth buying, and whether this vendor is credible enough to buy from again.

## Product Purpose

Sell VAmore Systems' FiveM scripts. Each script is sold individually through Tebex; the site is the storefront and the product argument. Success is a visitor understanding what a script does, trusting that it is real and maintained, and completing a Tebex checkout.

## Positioning

Every VAmore script registers its settings with one shared in-game Config Manager (`/vamoreconfig`), so server owners configure scripts through an ACE-gated panel with sliders and inputs instead of editing `config.lua` by hand. Individual vendors sell individual scripts; the differentiator here is that scripts bought separately still share one configuration surface, one permission model, and one support contact.

## Operating Context

Buyers evaluate scripts from a browser, often on a second monitor while their server runs. They compare against competitor storefronts (lbscripts.com was named by the user as a quality reference, not a design to copy). Purchases complete through Tebex's hosted checkout, launched from the site via the Tebex Headless API with a public store token that is safe to ship client-side.

## Capabilities and Constraints

Shipped and purchasable today:
- **Banking** (€40, Tebex package `7627622`): IBAN accounts, 4-digit PIN protection, ATM and branch deposits/withdrawals, tiered compounding savings with goals, event-based credit system, 10 stocks and 5 coins on server-driven pricing engines with history charts, job-bound faction accounts with grade-gated access and automatic per-grade salary payouts, admin dashboard with flagged high-value transactions, suspicious-activity filter, and Discord webhook alerts. ESX, QBCore, Qbox.
- **Config Manager** (€0, Tebex package `7627638`): one ACE-gated in-game panel with a tab per registered script, live-applying settings, built-in location management ("Add here" / "Delete here" placing points at the player's position), and a one-export registration API for third-party scripts. ESX, QBCore, Qbox.

In development, not purchasable:
- **Invoices** (€25): standalone billing script, splitting Banking's invoicing feature out on its own. A detail page exists; no Tebex package yet.
- **Restaurants**: restaurant and kitchen system — recipes, prep stations, cooking minigames, staff roles, stock and supplier ordering, and an in-game owner terminal. In active development.

Constraints: no framework-specific forks (one resource covers ESX, QBCore, Qbox). No build step on the site. The Tebex public token in `script.js` identifies the store and is safe client-side; the private key must never appear in frontend code.

## Brand Commitments

- Name: VAmore Systems. Domain: vamore.shop.
- Existing logo mark and wordmark assets under `assets/` (gradient stroke mark, horizontal and stacked lockups, light and dark variants, favicons).
- Existing palette family is binding at the "roughly keep it" level, confirmed by the user: deep navy background with a blue-to-teal gradient accent.
- The typewriter effect on the hero headline is explicitly liked and must be preserved.
- 3D asset on hand: `assets/glb/creditcard.glb`, currently used for Banking.

## Evidence on Hand

- Real product feature lists for Banking and Config Manager (see their detail pages).
- Real Tebex package IDs for the two purchasable scripts, and a working Headless-API checkout flow.
- Admin panel demo video: `assets/vid/admin-panel-demo.mp4`.
- Nothing else is real. The current site contains fabricated material that must not carry over: an 11-minute demo recording with chapter timestamps, "61 players online", performance figures ("0.19 ms" idle cost versus "0.6–1.4 ms"), and six invented scripts (Phone, Inventory, Housing, Jobs, Garage, Admin, Fuel). There are no testimonials, customer counts, sales figures, review scores, uptime claims, or benchmark results — none may be invented.
- No public Discord invite, Tebex storefront URL, documentation, changelog, status page, or legal pages (Impressum, privacy, terms) exist yet. The user will supply these later; every such link must be an obvious, clearly-marked placeholder rather than a fabricated URL.

## Product Principles

1. **Only ship claims that are true today.** Two scripts are purchasable, two are in development. The site says exactly that, with no invented metrics, testimonials, or recordings.
2. **Each script must stand alone.** Scripts are bought individually; the shared Config Manager is an argument for buying the next one, never a precondition for the first.
3. **Show the actual product.** Feature depth (real modules, real settings, real screenshots and video) persuades this audience more than adjectives about quality.
4. **Framework-agnostic by default.** ESX, QBCore, and Qbox are equal citizens; nothing implies a preferred fork.
5. **Roadmap stays short and credible.** Only work genuinely underway appears as upcoming, and it is never styled to look purchasable.

## Accessibility & Inclusion

No product-specific standard established. General web baseline applies: keyboard-operable controls, visible focus, sufficient contrast on the dark palette, and respect for `prefers-reduced-motion` (the existing site already gates its typewriter and reveal animations on it — that behavior must survive).
