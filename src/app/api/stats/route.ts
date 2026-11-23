import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SimulatedBlockchain } from "@/lib/mockBlockchain";

export async function GET() {
  try {
    const [
      totalCertificates,
      validCertificates,
      revokedCertificates,
      totalIssuers,
      totalInstitutions,
      recentTransactions,
      recentCertificates,
    ] = await Promise.all([
      prisma.certificate.count(),
      prisma.certificate.count({ where: { status: "VALID" } }),
      prisma.certificate.count({ where: { status: "REVOKED" } }),
      prisma.issuer.count(),
      prisma.institution.count(),
      prisma.blockchainTransaction.findMany({
        take: 8,
        orderBy: { timestamp: "desc" },
      }),
      prisma.certificate.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { issuer: { include: { institution: true } } },
      }),
    ]);

    const latestBlock = SimulatedBlockchain.getLatestBlock();

    return NextResponse.json({
      success: true,
      stats: {
        totalCertificates,
        validCertificates,
        revokedCertificates,
        totalIssuers,
        totalInstitutions,
        latestBlock,
        network: process.env.NEXT_PUBLIC_NETWORK_NAME || "Polygon Amoy Testnet",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x71C8F7A853245B11C194f48A141d6D33a0E821Db",
      },
      recentTransactions,
      recentCertificates,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
