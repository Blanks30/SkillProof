import { ethers } from "ethers";
import { SimulatedBlockchain } from "./mockBlockchain";

// Standard ABI for SkillProofRegistry
export const SKILLPROOF_ABI = [
  "function issueCertificate(string certId, bytes32 certHash, string recipientName, string courseOrSkill, uint256 issueDate) external",
  "function revokeCertificate(string certId, string reason) external",
  "function verifyCertificate(string certId) external view returns (bool isValid, bool isRevoked, bytes32 certHash, address issuer, string recipientName, string courseOrSkill, uint256 issueDate, uint256 revokedAt, string revocationReason)",
  "function verifyCertificateByHash(bytes32 certHash) external view returns (bool isValid, bool isRevoked, string certId, address issuer, string recipientName, string courseOrSkill, uint256 issueDate)",
  "function addIssuer(address issuer) external",
  "function removeIssuer(address issuer) external",
  "function isIssuer(address issuer) external view returns (bool)",
  "function owner() external view returns (address)",
  "event CertificateIssued(string indexed certId, bytes32 indexed certHash, address indexed issuer, string recipientName, string courseOrSkill, uint256 issueDate)",
  "event CertificateRevoked(string indexed certId, address indexed revoker, string reason, uint256 timestamp)",
  "event IssuerAuthorized(address indexed issuer)"
];

export interface VerificationResult {
  source: "polygon-amoy" | "local-hardhat" | "cryptographic-ledger";
  found: boolean;
  isValid: boolean;
  isRevoked: boolean;
  certId: string;
  certHash: string;
  issuerAddress: string;
  recipientName: string;
  courseOrSkill: string;
  issueDate: number;
  revokedAt?: number;
  revocationReason?: string;
  blockNumber?: number;
  txHash?: string;
  matchDetails: {
    hashMatched: boolean;
    computedHash?: string;
    onChainHash?: string;
  };
}

/**
 * Get read-only contract instance if RPC URL and contract address are available
 */
export function getReadOnlyContract() {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) return null;

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    return new ethers.Contract(contractAddress, SKILLPROOF_ABI, provider);
  } catch (err) {
    console.warn("Unable to initialize JsonRpcProvider, falling back to simulated ledger", err);
    return null;
  }
}

/**
 * Verify certificate by ID: checks live blockchain first, falls back gracefully to cryptographic ledger
 */
export async function verifyCertificateOnChain(certId: string): Promise<VerificationResult> {
  const contract = getReadOnlyContract();

  if (contract) {
    try {
      // 3-second timeout for RPC calls to prevent UI hangs
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("RPC Timeout")), 3000)
      );

      const verifyCall = contract.verifyCertificate(certId);
      const res: any = await Promise.race([verifyCall, timeoutPromise]);

      if (res && (res.isValid || res.isRevoked)) {
        return {
          source: "polygon-amoy",
          found: true,
          isValid: res.isValid,
          isRevoked: res.isRevoked,
          certId,
          certHash: res.certHash,
          issuerAddress: res.issuer,
          recipientName: res.recipientName,
          courseOrSkill: res.courseOrSkill,
          issueDate: Number(res.issueDate),
          revokedAt: res.revokedAt ? Number(res.revokedAt) : undefined,
          revocationReason: res.revocationReason || undefined,
          matchDetails: {
            hashMatched: true,
            onChainHash: res.certHash,
          },
        };
      }
    } catch (e) {
      console.info("Blockchain RPC query skipped or timed out, reading simulated cryptographic ledger", e);
    }
  }

  // Fallback to cryptographic ledger
  const sim = SimulatedBlockchain.verifyCertificate(certId);
  if (!sim.found || !sim.record) {
    return {
      source: "cryptographic-ledger",
      found: false,
      isValid: false,
      isRevoked: false,
      certId,
      certHash: "",
      issuerAddress: "",
      recipientName: "",
      courseOrSkill: "",
      issueDate: 0,
      matchDetails: { hashMatched: false },
    };
  }

  return {
    source: "cryptographic-ledger",
    found: true,
    isValid: sim.isValid,
    isRevoked: sim.isRevoked,
    certId: sim.record.certId,
    certHash: sim.record.certHash,
    issuerAddress: sim.record.issuerAddress,
    recipientName: sim.record.recipientName,
    courseOrSkill: sim.record.courseOrSkill,
    issueDate: sim.record.issueDate,
    revokedAt: sim.record.revokedAt,
    revocationReason: sim.record.revocationReason,
    blockNumber: sim.record.blockNumber,
    txHash: sim.record.txHash,
    matchDetails: {
      hashMatched: true,
      onChainHash: sim.record.certHash,
    },
  };
}

/**
 * Verify certificate by cryptographic SHA-256 hash
 */
export async function verifyCertificateByHashOnChain(certHash: string): Promise<VerificationResult> {
  const contract = getReadOnlyContract();

  if (contract) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("RPC Timeout")), 3000)
      );

      const verifyCall = contract.verifyCertificateByHash(certHash);
      const res: any = await Promise.race([verifyCall, timeoutPromise]);

      if (res && (res.isValid || res.isRevoked)) {
        return {
          source: "polygon-amoy",
          found: true,
          isValid: res.isValid,
          isRevoked: res.isRevoked,
          certId: res.certId,
          certHash: certHash,
          issuerAddress: res.issuer,
          recipientName: res.recipientName,
          courseOrSkill: res.courseOrSkill,
          issueDate: Number(res.issueDate),
          matchDetails: {
            hashMatched: true,
            computedHash: certHash,
            onChainHash: certHash,
          },
        };
      }
    } catch (e) {
      console.info("Blockchain hash lookup fallback", e);
    }
  }

  // Fallback to cryptographic ledger
  const sim = SimulatedBlockchain.verifyCertificateByHash(certHash);
  if (!sim.found || !sim.record) {
    return {
      source: "cryptographic-ledger",
      found: false,
      isValid: false,
      isRevoked: false,
      certId: "",
      certHash,
      issuerAddress: "",
      recipientName: "",
      courseOrSkill: "",
      issueDate: 0,
      matchDetails: {
        hashMatched: false,
        computedHash: certHash,
      },
    };
  }

  return {
    source: "cryptographic-ledger",
    found: true,
    isValid: sim.isValid,
    isRevoked: sim.isRevoked,
    certId: sim.record.certId,
    certHash: sim.record.certHash,
    issuerAddress: sim.record.issuerAddress,
    recipientName: sim.record.recipientName,
    courseOrSkill: sim.record.courseOrSkill,
    issueDate: sim.record.issueDate,
    revokedAt: sim.record.revokedAt,
    revocationReason: sim.record.revocationReason,
    blockNumber: sim.record.blockNumber,
    txHash: sim.record.txHash,
    matchDetails: {
      hashMatched: true,
      computedHash: certHash,
      onChainHash: sim.record.certHash,
    },
  };
}
