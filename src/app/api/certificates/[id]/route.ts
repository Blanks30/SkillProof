import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCertificateOnChain } from "@/lib/blockchain";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const certIdentifier = params.id;

    // 1. Look up in Database
    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [{ certId: certIdentifier }, { id: certIdentifier }],
      },
      include: {
        issuer: { include: { institution: true, user: true } },
        revocationHistory: true,
      },
    });

    if (!certificate) {
      // Check if it exists purely on chain
      const onChain = await verifyCertificateOnChain(certIdentifier);
      if (onChain.found) {
        return NextResponse.json({
          success: true,
          certificate: {
            certId: onChain.certId,
            certHash: onChain.certHash,
            recipientName: onChain.recipientName,
            courseOrSkill: onChain.courseOrSkill,
            institutionName: "Verified Blockchain Issuer",
            issueDate: new Date(onChain.issueDate * 1000).toISOString(),
            status: onChain.isRevoked ? "REVOKED" : "VALID",
            revocationReason: onChain.revocationReason,
            revokedAt: onChain.revokedAt ? new Date(onChain.revokedAt * 1000).toISOString() : null,
            blockchainTxHash: onChain.txHash,
            blockNumber: onChain.blockNumber,
          },
          onChainRecord: onChain,
        });
      }

      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // 2. Perform on-chain cryptographic verification
    const onChain = await verifyCertificateOnChain(certificate.certId);

    return NextResponse.json({
      success: true,
      certificate,
      onChainRecord: onChain,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
