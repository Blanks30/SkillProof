export type UserRole = "ADMIN" | "ISSUER" | "STUDENT" | "VERIFIER";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletAddress?: string | null;
  institutionName?: string | null;
}

export interface CertificateItem {
  id: string;
  certId: string;
  certHash: string;
  recipientName: string;
  recipientEmail?: string | null;
  recipientAddress?: string | null;
  institutionName: string;
  courseOrSkill: string;
  projectTitle?: string | null;
  description?: string | null;
  issueDate: string;
  certificateType: string;
  pdfUrl?: string | null;
  ipfsCid?: string | null;
  qrCodeData?: string | null;
  blockchainTxHash?: string | null;
  blockNumber?: number | null;
  status: "VALID" | "REVOKED";
  revocationReason?: string | null;
  revokedAt?: string | null;
  revokedByAddress?: string | null;
  createdAt: string;
}
