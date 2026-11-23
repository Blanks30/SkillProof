// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SkillProofRegistry
 * @dev Cryptographic certificate registry providing immutable verification for skill & project certificates.
 * Records unique certificate IDs, SHA-256 hashes, issuer identities, and revocation statuses.
 */
contract SkillProofRegistry is Ownable {
    
    struct Certificate {
        string certId;             // Unique human-readable Certificate ID (e.g. SKP-2024-XXXXX)
        bytes32 certHash;          // Cryptographic SHA-256 hash of certificate payload & metadata
        address issuer;            // Authorized issuer wallet address
        string recipientName;      // Name of the certificate recipient
        string courseOrSkill;      // Title of the credential, course, or project
        uint256 issueDate;         // UNIX timestamp of issue date
        bool isRevoked;            // True if certificate was officially revoked
        uint256 revokedAt;         // Timestamp when revocation occurred
        string revocationReason;   // Documented rationale for revocation
        bool exists;               // Existence flag
    }

    // Storage mappings
    mapping(string => Certificate) private certificates;
    mapping(bytes32 => string) private hashToCertId;
    mapping(address => bool) public authorizedIssuers;

    // Track total certificate counts
    uint256 public totalCertificatesIssued;
    uint256 public totalCertificatesRevoked;

    // Events
    event CertificateIssued(
        string indexed certId,
        bytes32 indexed certHash,
        address indexed issuer,
        string recipientName,
        string courseOrSkill,
        uint256 issueDate
    );

    event CertificateRevoked(
        string indexed certId,
        address indexed revoker,
        string reason,
        uint256 timestamp
    );

    event IssuerAuthorized(address indexed issuer);
    event IssuerDeauthorized(address indexed issuer);

    // Modifiers
    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner(),
            "SkillProof: Caller is not an authorized issuer or admin"
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        // Owner is automatically authorized
        authorizedIssuers[msg.sender] = true;
        emit IssuerAuthorized(msg.sender);
    }

    /**
     * @notice Authorize an institution/organization address to issue certificates
     * @param issuer The address to authorize
     */
    function addIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "SkillProof: Invalid issuer address");
        require(!authorizedIssuers[issuer], "SkillProof: Issuer already authorized");
        
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    /**
     * @notice Deauthorize an issuer
     * @param issuer The address to revoke issuance rights from
     */
    function removeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "SkillProof: Issuer not authorized");
        require(issuer != owner(), "SkillProof: Cannot remove contract owner");
        
        authorizedIssuers[issuer] = false;
        emit IssuerDeauthorized(issuer);
    }

    /**
     * @notice Checks whether an address is an authorized issuer
     */
    function isIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }

    /**
     * @notice Register and issue a new certificate on-chain
     * @param certId Unique certificate identifier
     * @param certHash SHA-256 hash of the certificate document and verified metadata
     * @param recipientName Recipient full name
     * @param courseOrSkill Skill or project credential title
     * @param issueDate Issuance timestamp
     */
    function issueCertificate(
        string calldata certId,
        bytes32 certHash,
        string calldata recipientName,
        string calldata courseOrSkill,
        uint256 issueDate
    ) external onlyAuthorizedIssuer {
        require(bytes(certId).length > 0, "SkillProof: Certificate ID cannot be empty");
        require(certHash != bytes32(0), "SkillProof: Invalid certificate hash");
        require(bytes(recipientName).length > 0, "SkillProof: Recipient name cannot be empty");
        require(bytes(courseOrSkill).length > 0, "SkillProof: Course or skill cannot be empty");
        require(!certificates[certId].exists, "SkillProof: Certificate ID already registered");
        require(bytes(hashToCertId[certHash]).length == 0, "SkillProof: Certificate hash already registered");

        certificates[certId] = Certificate({
            certId: certId,
            certHash: certHash,
            issuer: msg.sender,
            recipientName: recipientName,
            courseOrSkill: courseOrSkill,
            issueDate: issueDate > 0 ? issueDate : block.timestamp,
            isRevoked: false,
            revokedAt: 0,
            revocationReason: "",
            exists: true
        });

        hashToCertId[certHash] = certId;
        totalCertificatesIssued += 1;

        emit CertificateIssued(
            certId,
            certHash,
            msg.sender,
            recipientName,
            courseOrSkill,
            issueDate > 0 ? issueDate : block.timestamp
        );
    }

    /**
     * @notice Revoke an issued certificate
     * @param certId Unique certificate identifier
     * @param reason Documented reason for revocation
     */
    function revokeCertificate(string calldata certId, string calldata reason) external {
        require(certificates[certId].exists, "SkillProof: Certificate does not exist");
        require(!certificates[certId].isRevoked, "SkillProof: Certificate already revoked");
        
        // Only original issuer or contract owner can revoke
        require(
            msg.sender == certificates[certId].issuer || msg.sender == owner(),
            "SkillProof: Unauthorized - only original issuer or admin can revoke"
        );
        require(bytes(reason).length > 0, "SkillProof: Revocation reason required");

        certificates[certId].isRevoked = true;
        certificates[certId].revokedAt = block.timestamp;
        certificates[certId].revocationReason = reason;

        totalCertificatesRevoked += 1;

        emit CertificateRevoked(certId, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Verify a certificate by its unique Certificate ID
     * @param certId The certificate ID to check
     */
    function verifyCertificate(string calldata certId)
        external
        view
        returns (
            bool isValid,
            bool isRevoked,
            bytes32 certHash,
            address issuer,
            string memory recipientName,
            string memory courseOrSkill,
            uint256 issueDate,
            uint256 revokedAt,
            string memory revocationReason
        )
    {
        Certificate memory cert = certificates[certId];
        if (!cert.exists) {
            return (false, false, bytes32(0), address(0), "", "", 0, 0, "");
        }

        return (
            !cert.isRevoked,
            cert.isRevoked,
            cert.certHash,
            cert.issuer,
            cert.recipientName,
            cert.courseOrSkill,
            cert.issueDate,
            cert.revokedAt,
            cert.revocationReason
        );
    }

    /**
     * @notice Verify a certificate by its cryptographic SHA-256 hash
     * @param certHash The SHA-256 hash to look up
     */
    function verifyCertificateByHash(bytes32 certHash)
        external
        view
        returns (
            bool isValid,
            bool isRevoked,
            string memory certId,
            address issuer,
            string memory recipientName,
            string memory courseOrSkill,
            uint256 issueDate
        )
    {
        string memory id = hashToCertId[certHash];
        if (bytes(id).length == 0) {
            return (false, false, "", address(0), "", "", 0);
        }

        Certificate memory cert = certificates[id];
        return (
            !cert.isRevoked,
            cert.isRevoked,
            cert.certId,
            cert.issuer,
            cert.recipientName,
            cert.courseOrSkill,
            cert.issueDate
        );
    }

    /**
     * @notice Helper to check if a certificate exists
     */
    function certificateExists(string calldata certId) external view returns (bool) {
        return certificates[certId].exists;
    }
}
