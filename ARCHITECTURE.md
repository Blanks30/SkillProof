# SkillProof System Architecture

SkillProof is organized as a layered Web3 credential platform separating presentation, API routing, relational data, and immutable blockchain state.

## 1. Architectural Layers

### A. Presentation Layer
- **Framework:** Next.js 14 App Router with React and TypeScript.
- **Styling:** Tailwind CSS with custom dark SaaS theme.
- **Client Web3 Bridge:** Ethers.js v6 with MetaMask provider integration (`window.ethereum`).

### B. Application & API Routing Layer
- **Route Handlers:** `/api/certificates`, `/api/certificates/verify`, `/api/certificates/revoke`, `/api/issuers`, `/api/stats`.
- **Cryptographic Engine:** SHA-256 canonical payload hashing and client-side document fingerprinting (`crypto.subtle`).

### C. Relational Data Layer (Prisma ORM)
- Models for `User`, `Institution`, `Issuer`, `Certificate`, `BlockchainTransaction`, `CertificateRevocation`, and `AuditLog`.
- Complements on-chain verification with metadata caching, search queries, and audit logs.

### D. Blockchain Layer (Polygon Amoy / EVM)
- Smart Contract: `SkillProofRegistry.sol` (Solidity 0.8.20).
- OpenZeppelin `Ownable` for administrative access control.
- Core functions:
  - `issueCertificate(string certId, bytes32 certHash, ...)`
  - `revokeCertificate(string certId, string reason)`
  - `verifyCertificate(string certId)`
  - `verifyCertificateByHash(bytes32 certHash)`
  - `addIssuer(address issuer)`, `removeIssuer(address issuer)`

## 2. Certificate Verification Sequence

```
User / Verifier        Next.js Verifier       Smart Contract / Ledger
      |                       |                          |
      |-- Enter ID or Hash -->|                          |
      |                       |-- verifyCertificate() -->|
      |                       |<-- [isValid, isRevoked]--|
      |                       |                          |
      |<-- Verified Badge ----|                          |
```
