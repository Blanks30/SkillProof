# Contributing to SkillProof

Thank you for contributing to SkillProof! We welcome contributions to smart contracts, backend APIs, user interfaces, and documentation.

## Development Workflow

1. Fork the repository and create your feature branch from `main`:
   ```bash
   git checkout -b feature/my-feature-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the test suite passes:
   ```bash
   npx hardhat test
   npm run build
   ```
4. Commit your changes following Conventional Commits format:
   ```
   feat: add batch certificate issuance endpoint
   fix: prevent null pointer on revoked certificate lookup
   docs: update polygon amoy deployment instructions
   ```
5. Open a Pull Request detailing the changes, test coverage, and screenshots if UI changes are included.

## Code Standards

- **TypeScript:** Strict type checking without unused `any` where possible.
- **Solidity:** Use compiler version `^0.8.20`. Follow the Solidity Style Guide and NatSpec documentation for contract methods.
- **Tailwind CSS:** Keep UI styling consistent with the dark modern theme.
