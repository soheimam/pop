# Running the ERC6551 Locally

The ERC6551 provides unique proxy capabilities to NFTs, allowing them to execute arbitrary calls. This guide will help you run the ERC6551 implementation on a local environment.

## Prerequisites

1. Ensure you have Hardhat installed and set up.
2. Familiarity with Ethers.js is beneficial for understanding interactions.

## Steps to Run

1. **Environment Setup**

Create a `.env` file at the root of your project directory and add the private key of the wallet you want to test with:

```
PRIVATE_KEY=your_private_key_here
```

2. **Start Hardhat Node:**

Start up a local Hardhat node. This creates a local Ethereum environment for deployment and testing.
`npx hardhat node`

This creates a local Ethereum environment for deployment and testing.

3. **Running the Script:**

- On the initial run, only the deployment logic should be executed. Open `ERC6551-Script.ts` and ensure only the deployment function is uncommented. You can identify sections with the `TODO` comments.
- Run the script by executing:
  ```
  npx hardhat run ./scripts/ERC6551-Script.ts --network localhost
  ```
  After the script's first execution, you should obtain all deployment addresses. Now, replace the constants in the script accordingly. Then, mint yourself an NFT, create the TBA, get the TBA address, and proceed with making the TBA execute proxy calls.
