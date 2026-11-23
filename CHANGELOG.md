# Changelog

All notable changes to the SkillProof platform are documented in this file.

## [1.0.0] - 2024-11-23

### Added
- Solidity smart contract `SkillProofRegistry.sol` (v0.8.20) with OpenZeppelin access controls.
- Comprehensive 18-case Hardhat test suite covering issuance, duplication guards, and revocations.
- Next.js 14 full-stack application with Tailwind CSS and responsive dark dashboard theme.
- Public Certificate Verification page with 3 verification modes: ID lookup, file SHA-256 hash match, and QR code URL input.
- Digital certificate view component with printable layout, cryptographic digest display, and QR codes.
- Role-based workspaces:
  - Student Credential Locker (`/dashboard/student`)
  - Issuer Command Center & Issuance Form (`/dashboard/issuer`, `/dashboard/issuer/issue`)
  - Administrator Governance Console (`/dashboard/admin`)
- Prisma relational database schema with SQLite local development and PostgreSQL support.
- Simulated blockchain ledger engine for reliable, deterministic local testing without external faucet dependencies.
- Complete documentation suite: README, ARCHITECTURE, API, DEPLOYMENT, SECURITY, TESTING, and PRIVACY.
