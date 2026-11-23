import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role") || "STUDENT";

    const user = await prisma.user.findFirst({
      where: email ? { email } : { role },
      include: { issuerProfile: { include: { institution: true } } },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        walletAddress: user.walletAddress,
        institutionName: user.issuerProfile?.institution?.name || "SkillProof Global",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
