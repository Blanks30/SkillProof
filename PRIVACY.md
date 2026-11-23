# SkillProof Privacy & Data Governance

SkillProof enforces privacy-first design principles for blockchain credentialing.

## 1. Separation of On-Chain and Off-Chain Data

### What is Recorded On-Chain:
- **Certificate Identifier:** e.g. `SKP-2024-98421`.
- **SHA-256 Hash:** 32-byte cryptographic digest of certificate metadata and document contents.
- **Issuer Public Address:** The Ethereum/Polygon wallet address that signed the issuance transaction.
- **Credential Title & Recipient Name:** Public credential classification.
- **Revocation Status & Timestamp:** Transparent status flag.

### What Remains Strictly Off-Chain:
- Student contact emails and phone numbers.
- National identification numbers and government credentials.
- Raw document files and student grade histories.

## 2. Client-Side Cryptographic Digesting
When verifying an uploaded certificate file (PDF or image), the SHA-256 digest is calculated locally inside the client's browser using the Web Cryptography API (`crypto.subtle`). The raw document file is never transmitted to the public blockchain.

## 3. Data Retention & Revocation Transparency
Revoking a certificate updates the boolean revocation flag on-chain. The historical transaction remains preserved on the ledger for auditability, but verifiers are immediately informed that the credential is no longer valid.
