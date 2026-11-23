import crypto from "crypto";

/**
 * Standardized SHA-256 cryptographic hashing for SkillProof certificates.
 * Normalizes all key fields so hashing produces identical deterministic digests across
 * browser and Node.js environments.
 */
export interface CertificatePayload {
  certId: string;
  recipientName: string;
  recipientEmail?: string | null;
  institutionName: string;
  courseOrSkill: string;
  projectTitle?: string | null;
  issueDate: string | number | Date;
  certificateType: string;
  fileBufferOrBase64?: string | null;
}

export function generateCertificateHash(payload: CertificatePayload): string {
  // Normalize date to ISO string
  const normalizedDate = new Date(payload.issueDate).toISOString().split("T")[0];

  // Canonical string representation
  const canonicalString = [
    payload.certId.trim().toUpperCase(),
    payload.recipientName.trim().toLowerCase(),
    (payload.recipientEmail || "").trim().toLowerCase(),
    payload.institutionName.trim(),
    payload.courseOrSkill.trim(),
    (payload.projectTitle || "").trim(),
    normalizedDate,
    payload.certificateType.trim(),
    payload.fileBufferOrBase64 ? payload.fileBufferOrBase64.slice(0, 200) : "", // incorporate document fingerprint
  ].join("|");

  const hash = crypto.createHash("sha256").update(canonicalString, "utf8").digest("hex");
  return `0x${hash}`;
}

/**
 * Hash raw file buffer (e.g. uploaded PDF or document)
 */
export function hashDocumentBuffer(buffer: Buffer): string {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  return `0x${hash}`;
}

/**
 * Generate human-friendly Unique Certificate ID: e.g. SKP-2024-89421
 */
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SKP-${year}-${randomPart}`;
}
