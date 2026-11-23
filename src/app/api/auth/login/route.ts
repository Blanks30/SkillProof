import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, walletAddress } = body;

    let user;

    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { issuerProfile: { include: { institution: true } } },
      });
    } else if (walletAddress) {
      user = await prisma.user.findFirst({
        where: { walletAddress: { equals: walletAddress } },
        include: { issuerProfile: { include: { institution: true } } },
      });
    }

    if (!user && role) {
      // Find default user by role for demo convenience
      user = await prisma.user.findFirst({
        where: { role },
        include: { issuerProfile: { include: { institution: true } } },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: user.walletAddress,
        institutionName: user.issuerProfile?.institution?.name || "SkillProof Global",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
