# SkillProof Deployment Guide

This document describes how to deploy SkillProof smart contracts, backend services, and frontend applications to staging and production environments.

## 1. Prerequisites

- Node.js v18.0.0 or higher
- Git
- Web3 Wallet (MetaMask) funded with Polygon Amoy testnet MATIC (available from Polygon faucets)
- PostgreSQL database instance (or SQLite for local testing)

## 2. Environment Configuration

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="file:./dev.db"
# Production PostgreSQL example:
# DATABASE_URL="postgresql://user:password@db.supabase.co:5432/skillproof"

# Next.js
NEXT_PUBLIC_APP_URL="https://skillproof.io"
NEXTAUTH_SECRET="your-32-character-secret-key"

# Blockchain Network
NEXT_PUBLIC_CHAIN_ID="80002"
NEXT_PUBLIC_NETWORK_NAME="Polygon Amoy Testnet"
NEXT_PUBLIC_RPC_URL="https://rpc-amoy.polygon.technology"
NEXT_PUBLIC_BLOCK_EXPLORER="https://amoy.polygonscan.com"

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS="0x71C8F7A853245B11C194f48A141d6D33a0E821Db"
PRIVATE_KEY="0x..." # Deployment wallet private key
```

## 3. Smart Contract Compilation & Deployment

1. Compile the contract:
   ```bash
   npx hardhat compile
   ```
2. Run test verification:
   ```bash
   npx hardhat test
   ```
3. Deploy to Polygon Amoy Testnet:
   ```bash
   npx hardhat run contracts/scripts/deploy.ts --network polygonAmoy
   ```
4. Save the emitted contract address and update `NEXT_PUBLIC_CONTRACT_ADDRESS`.

## 4. Frontend & Backend Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure environment variables in the Vercel project dashboard.
4. Set Build Command: `npm run build`
5. Deploy and verify endpoints at `/verify`.
