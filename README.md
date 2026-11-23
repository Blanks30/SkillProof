# SkillProof – Blockchain-Based Skill & Project Certificate Verification Platform

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Polygon Amoy](https://img.shields.io/badge/Polygon-Amoy%20Testnet%20(80002)-8247E5?logo=polygon)](https://amoy.polygonscan.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

SkillProof is a production-quality, decentralized certificate and credential verification platform powered by Ethereum & Polygon smart contracts. It provides tamper-resistant verification of skill certificates, boot camp graduations, and project completions, eliminating resume fraud and manual institutional verifications.

---

## 1. Problem Statement & Proposed Solution

### The Problem
Traditional paper diplomas and static PDF certificates are easy to forge, duplicate, or alter with basic design software. Employers and academic institutions often have to depend on slow, expensive manual verification processes, while learners lack a portable, tamper-evident cryptographic credential locker.

### The Solution
SkillProof implements an on-chain cryptographic registry (`SkillProofRegistry.sol`). Each issued certificate receives a unique ID (`SKP-YYYY-XXXXX`) and a deterministic cryptographic SHA-256 hash anchored to the blockchain. Anyone—employers, recruiters, or public verifiers—can instantly verify credentials by ID, QR code, or document hash comparison without relying on intermediaries.

---

## 2. Key Features

- **Multi-Role Role-Based Access Control (RBAC):**
  - **Administrator:** Authorize/deactivate issuing institutions, monitor smart contract transactions, audit logs, and global telemetry.
  - **Certificate Issuer:** Issue digital certificates, attach project milestones, compute deterministic SHA-256 hashes, generate high-density QR codes, and execute on-chain revocations when authorized.
  - **Student / Credential Holder:** Personal credential locker, verifiable LinkedIn/resume share links, high-resolution certificate rendering with printable PDF mode.
  - **Public Verifier:** 3-way instant verification (Certificate ID, Client-Side PDF SHA-256 Drag-and-Drop, or QR Code scanning).
- **Cryptographic Hash Verification:** Compares the SHA-256 hash computed client-side directly with the immutable smart contract record on Polygon Amoy.
- **On-Chain Revocation Transparency:** Revoked credentials immediately return an invalid/revoked status with documented reason and timestamp while preserving the original historical audit trail.
- **Privacy by Design:** Zero sensitive personal information is stored on the public blockchain; only cryptographic hashes, public IDs, and issuer addresses are registered.
- **Dual Blockchain Interoperability:** Connects to live Web3 browser wallets (MetaMask), Polygon Amoy Testnet RPC, and features a built-in cryptographic ledger engine for deterministic zero-dependency local development.

---

## 3. Technology Stack

- **Frontend & App Framework:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Smart Contracts:** Solidity 0.8.20, Hardhat, OpenZeppelin (`Ownable`, `AccessControl`), Ethers.js v6
- **Database & ORM:** Prisma ORM, SQLite (`dev.db`) for immediate zero-config development, with seamless PostgreSQL support
- **Decentralized Storage & Security:** IPFS integration metadata, deterministic SHA-256 canonical hashing (`crypto.subtle` / Node `crypto`)

---

## 4. Architecture Overview

```
                      +---------------------------------------+
                      |       Next.js 14 Web Application      |
                      |  (Landing, Verifier, Role Dashboards) |
                      +-------------------+-------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
      [REST API Endpoints]                                [Client Web3 Provider]
      /api/certificates                                       (window.ethereum /
      /api/certificates/verify                                    MetaMask)
      /api/certificates/revoke                                      |
                |                                                   |
    +-----------v-----------+                           +-----------v-----------+
    |   Prisma Database     |                           | Polygon Amoy Testnet  |
    | (SQLite / PostgreSQL) |                           |  SkillProofRegistry   |
    | - Metadata & Files    |                           | - bytes32 certHash    |
    | - Transaction Logs    |                           | - string certId       |
    | - Audit History       |                           | - bool isRevoked      |
    +-----------------------+                           +-----------------------+
```

---

## 5. Quick Start Instructions

### Prerequisites
- Node.js (v18.0.0 or higher, tested on v24)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/skillproof.git
cd skillproof
npm install
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```

### 3. Database Migration & Seed
Run Prisma to generate types, create the local SQLite database, and seed realistic demo credentials:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 4. Smart Contract Compilation & Tests
Compile the Solidity smart contracts and execute the complete Hardhat test suite:
```bash
npx hardhat compile
npx hardhat test
```
*Expected output: All 18 tests passing (access control, duplicate rejection, verification by ID and hash, revocation rules).*

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Pre-Configured Demo Accounts

For instant 1-click evaluation, sample accounts are available on the [Login Page](/login):

| Role | Email | Name | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@skillproof.io` | Elena Rostova | Authorize issuers, audit system, platform analytics |
| **Issuer** | `issuer@skillproof.io` | Dr. Marcus Vance | Issue certificates, on-chain revocation, stats |
| **Student** | `student@skillproof.io` | Alex Thorne | View credentials, copy verification links, print |

### Demo Certificates to Test Verification:
- **`SKP-2024-98421`**: Full-Stack Web3 & Solidity Architecture (**Valid & Verified**)
- **`SKP-2024-41920`**: Zero-Knowledge Cryptography & zk-SNARKs (**Valid & Verified**)
- **`SKP-2024-11002`**: Smart Contract Security Auditing (**Revoked with documented reason**)

---

## 7. Smart Contract Deployment to Polygon Amoy

To deploy to Polygon Amoy Testnet:
1. Ensure your `.env` contains a funded testnet `PRIVATE_KEY` and `POLYGON_AMOY_RPC_URL`.
2. Run the deployment script:
```bash
npx hardhat run contracts/scripts/deploy.ts --network polygonAmoy
```
3. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` with the output address.

---

## 8. License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
