# Kesennuma Stamps Smart Contract

Custom ERC-1155 soulbound NFT contract for the Kesennuma stamp rally system.

## Quick Deploy to Base Mainnet

```bash
# 1. Set your private key
export PRIVATE_KEY=0xyour_private_key

# 2. Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url https://mainnet.base.org --broadcast

# 3. Copy the contract address to .env.local
```

## Features

- Soulbound (Non-Transferable)
- Duplicate Prevention
- Owner-Only Minting
- 23 Passing Tests

## Test

```bash
forge test -vv
```

Contract is ready to deploy!
