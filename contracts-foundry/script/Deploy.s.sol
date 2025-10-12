// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/KesennumaStamps.sol";

contract DeployScript is Script {
    function run() external {
        // Get base URI from environment (or use default)
        string memory baseURI = vm.envOr(
            "BASE_URI",
            string("https://metadata.kesennuma.com/")
        );

        // Use the account provided via --account flag (or PRIVATE_KEY env var)
        vm.startBroadcast();

        // Deploy the contract
        KesennumaStamps stamps = new KesennumaStamps(baseURI);

        console.log("========================================");
        console.log("Kesennuma Stamps Contract Deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(stamps));
        console.log("Deployer (Owner):", msg.sender);
        console.log("Base URI:", baseURI);
        console.log("Network:", block.chainid);
        console.log("========================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Add contract address to .env.local:");
        console.log("   NEXT_PUBLIC_CONTRACT_ADDRESS=%s", address(stamps));
        console.log("");
        console.log("2. Verify on BaseScan:");
        console.log("   forge verify-contract %s KesennumaStamps --chain-id 8453", address(stamps));
        console.log("========================================");

        vm.stopBroadcast();
    }
}
