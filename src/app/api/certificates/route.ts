import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCertificateHash, generateCertificateId } from "@/lib/hash";
import { SimulatedBlockchain } from "@/lib/mockBlockchain";
import QRCode from "qrcode";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const userEmail = searchParams.get("userEmail");
    const status = searchParams.get("status");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { certId: { contains: search } },
        { recipientName: { contains: search } },
        { courseOrSkill: { contains: search } },
        { institutionName: { contains: search } },
      ];
    }

    if (role === "STUDENT" && userEmail) {
      where.recipientEmail = userEmail;
    }

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        issuer: { include: { institution: true, user: true } },
      },
    });

    return NextResponse.json({ success: true, count: certificates.length, certificates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      recipientName,
      recipientEmail,
      recipientAddress,
      institutionName,
      courseOrSkill,
      projectTitle,
      description,
      issueDate,
      certificateType,
      issuerEmail,
      fileData, // optional base64
    } = body;

    if (!recipientName || !courseOrSkill || !institutionName) {
      return NextResponse.json(
        { error: "Recipient Name, Course/Skill, and Institution are required." },
        { status: 400 }
      );
    }

    // 1. Resolve Issuer
    let issuer = await prisma.issuer.findFirst({
      where: issuerEmail ? { user: { email: issuerEmail } } : {},
      include: { user: true, institution: true },
    });

    if (!issuer) {
      // Find fallback or create issuer
      issuer = await prisma.issuer.findFirst({
        include: { user: true, institution: true },
      });
    }

    if (!issuer) {
      return NextResponse.json({ error: "No authorized issuer found." }, { status: 400 });
    }

    // 2. Generate unique Certificate ID and cryptographic SHA-256 hash
    const certId = generateCertificateId();
    const normalizedIssueDate = issueDate ? new Date(issueDate) : new Date();

    const certHash = generateCertificateHash({
      certId,
      recipientName,
      recipientEmail,
      institutionName,
      courseOrSkill,
      projectTitle,
      issueDate: normalizedIssueDate,
      certificateType: certificateType || "Course Completion",
      fileBufferOrBase64: fileData,
    });

    // 3. Generate QR code pointing to public verification page
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${appUrl}/verify?id=${encodeURIComponent(certId)}`;
    const qrCodeData = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });

    // 4. Record to blockchain / cryptographic state
    const issuerWallet = issuer.walletAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const chainResult = SimulatedBlockchain.issueCertificate({
      certId,
      certHash,
      issuerAddress: issuerWallet,
      recipientName,
      courseOrSkill,
      issueDate: Math.floor(normalizedIssueDate.getTime() / 1000),
    });

    // 5. Store in Database
    const certificate = await prisma.certificate.create({
      data: {
        certId,
        certHash,
        recipientName,
        recipientEmail,
        recipientAddress,
        institutionName,
        courseOrSkill,
        projectTitle,
        description,
        issueDate: normalizedIssueDate,
        certificateType: certificateType || "Course Completion",
        qrCodeData,
        blockchainTxHash: chainResult.txHash,
        blockNumber: chainResult.blockNumber,
        status: "VALID",
        issuerId: issuer.id,
      },
    });

    // 6. Record Blockchain Transaction
    await prisma.blockchainTransaction.create({
      data: {
        txHash: chainResult.txHash,
        blockNumber: chainResult.blockNumber,
        fromAddress: issuerWallet,
        toAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x71C8F7A853245B11C194f48A141d6D33a0E821Db",
        operation: "ISSUE_CERTIFICATE",
        certId,
        status: "CONFIRMED",
        gasUsed: "138,450",
      },
    });

    // 7. Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CERT_ISSUED",
        performedBy: issuer.user.email,
        details: JSON.stringify({ certId, certHash, recipientName, courseOrSkill }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate issued and recorded on blockchain registry successfully.",
      certificate,
      txHash: chainResult.txHash,
      blockNumber: chainResult.blockNumber,
    });
  } catch (error: any) {
    console.error("Issuance failed:", error);
    return NextResponse.json({ error: error.message || "Failed to issue certificate" }, { status: 500 });
  }
}
