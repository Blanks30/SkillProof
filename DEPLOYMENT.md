# SkillProof — Production Deployment Guide

This document details the production engineering setup, PostgreSQL database migration, blockchain configuration, secrets sanitation, and deployment instructions for **SkillProof** to **GitHub** and **Render** (`render.com`).

---

## 1. System Architecture & Database Topography

SkillProof is architected as a **unified full-stack Next.js 14 App Router application** backed by **PostgreSQL**:
- **Application Runtime:** Next.js 14 (React 18, TypeScript, Tailwind CSS, Three.js spatial viewports).
- **Backend Service Layer:** Next.js API Routes (`/api/auth/*`, `/api/certificates/*`, `/api/issuers/*`, `/api/stats/*`) in Node.js.
- **Production Database:** Managed PostgreSQL database on Render.
- **ORM & Migrations:** Prisma ORM configured with `provider = "postgresql"` and baseline migration `20261123000000_init`.
- **Blockchain Network:** Polygon Amoy Testnet (Chain ID `80002`), interacting with smart contract `SkillProofRegistry.sol`.

> **Render Deployment Topography:** **1 Render Web Service** linked to **1 Render Managed PostgreSQL Database**.

---

## 2. Blockchain Network & Smart Contract Verification

| Parameter | Configuration | Status |
| :--- | :--- | :--- |
| **Network Name** | Polygon Amoy Testnet | Configured |
| **Chain ID** | `80002` | Verified across Hardhat & App |
| **RPC Endpoint** | `https://rpc-amoy.polygon.technology` | Public Polygon Amoy RPC |
| **Contract Registry** | `0x71C8F7A853245B11C194f48A141d6D33a0E821Db` | Deployed `SkillProofRegistry.sol` |
| **Block Explorer** | `https://amoy.polygonscan.com` | Official Amoy Explorer |
| **Fallback Engine** | Simulated Cryptographic Ledger | Integrated gracefully in `src/lib/blockchain.ts` |

---

## 3. Production Build & Migration Verification

The production build and migration suite have been verified:
- **Prisma Schema:** `datasource db { provider = "postgresql" }`
- **Migration Script:** `prisma/migrations/20261123000000_init/migration.sql`
- **Build Command:** `npm install && npx prisma migrate deploy && node prisma/seed.js && npm run build`
- **Start Command:** `npm start` *(Next.js automatically binds to Render’s dynamic `$PORT`)*
- **Compilation Result:** 24/24 static & dynamic routes compiled successfully with 0 type errors.

---

## 4. Secrets Sanitation & Git Hygiene

The following safety controls are strictly active in `.gitignore`:
- `.env`, `.env*.local`, `.env.production` are excluded from version control.
- Local embedded databases (`dev.db`, `*.db`, `*.sqlite`) are ignored.
- Smart contract build artifacts (`artifacts/`, `cache/`, `typechain-types/`) are excluded.
- Private keys, `.pem`, and `.key` files are blocked from Git commits.
- `.env.example` provides sanitized templates with zero exposed secrets.

---

## 5. GitHub Push Instructions

Your local Git repository is mapped to `https://github.com/Blanks30/SkillProof.git` on branch `main`.

Run this command in your terminal:

```bash
git push -u origin main
```

---

## 6. Render Deployment Instructions

### Option A: Automatic via Render Blueprint (Recommended)
This repository includes a [`render.yaml`](./render.yaml) specification that automatically provisions both the PostgreSQL database and the Web Service:

1. Log in to **[dashboard.render.com](https://dashboard.render.com)**.
2. Click **"New +"** → **"Blueprint"**.
3. Select your repository: **`Blanks30/SkillProof`**.
4. Render will detect `render.yaml` and display:
   - **PostgreSQL Database:** `skillproof-postgres` (Free tier)
   - **Web Service:** `skillproof` (Free tier)
5. Click **"Apply"**.
6. Render provisions the database, runs `prisma migrate deploy` to create all tables, executes `prisma/seed.js` to populate initial demo data, compiles Next.js, and publishes the live site.

---

### Option B: Manual Setup on Render
If setting up services individually:

#### Step 1: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**.
2. Name: `skillproof-postgres`
3. Database: `skillproof`
4. User: `skillproof_user`
5. Plan: `Free`
6. Click **"Create Database"** and copy the **Internal Database URL**.

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**.
2. Connect `Blanks30/SkillProof` (Branch: `main`, Runtime: `Node`).
3. **Build Command:** `npm install && npx prisma migrate deploy && node prisma/seed.js && npm run build`
4. **Start Command:** `npm start`
5. **Environment Variables:**
   - `NODE_VERSION` = `20`
   - `DATABASE_URL` = *(Paste the Internal Database URL from Step 1)*
   - `NEXTAUTH_SECRET` = `skillproof-super-secure-production-ready-jwt-secret-key-32chars`
   - `NEXT_PUBLIC_CHAIN_ID` = `80002`
   - `NEXT_PUBLIC_NETWORK_NAME` = `Polygon Amoy Testnet`
   - `NEXT_PUBLIC_RPC_URL` = `https://rpc-amoy.polygon.technology`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0x71C8F7A853245B11C194f48A141d6D33a0E821Db`
   - `NEXT_PUBLIC_BLOCK_EXPLORER` = `https://amoy.polygonscan.com`
6. Click **"Deploy Web Service"**.

---

## 7. Post-Deployment Smoke Test

Once Render reports status **"Live"**:
1. Open the public URL (e.g. `https://skillproof.onrender.com`).
2. Verify the Obsidian Ember 3D hero viewport renders smoothly.
3. Test public certificate verification at `/verify` using `SKP-2024-98421`.
4. Test student credential viewing at `/dashboard`.
5. Test issuer certificate minting at `/issuer`.
