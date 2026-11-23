# SkillProof Quality Assurance & Testing Strategy

This project maintains automated tests across smart contracts, cryptographic functions, and API verification logic.

## 1. Test Coverage Scope

### Smart Contract Tests (`contracts/test/SkillProofRegistry.test.ts`)
- **Access Control:**
  - Owner initialization and default authorization.
  - Adding and removing authorized issuers.
  - Rejecting unauthorized issuer additions.
- **Certificate Issuance:**
  - Successful issuance and event emission (`CertificateIssued`).
  - Rejection of issuance attempts by unauthorized wallets.
  - Rejection of duplicate Certificate IDs.
  - Rejection of duplicate cryptographic SHA-256 hashes.
  - Validation of non-empty mandatory fields.
- **Certificate Verification:**
  - Verification by unique human-readable ID (`SKP-YYYY-XXXXX`).
  - Verification by cryptographic hash digest.
  - Handling of non-existent certificates.
- **Certificate Revocation:**
  - Authorized revocation by original issuer.
  - Authorized administrative revocation by contract owner.
  - Rejection of unauthorized third-party revocations.
  - Rejection of double revocation attempts.
  - Verification check confirming revoked status.

## 2. Running Test Commands

### Smart Contract Test Suite
```bash
npx hardhat test
```
*Result: 18 passing tests in under 3 seconds.*

### Full Production Build & Type Check
```bash
npm run build
```
*Result: Static export and compilation of all 22 application routes without errors.*
