import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyCertificateOnChain,
  verifyCertificateByHashOnChain,
  VerificationResult,
} from "@/lib/blockchain";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { certId, certHash, fileHash } = body;

    if (!certId && !certHash && !fileHash) {
      return NextResponse.json(
        { error: "Provide either a Certificate ID or a cryptographic hash/file." },
        { status: 400 }
      );
    }

    let verificationResult: VerificationResult;
    let dbCert: any = null;

    if (certId) {
      // 1. Verify by Certificate ID
      verificationResult = await verifyCertificateOnChain(certId.trim());
      dbCert = await prisma.certificate.findFirst({
        where: { certId: certId.trim() },
        include: { issuer: { include: { institution: true, user: true } } },
      });
    } else {
      // 2. Verify by Hash
      const targetHash = (certHash || fileHash).trim();
      verificationResult = await verifyCertificateByHashOnChain(targetHash);

      if (verificationResult.found && verificationResult.certId) {
        dbCert = await prisma.certificate.findFirst({
          where: { certId: verificationResult.certId },
          include: { issuer: { include: { institution: true, user: true } } },
        });
      } else {
        dbCert = await prisma.certificate.findFirst({
          where: { certHash: { equals: targetHash } },
          include: { issuer: { include: { institution: true, user: true } } },
        });
      }
    }

    // Determine canonical status
    let status: "VERIFIED" | "REVOKED" | "NOT_FOUND" = "NOT_FOUND";

    if (verificationResult.found) {
      if (verificationResult.isRevoked) {
        status = "REVOKED";
      } else if (verificationResult.isValid) {
        status = "VERIFIED";
      }
    } else if (dbCert) {
      // DB has record; check if revoked in DB
      status = dbCert.status === "REVOKED" ? "REVOKED" : "VERIFIED";
    }

    return NextResponse.json({
      success: true,
      status,
      verified: status === "VERIFIED",
      isRevoked: status === "REVOKED",
      details: {
        certId: dbCert?.certId || verificationResult.certId || certId,
        certHash: dbCert?.certHash || verificationResult.certHash,
        recipientName: dbCert?.recipientName || verificationResult.recipientName,
        recipientEmail: dbCert?.recipientEmail,
        institutionName: dbCert?.institutionName || dbCert?.issuer?.institution?.name || "Verified Educational Institution",
        courseOrSkill: dbCert?.courseOrSkill || verificationResult.courseOrSkill,
        projectTitle: dbCert?.projectTitle,
        description: dbCert?.description,
        certificateType: dbCert?.certificateType || "Course Completion",
        issueDate: dbCert?.issueDate || (verificationResult.issueDate ? new Date(verificationResult.issueDate * 1000) : null),
        blockchainTxHash: dbCert?.blockchainTxHash || verificationResult.txHash,
        blockNumber: dbCert?.blockNumber || verificationResult.blockNumber,
        issuerAddress: verificationResult.issuerAddress || dbCert?.issuer?.walletAddress,
        revocationReason: dbCert?.revocationReason || verificationResult.revocationReason,
        revokedAt: dbCert?.revokedAt || (verificationResult.revokedAt ? new Date(verificationResult.revokedAt * 1000) : null),
        qrCodeData: dbCert?.qrCodeData,
      },
      blockchainProof: {
        network: process.env.NEXT_PUBLIC_NETWORK_NAME || "Polygon Amoy Testnet",
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID || "80002",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        hashMatch: verificationResult.matchDetails?.hashMatched ?? true,
        source: verificationResult.source,
      },
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
