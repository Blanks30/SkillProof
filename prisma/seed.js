const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SkillProof database and cryptographic ledger...");

  // Clean existing data
  await prisma.certificateRevocation.deleteMany();
  await prisma.blockchainTransaction.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.issuer.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auditLog.deleteMany();

  // 1. Create Institutions
  const inst1 = await prisma.institution.create({
    data: {
      name: "MetaCode Institute of Blockchain & AI",
      code: "METACODE-ACADEMY",
      website: "https://metacode.skillproof.io",
      description: "Premier global institute for distributed systems and smart contract engineering.",
      isVerified: true,
    },
  });

  const inst2 = await prisma.institution.create({
    data: {
      name: "Stanford Decentralized Technology Center",
      code: "SDTC-DEV",
      website: "https://crypto.stanford.edu",
      description: "Academic lab pioneering zero-knowledge proofs and digital credential standards.",
      isVerified: true,
    },
  });

  // 2. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@skillproof.io",
      name: "Elena Rostova (Admin)",
      role: "ADMIN",
      walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const issuerUser = await prisma.user.create({
    data: {
      email: "issuer@skillproof.io",
      name: "Dr. Marcus Vance (Chief Certifier)",
      role: "ISSUER",
      walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: "student@skillproof.io",
      name: "Alex Thorne",
      role: "STUDENT",
      walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 3. Create Issuer Profile
  const issuerProfile = await prisma.issuer.create({
    data: {
      userId: issuerUser.id,
      institutionId: inst1.id,
      walletAddress: issuerUser.walletAddress,
      isApproved: true,
    },
  });

  // 4. Sample Certificates with Real Cryptographic Hashes
  const sampleCerts = [
    {
      certId: "SKP-2024-98421",
      recipientName: "Alex Thorne",
      recipientEmail: "student@skillproof.io",
      recipientAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      institutionName: "MetaCode Institute of Blockchain & AI",
      courseOrSkill: "Full-Stack Web3 & Solidity Architecture",
      projectTitle: "DeFi Yield Aggregator Protocol",
      description: "Demonstrated advanced mastery in EVM development, smart contract security, gas optimization, and decentralised application architecture.",
      issueDate: new Date("2024-08-15"),
      certificateType: "Course Completion",
      ipfsCid: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      status: "VALID",
      txHash: "0x89fa9b736b69b827e283812837bc901a88df67a57c5bf7e3110294bc1763ef29",
      blockNumber: 1845210,
    },
    {
      certId: "SKP-2024-41920",
      recipientName: "Alex Thorne",
      recipientEmail: "student@skillproof.io",
      recipientAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      institutionName: "Stanford Decentralized Technology Center",
      courseOrSkill: "Zero-Knowledge Cryptography & zk-SNARKs",
      projectTitle: "Private Identity Proof System",
      description: "Successfully implemented Circom circuits and Groth16 zk-SNARK verification for anonymous credentials.",
      issueDate: new Date("2024-10-02"),
      certificateType: "Skill Badge",
      ipfsCid: "bafybeihkoviema7g3gxyt6la7vd5ho32znq2ioomuv2jdg5y7yzaomuv2j",
      status: "VALID",
      txHash: "0x3a4b9c1d2e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b",
      blockNumber: 1845295,
    },
    {
      certId: "SKP-2024-11002",
      recipientName: "Jonathan Drake",
      recipientEmail: "j.drake@example.com",
      recipientAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      institutionName: "MetaCode Institute of Blockchain & AI",
      courseOrSkill: "Smart Contract Security Auditing",
      projectTitle: "Reentrancy & Flash Loan Defense Review",
      description: "Revoked due to submission of plagiarized vulnerability analysis report during peer audit review.",
      issueDate: new Date("2024-03-10"),
      certificateType: "Course Completion",
      ipfsCid: "bafybeif3uoz7k7g3gxyt6la7vd5ho32znq2ioomuv2jdg5y7yzaomuv2k",
      status: "REVOKED",
      revocationReason: "Disciplinary action: Plagiarized audit findings detected in peer submission.",
      revokedAt: new Date("2024-04-01"),
      revokedByAddress: issuerUser.walletAddress,
      txHash: "0x51c7b8e9a0f123456789abcdef0123456789abcdef0123456789abcdef012345",
      blockNumber: 1845340,
    },
  ];

  const simulatedState = {
    certificates: {},
    hashes: {},
    authorizedIssuers: {
      [adminUser.walletAddress.toLowerCase()]: true,
      [issuerUser.walletAddress.toLowerCase()]: true,
    },
    latestBlock: 1845350,
  };

  for (const item of sampleCerts) {
    // Generate deterministic canonical hash
    const canonical = [
      item.certId.trim().toUpperCase(),
      item.recipientName.trim().toLowerCase(),
      (item.recipientEmail || "").trim().toLowerCase(),
      item.institutionName.trim(),
      item.courseOrSkill.trim(),
      (item.projectTitle || "").trim(),
      item.issueDate.toISOString().split("T")[0],
      item.certificateType.trim(),
      "",
    ].join("|");

    const certHash = "0x" + crypto.createHash("sha256").update(canonical).digest("hex");
    const qrData = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?id=${item.certId}`;

    const cert = await prisma.certificate.create({
      data: {
        certId: item.certId,
        certHash: certHash,
        recipientName: item.recipientName,
        recipientEmail: item.recipientEmail,
        recipientAddress: item.recipientAddress,
        institutionName: item.institutionName,
        courseOrSkill: item.courseOrSkill,
        projectTitle: item.projectTitle,
        description: item.description,
        issueDate: item.issueDate,
        certificateType: item.certificateType,
        ipfsCid: item.ipfsCid,
        qrCodeData: qrData,
        blockchainTxHash: item.txHash,
        blockNumber: item.blockNumber,
        status: item.status,
        revocationReason: item.revocationReason,
        revokedAt: item.revokedAt,
        revokedByAddress: item.revokedByAddress,
        issuerId: issuerProfile.id,
        recipientUserId: item.recipientEmail === studentUser.email ? studentUser.id : null,
      },
    });

    // Record in simulated state
    simulatedState.certificates[item.certId] = {
      certId: item.certId,
      certHash: certHash,
      issuerAddress: issuerUser.walletAddress,
      recipientName: item.recipientName,
      courseOrSkill: item.courseOrSkill,
      issueDate: Math.floor(item.issueDate.getTime() / 1000),
      isRevoked: item.status === "REVOKED",
      revokedAt: item.revokedAt ? Math.floor(item.revokedAt.getTime() / 1000) : 0,
      revocationReason: item.revocationReason || "",
      blockNumber: item.blockNumber,
      txHash: item.txHash,
    };
    simulatedState.hashes[certHash.toLowerCase()] = item.certId;

    // Record BlockchainTransaction
    await prisma.blockchainTransaction.create({
      data: {
        txHash: item.txHash,
        blockNumber: item.blockNumber,
        fromAddress: issuerUser.walletAddress,
        toAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x71C8F7A853245B11C194f48A141d6D33a0E821Db",
        operation: "ISSUE_CERTIFICATE",
        certId: item.certId,
        status: "CONFIRMED",
        gasUsed: "142,580",
        timestamp: item.issueDate,
      },
    });

    if (item.status === "REVOKED") {
      await prisma.certificateRevocation.create({
        data: {
          certificateId: cert.id,
          reason: item.revocationReason,
          revokedBy: item.revokedByAddress,
          txHash: "0xrevoked99b827e283812837bc901a88df67a57c5bf7e3110294bc1763ef29",
        },
      });
    }
  }

  // Save blockchain state file
  const statePath = path.join(__dirname, "blockchain-state.json");
  fs.writeFileSync(statePath, JSON.stringify(simulatedState, null, 2), "utf-8");

  // Create initial audit log
  await prisma.auditLog.create({
    data: {
      action: "SYSTEM_INITIALIZED",
      performedBy: adminUser.email,
      details: "SkillProof platform initialized with Genesis records and smart contract registry.",
    },
  });

  console.log("Seeding complete! 3 sample certificates created with cryptographic proofs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
