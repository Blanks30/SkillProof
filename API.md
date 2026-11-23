# SkillProof REST API Specification

SkillProof exposes a REST API for certificate querying, issuance, blockchain verification, and governance.

---

## 1. Authentication
Endpoints requiring authorization validate user roles (`ADMIN`, `ISSUER`, `STUDENT`) via session headers or JWT tokens.

---

## 2. Endpoints

### `POST /api/certificates/verify`
Verify authenticity of a certificate using either its Certificate ID or SHA-256 cryptographic hash.

**Request Body:**
```json
{
  "certId": "SKP-2024-98421"
}
```
*or*
```json
{
  "certHash": "0x89fa9b736b69b827e283812837bc901a88df67a57c5bf7e3110294bc1763ef29"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "status": "VERIFIED",
  "verified": true,
  "isRevoked": false,
  "details": {
    "certId": "SKP-2024-98421",
    "certHash": "0x89fa9b736...",
    "recipientName": "Alex Thorne",
    "institutionName": "MetaCode Institute",
    "courseOrSkill": "Full-Stack Web3 & Solidity Architecture",
    "issueDate": "2024-08-15T00:00:00.000Z",
    "blockchainTxHash": "0x89fa9b736..."
  },
  "blockchainProof": {
    "network": "Polygon Amoy Testnet",
    "contractAddress": "0x71C8F7A853245B11C194f48A141d6D33a0E821Db",
    "hashMatch": true
  }
}
```

---

### `POST /api/certificates`
Issue and record a new certificate on the blockchain registry.

**Authorization:** Authorized Issuer or Admin

**Request Body:**
```json
{
  "recipientName": "Sarah Connor",
  "recipientEmail": "s.connor@example.com",
  "institutionName": "MetaCode Institute",
  "courseOrSkill": "Full-Stack Web3 Architecture",
  "projectTitle": "DeFi Liquidity Vault",
  "description": "Demonstrated advanced EVM and smart contract security.",
  "issueDate": "2024-11-23",
  "certificateType": "Course Completion"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Certificate issued and recorded on blockchain registry successfully.",
  "certificate": {
    "certId": "SKP-2024-A1B2C",
    "certHash": "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "status": "VALID",
    "qrCodeData": "data:image/png;base64,..."
  },
  "txHash": "0x123abc...",
  "blockNumber": 1845351
}
```

---

### `POST /api/certificates/revoke`
Revoke an issued certificate.

**Request Body:**
```json
{
  "certId": "SKP-2024-98421",
  "reason": "Administrative correction"
}
```

---

### `GET /api/stats`
Telemetry statistics for dashboards and blockchain node status.
