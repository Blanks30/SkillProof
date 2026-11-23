import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const issuers = await prisma.issuer.findMany({
      include: {
        user: true,
        institution: true,
        _count: {
          select: { certificates: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: issuers.length, issuers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { issuerId, isApproved } = body;

    if (!issuerId) {
      return NextResponse.json({ error: "Issuer ID is required" }, { status: 400 });
    }

    const updatedIssuer = await prisma.issuer.update({
      where: { id: issuerId },
      data: { isApproved: Boolean(isApproved) },
      include: { user: true, institution: true },
    });

    await prisma.auditLog.create({
      data: {
        action: isApproved ? "ISSUER_APPROVED" : "ISSUER_DEACTIVATED",
        performedBy: "admin@skillproof.io",
        details: `Issuer ${updatedIssuer.user.name} (${updatedIssuer.institution.name}) updated approval status to: ${isApproved}`,
      },
    });

    return NextResponse.json({ success: true, issuer: updatedIssuer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
