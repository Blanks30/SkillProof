import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SimulatedBlockchain } from "@/lib/mockBlockchain";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { certId, reason, revokedByEmail, revokerAddress } = body;

    if (!certId || !reason) {
      return NextResponse.json(
        { error: "Certificate ID and revocation reason are required" },
        { status: 400 }
      );
    }

    const cert = await prisma.certificate.findUnique({
      where: { certId },
      include: { issuer: { include: { user: true } } },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    if (cert.status === "REVOKED") {
      return NextResponse.json(
        { error: "Certificate has already been revoked" },
        { status: 400 }
      );
    }

    // Revoke on blockchain ledger
    const effectiveRevokerAddress =
      revokerAddress || cert.issuer.walletAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    const chainResult = SimulatedBlockchain.revokeCertificate(
      certId,
      effectiveRevokerAddress,
      reason
    );

    const now = new Date();

    // Update DB certificate
    const updatedCert = await prisma.certificate.update({
      where: { certId },
      data: {
        status: "REVOKED",
        revocationReason: reason,
        revokedAt: now,
        revokedByAddress: effectiveRevokerAddress,
      },
    });

    // Record Revocation record
    await prisma.certificateRevocation.create({
      data: {
        certificateId: cert.id,
        reason,
        revokedBy: effectiveRevokerAddress,
        txHash: chainResult.txHash,
      },
    });

    // Record Blockchain Transaction
    await prisma.blockchainTransaction.create({
      data: {
        txHash: chainResult.txHash,
        blockNumber: chainResult.blockNumber,
        fromAddress: effectiveRevokerAddress,
        toAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x71C8F7A853245B11C194f48A141d6D33a0E821Db",
        operation: "REVOKE_CERTIFICATE",
        certId,
        status: "CONFIRMED",
        gasUsed: "84,320",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "CERT_REVOKED",
        performedBy: revokedByEmail || effectiveRevokerAddress,
        details: JSON.stringify({ certId, reason, txHash: chainResult.txHash }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Certificate ${certId} revoked successfully.`,
      certificate: updatedCert,
      txHash: chainResult.txHash,
    });
  } catch (error: any) {
    console.error("Revocation error:", error);
    return NextResponse.json({ error: error.message || "Failed to revoke certificate" }, { status: 500 });
  }
}
