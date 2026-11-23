# Security Policy & Vulnerability Disclosure

This document outlines the security posture of **SkillProof**, the threat model, best‑practice recommendations, and the vulnerability disclosure process.

---

## 1. Supported Versions

| Version | Supported |
| :--- | :--- |
| 1.0.x | Yes |
| < 1.0 | No |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability within SkillProof or its smart contracts:

1. **Do not disclose it publicly** or open a public GitHub issue.
2. Email full technical details and reproduction steps to **security@skillproof.io**.
3. We acknowledge reports within 48 hours and provide updates every 5 business days until resolution.

---

## 3. Smart Contract Security Principles

- **OpenZeppelin Standard Libraries:** Inherits tested implementations of `Ownable` and role validations.
- **Checks‑Effects‑Interactions:** State modifications (such as updating revocation timestamps and existence mappings) are executed prior to event emissions.
- **Reentrancy Immunity:** State‑modifying methods (`issueCertificate`, `revokeCertificate`) do not perform external contract or ether transfers.
- **Duplicate Prevention:** Certificate IDs and cryptographic hashes are validated for uniqueness across all issuances.

---

## 4. Cryptographic Integrity & Data Privacy

- **Zero PII on Public Ledgers:** Student emails, physical addresses, and sensitive identification records are never stored in Solidity contract storage.
- **SHA‑256 Determinism:** Certificate data is canonicalized before hashing to ensure consistent fingerprinting across web clients and servers.
- **Private Key Isolation:** Frontend client code never accesses or stores issuer private keys. All blockchain signing requires explicit client wallet confirmation or secure backend relayer transactions.

---

## 5. Application‑Level Security Measures

| Layer | Controls |
| :--- | :--- |
| **Authentication** | Wallet‑based login with `ethers` provider signature verification. Session tokens stored in HttpOnly secure cookies. |
| **Authorization** | Role‑based access control (Admin, Issuer, Student, Public). Enforced in API routes via middleware. |
| **Input Validation** | Server‑side schema validation (Zod) for all API payloads. File uploads limited to PDFs ≤ 5 MB, scanned for MIME type. |
| **Rate Limiting** | `express-rate-limit` applied to public verification endpoint (10 req/s per IP). |
| **CORS** | Strict origin whitelist (environment variable `NEXT_PUBLIC_ALLOWED_ORIGINS`). |
| **Secrets Management** | Private keys, RPC URLs, and database credentials loaded from environment variables only. `.env` never committed. |
| **Logging & Auditing** | Structured JSON logs for authentication events, certificate issuance/revocation, and admin actions. Stored in PostgreSQL `AuditLog` table. |
| **Dependencies** | Regular `npm audit` and Dependabot alerts. All dependencies pinned to specific versions. |

---

## 6. Deployment & Runtime Hardening

1. **HTTPS Everywhere** – Deploy behind a TLS‑terminated load balancer (e.g., Vercel, Cloudflare). Enforce `Strict-Transport-Security` header.
2. **Content Security Policy** – Restrict script sources to self and trusted CDNs. Block inline scripts (`'unsafe-inline'`).
3. **Secure Cookies** – `Secure`, `HttpOnly`, `SameSite=Strict` for session cookies.
4. **Database Protection** – PostgreSQL runs with least‑privilege user. Network access restricted to application server subnet.
5. **Blockchain Relayer (optional)** – If using a server‑side relayer for transaction submission, store private key in a secret manager (e.g., Azure Key Vault) and never expose it to the frontend.

---

## 7. Continuous Security Practices

- **Static Analysis** – Run Slither on Solidity contracts on every PR.
- **Unit & Integration Tests** – Include security‑focused test cases (unauthorized issuance, revocation, replay attacks).
- **Penetration Testing** – Quarterly external pentest of the web app and API layer.
- **Bug Bounty** – Open bug bounty program (subject to terms on HackerOne). Details will be posted on the official website.

---

## 8. References

- OpenZeppelin Contracts 4.x Security Guidelines
- Ethereum Smart Contract Security Best Practices (Consensys)
- OWASP Top 10 for Web Applications
- NIST SP 800‑53 Rev. 5 (Security and Privacy Controls)


SkillProof is designed with high standards of security for smart contracts, cryptographic data handling, and role-based access control.

## 1. Supported Versions

| Version | Supported |
| :--- | :--- |
| 1.0.x | Yes |
| < 1.0 | No |

## 2. Reporting a Vulnerability

If you discover a security vulnerability within SkillProof or its smart contracts:

1. **Do not disclose it publicly** or open a public GitHub issue.
2. Email full technical details and reproduction steps to **security@skillproof.io**.
3. We acknowledge reports within 48 hours and provide updates every 5 business days until resolution.

## 3. Smart Contract Security Principles

- **OpenZeppelin Standard Libraries:** Inherits tested implementations of `Ownable` and role validations.
- **Checks-Effects-Interactions:** State modifications (such as updating revocation timestamps and existence mappings) are executed prior to event emissions.
- **Reentrancy Immunity:** State-modifying methods (`issueCertificate`, `revokeCertificate`) do not perform external contract or ether transfers.
- **Duplicate Prevention:** Certificate IDs and cryptographic hashes are validated for uniqueness across all issuances.

## 4. Cryptographic Integrity & Data Privacy

- **Zero PII on Public Ledgers:** Student emails, physical addresses, and sensitive identification records are never stored in Solidity contract storage.
- **SHA-256 Determinism:** Certificate data is canonicalized before hashing to ensure consistent fingerprinting across web clients and servers.
- **Private Key Isolation:** Frontend client code never accesses or stores issuer private keys. All blockchain signing requires explicit client wallet confirmation or secure backend relayer transactions.
