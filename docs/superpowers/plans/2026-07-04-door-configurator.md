# Door Configurator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first web app that takes wall opening measurements and produces a door configuration sheet ready for production.

**Architecture:** Create a dedicated Next.js app in `apps/porte` with a client-side configurator wizard, a pure TypeScript calculation engine for door sizing/export, and demo catalog data for models and options. Keep production rules in one library so UI, export, and future APIs reuse the same logic.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS 4, TypeScript, Vitest.

---

### Task 1: Scaffold the new mobile-first app

**Files:**
- Create: `apps/porte/package.json`
- Create: `apps/porte/tsconfig.json`
- Create: `apps/porte/next.config.ts`
- Create: `apps/porte/postcss.config.mjs`
- Create: `apps/porte/eslint.config.mjs`
- Create: `apps/porte/next-env.d.ts`
- Create: `apps/porte/src/app/layout.tsx`
- Create: `apps/porte/src/app/globals.css`
- Modify: `package.json`

- [ ] **Step 1: Add root scripts for the new app**
- [ ] **Step 2: Add the app package manifest and standard Next.js config**
- [ ] **Step 3: Add mobile viewport, safe-area CSS, and base theme**
- [ ] **Step 4: Run `pnpm --filter @porte/web typecheck` and fix scaffold issues**
- [ ] **Step 5: Commit scaffold**

### Task 2: Build the door domain model with TDD

**Files:**
- Create: `apps/porte/src/lib/types.ts`
- Create: `apps/porte/src/lib/catalog.ts`
- Create: `apps/porte/src/lib/configurator.ts`
- Create: `apps/porte/src/lib/configurator.test.ts`
- Create: `apps/porte/vitest.config.ts`

- [ ] **Step 1: Write failing tests for measurement reduction, handing, fixed panel split, and export metadata**
- [ ] **Step 2: Run `pnpm --filter @porte/web test` and verify the failures are expected**
- [ ] **Step 3: Implement the minimal calculation and export helpers**
- [ ] **Step 4: Run `pnpm --filter @porte/web test` and make the suite pass**
- [ ] **Step 5: Commit the domain engine**

### Task 3: Build the mobile configurator and export preview

**Files:**
- Create: `apps/porte/src/app/page.tsx`
- Create: `apps/porte/src/components/door-configurator.tsx`

- [ ] **Step 1: Add the configurator screen with loading-free demo data**
- [ ] **Step 2: Add inputs for opening size, wall thickness, model, fixed panel, glass, oval, opening side, and handle side**
- [ ] **Step 3: Show calculated production sheet, SVG schema preview, and validation states**
- [ ] **Step 4: Add export actions for JSON and SVG production sheet**
- [ ] **Step 5: Run `pnpm --filter @porte/web typecheck`**

### Task 4: Verify end-to-end behavior

**Files:**
- Modify: `apps/porte/src/lib/configurator.test.ts` (only if a missing edge case appears)

- [ ] **Step 1: Run focused automated checks: test, typecheck, build**
- [ ] **Step 2: Launch the app locally and manually test the mobile flow**
- [ ] **Step 3: Record a walkthrough video showing configuration and export**
- [ ] **Step 4: Commit, push, and update the PR**
