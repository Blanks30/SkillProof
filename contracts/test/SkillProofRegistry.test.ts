import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("SkillProofRegistry Smart Contract", function () {
  let registry: any;
  let owner: any;
  let issuer: any;
  let unauthorizedUser: any;
  let student: any;

  const sampleCertId = "SKP-2024-00101";
  const sampleCertHash = ethers.keccak256(ethers.toUtf8Bytes("skillproof-hash-payload-sample-1"));
  const sampleRecipient = "Alice Johnson";
  const sampleCourse = "Advanced Smart Contract Security";
  const sampleDate = Math.floor(Date.now() / 1000);

  beforeEach(async function () {
    [owner, issuer, unauthorizedUser, student] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SkillProofRegistry");
    registry = await Factory.deploy();
    await registry.waitForDeployment();
  });

  describe("Deployment & Access Control", function () {
    it("should set deployer as owner and default authorized issuer", async function () {
      expect(await registry.owner()).to.equal(owner.address);
      expect(await registry.isIssuer(owner.address)).to.equal(true);
    });

    it("should allow owner to authorize a new issuer", async function () {
      await expect(registry.connect(owner).addIssuer(issuer.address))
        .to.emit(registry, "IssuerAuthorized")
        .withArgs(issuer.address);
      expect(await registry.isIssuer(issuer.address)).to.equal(true);
    });

    it("should prevent non-owner from authorizing an issuer", async function () {
      await expect(
        registry.connect(unauthorizedUser).addIssuer(student.address)
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to revoke issuer authorization", async function () {
      await registry.connect(owner).addIssuer(issuer.address);
      await expect(registry.connect(owner).removeIssuer(issuer.address))
        .to.emit(registry, "IssuerDeauthorized")
        .withArgs(issuer.address);
      expect(await registry.isIssuer(issuer.address)).to.equal(false);
    });
  });

  describe("Certificate Issuance", function () {
    beforeEach(async function () {
      await registry.connect(owner).addIssuer(issuer.address);
    });

    it("should issue a certificate successfully by an authorized issuer", async function () {
      await expect(
        registry
          .connect(issuer)
          .issueCertificate(sampleCertId, sampleCertHash, sampleRecipient, sampleCourse, sampleDate)
      )
        .to.emit(registry, "CertificateIssued")
        .withArgs(sampleCertId, sampleCertHash, issuer.address, sampleRecipient, sampleCourse, sampleDate);

      expect(await registry.totalCertificatesIssued()).to.equal(1);
      expect(await registry.certificateExists(sampleCertId)).to.equal(true);
    });

    it("should reject issuance by unauthorized user", async function () {
      await expect(
        registry
          .connect(unauthorizedUser)
          .issueCertificate(sampleCertId, sampleCertHash, sampleRecipient, sampleCourse, sampleDate)
      ).to.be.revertedWith("SkillProof: Caller is not an authorized issuer or admin");
    });

    it("should prevent duplicate certificate ID registration", async function () {
      await registry
        .connect(issuer)
        .issueCertificate(sampleCertId, sampleCertHash, sampleRecipient, sampleCourse, sampleDate);

      const differentHash = ethers.keccak256(ethers.toUtf8Bytes("different-hash"));
      await expect(
        registry
          .connect(issuer)
          .issueCertificate(sampleCertId, differentHash, "Bob Smith", "Machine Learning", sampleDate)
      ).to.be.revertedWith("SkillProof: Certificate ID already registered");
    });

    it("should prevent duplicate certificate hash registration", async function () {
      await registry
        .connect(issuer)
        .issueCertificate(sampleCertId, sampleCertHash, sampleRecipient, sampleCourse, sampleDate);

      await expect(
        registry
          .connect(issuer)
          .issueCertificate("SKP-2024-00102", sampleCertHash, "Bob Smith", "Machine Learning", sampleDate)
      ).to.be.revertedWith("SkillProof: Certificate hash already registered");
    });

    it("should validate required non-empty fields", async function () {
      await expect(
        registry.connect(issuer).issueCertificate("", sampleCertHash, sampleRecipient, sampleCourse, sampleDate)
      ).to.be.revertedWith("SkillProof: Certificate ID cannot be empty");

      await expect(
        registry.connect(issuer).issueCertificate(sampleCertId, ethers.ZeroHash, sampleRecipient, sampleCourse, sampleDate)
      ).to.be.revertedWith("SkillProof: Invalid certificate hash");
    });
  });

  describe("Certificate Verification", function () {
    beforeEach(async function () {
      await registry.connect(owner).addIssuer(issuer.address);
      await registry
        .connect(issuer)
        .issueCertificate(sampleCertId, sampleCertHash, sampleRecipient, sampleCourse, sampleDate);
    });

    it("should correctly verify a valid certificate by ID", async function () {
      const res = await registry.verifyCertificate(sampleCertId);
      expect(res.isValid).to.equal(true);
      expect(res.isRevoked).to.equal(false);
      expect(res.certHash).to.equal(sampleCertHash);
      expect(res.issuer).to.equal(issuer.address);
      expect(res.recipientName).to.equal(sampleRecipient);
      expect(res.courseOrSkill).to.equal(sampleCourse);
      expect(res.issueDate).to.equal(sampleDate);
    });

    it("should correctly verify a certificate by cryptographic hash", async function () {
      const res = await registry.verifyCertificateByHash(sampleCertHash);
      expect(res.isValid).to.equal(true);
      expect(res.isRevoked).to.equal(false);
      expect(res.certId).to.equal(sampleCertId);
      expect(res.issuer).to.equal(issuer.address);
      expect(res.recipientName).to.equal(sampleRecipient);
    });

    it("should return false for an unrecorded certificate ID", async function () {
      const res = await registry.verifyCertificate("NON-EXISTENT-ID");
      expect(res.isValid).to.equal(false);
      expect(res.isRevoked).to.equal(false);
      expect(res.certHash).to.equal(ethers.ZeroHash);
    });

    it("should return false for an unrecorded hash", async function () {
      const randomHash = ethers.keccak256(ethers.toUtf8Bytes("unknown-doc"));
      const res = await registry.verifyCertificateByHash(randomHash);
      expect(res.isValid).to.equal(false);
      expect(res.isRevoked).to.equal(false);
      expect(res.certId).to.equal("");
    });
  });

  describe("Certificate Revocation", function () {
    beforeEach(async function () {
      await registry.connect(owner).addIssuer(issuer.address);
      await registry
        .connect(issuer)
        .issueCertificate(sampleCertId, sampleCertHash, sampleRecipient, sampleCourse, sampleDate);
    });

    it("should allow original issuer to revoke certificate", async function () {
      await expect(registry.connect(issuer).revokeCertificate(sampleCertId, "Course requirements not met"))
        .to.emit(registry, "CertificateRevoked");

      expect(await registry.totalCertificatesRevoked()).to.equal(1);

      const verification = await registry.verifyCertificate(sampleCertId);
      expect(verification.isValid).to.equal(false);
      expect(verification.isRevoked).to.equal(true);
      expect(verification.revocationReason).to.equal("Course requirements not met");
    });

    it("should allow contract owner (admin) to revoke certificate", async function () {
      await expect(registry.connect(owner).revokeCertificate(sampleCertId, "Administrative audit failure"))
        .to.emit(registry, "CertificateRevoked");

      const verification = await registry.verifyCertificate(sampleCertId);
      expect(verification.isValid).to.equal(false);
      expect(verification.isRevoked).to.equal(true);
    });

    it("should reject revocation by an unauthorized third party", async function () {
      await expect(
        registry.connect(unauthorizedUser).revokeCertificate(sampleCertId, "Malicious attempt")
      ).to.be.revertedWith("SkillProof: Unauthorized - only original issuer or admin can revoke");
    });

    it("should prevent revoking an already revoked certificate", async function () {
      await registry.connect(issuer).revokeCertificate(sampleCertId, "First revocation");
      await expect(
        registry.connect(issuer).revokeCertificate(sampleCertId, "Second attempt")
      ).to.be.revertedWith("SkillProof: Certificate already revoked");
    });

    it("revoked certificate verified by hash should report revoked status", async function () {
      await registry.connect(issuer).revokeCertificate(sampleCertId, "Revoked for disciplinary reasons");
      const res = await registry.verifyCertificateByHash(sampleCertHash);
      expect(res.isValid).to.equal(false);
      expect(res.isRevoked).to.equal(true);
    });
  });
});
