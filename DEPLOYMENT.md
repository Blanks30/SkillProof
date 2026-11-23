# SkillProof — Production Deployment Guide

This document details the production engineering setup, secrets sanitation, and deployment instructions for **SkillProof** to **GitHub** and **Render** (`render.com`).

---

## 1. System Architecture & Service Topography

SkillProof is architected as a **unified full-stack Next.js 14 App Router application**:
- **Frontend Presentation Layer:** Next.js 14 (React 18), Tailwind CSS, Three.js spatial viewport, Framer Motion, and Lucide React.
- **Backend Service Layer:** Next.js API Routes (`/api/auth/*`, `/api/certificates/*`, `/api/issuers/*`, `/api/stats/*`) running as serverless Node.js endpoints.
- **Data Persistence:** Prisma ORM with SQLite (embedded file database for demo) or PostgreSQL.
- **Decentralized Verification:** Client-side Ethers.js v6 interaction with the Polygon Amoy / Sepolia smart contract registry.

> **Deployment Topography:** **Single Unified Render Web Service.** No separate frontend/backend services required.

---

## 2. Production Build Verification

The application was tested and verified clean with `0` type errors and `0` linting failures:
```bash
npm run build
# Executes: prisma generate && next build
# Result: 24/24 static & dynamic pages compiled successfully.
```

- **Production Build Command:** `npm install && npx prisma generate && npm run build`
- **Production Start Command:** `npm start` (Next.js automatically binds to Render's dynamic `$PORT`).

---

## 3. Secrets Sanitation & Git Hygiene

The following safety controls are enforced by `.gitignore`:
- `.env` and `.env*.local` are strictly excluded from source control.
- Embedded databases (`dev.db`, `prisma/*.db`, `*.sqlite`) are ignored.
- Smart contract build artifacts (`artifacts/`, `cache/`, `typechain-types/`) are excluded.
- Private keys, `.pem`, and `.key` files are blocked from Git commits.
- `.env.example` provides sanitized reference templates without real private keys or credentials.

---

## 4. GitHub Push Procedure

The local repository is initialized and pre-committed on branch `main`.

Run the following commands in your terminal:

```bash
# 1. Navigate to the project root
cd "C:\Users\MOHAMMED\Videos\BLOCKCHAIN MP"

# 2. Link your GitHub repository
git remote add origin https://github.com/Blanks30/SkillProof.git

# 3. Ensure branch is main
git branch -M main

# 4. Push your code to GitHub
git push -u origin main
```

*(If you have already configured origin, use `git remote set-url origin https://github.com/Blanks30/SkillProof.git` before pushing).*

---

## 5. Render Deployment Instructions

### Option A: Automatic via Render Blueprint (Recommended)
This repository includes a [`render.yaml`](./render.yaml) specification:
1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **"New +"** → **"Blueprint"**.
3. Select your `Blanks30/SkillProof` repository.
4. Render will automatically parse `render.yaml`, configure the Web Service, inject the environment variables, and trigger the build.

---

### Option B: Manual Web Service Setup
1. Log in to [render.com](https://render.com).
2. Click **"New +"** → **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and choose `Blanks30/SkillProof`.
4. Fill in the deployment configuration:
   - **Name:** `skillproof`
   - **Region:** Closest region (e.g. *Singapore*, *Frankfurt*, or *Oregon*)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. In **Environment Variables**, add:
   - `NODE_VERSION` = `20`
   - `DATABASE_URL` = `file:./dev.db`
   - `NEXTAUTH_SECRET` = `skillproof-super-secure-production-ready-jwt-secret-key-32chars`
   - `NEXT_PUBLIC_CHAIN_ID` = `80002`
   - `NEXT_PUBLIC_NETWORK_NAME` = `Polygon Amoy Testnet`
   - `NEXT_PUBLIC_RPC_URL` = `https://rpc-amoy.polygon.technology`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0x71C8F7A853245B11C194f48A141d6D33a0E821Db`
   - `NEXT_PUBLIC_BLOCK_EXPLORER` = `https://amoy.polygonscan.com`
6. Click **"Deploy Web Service"**.

---

## 6. Post-Deployment Verification Checklist

Once Render reports **"Live"**:
- [ ] Visit `https://<your-service>.onrender.com` — verify the Obsidian Ember 3D hero scene renders smoothly.
- [ ] Test the Public Verification sandbox at `/verify` using `SKP-2024-98421`.
- [ ] Navigate to `/dashboard` to confirm Student credential views.
- [ ] Navigate to `/issuer` to confirm Issuer Studio batch minting forms.
- [ ] Inspect browser console to confirm zero WebGL or hydration errors.
