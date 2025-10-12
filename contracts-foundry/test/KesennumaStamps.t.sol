// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/KesennumaStamps.sol";

contract KesennumaStampsTest is Test {
    KesennumaStamps public stamps;
    address public owner;
    address public user1;
    address public user2;

    event StampClaimed(address indexed user, uint256 indexed tokenId);

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        stamps = new KesennumaStamps("https://metadata.kesennuma.com/");
    }

    // ============================================
    // Basic Functionality Tests
    // ============================================

    function testClaim() public {
        uint256 tokenId = 0;

        stamps.claim(user1, tokenId);

        assertEq(stamps.balanceOf(user1, tokenId), 1);
        assertTrue(stamps.hasClaimed(user1, tokenId));
        assertEq(stamps.totalSupply(tokenId), 1);
    }

    function testClaimEmitsEvent() public {
        uint256 tokenId = 0;

        vm.expectEmit(true, true, false, false);
        emit StampClaimed(user1, tokenId);

        stamps.claim(user1, tokenId);
    }

    function testClaimMultipleUsers() public {
        uint256 tokenId = 0;

        stamps.claim(user1, tokenId);
        stamps.claim(user2, tokenId);

        assertEq(stamps.balanceOf(user1, tokenId), 1);
        assertEq(stamps.balanceOf(user2, tokenId), 1);
        assertEq(stamps.totalSupply(tokenId), 2);
    }

    function testClaimMultipleTokens() public {
        stamps.claim(user1, 0);
        stamps.claim(user1, 1);
        stamps.claim(user1, 2);

        assertEq(stamps.balanceOf(user1, 0), 1);
        assertEq(stamps.balanceOf(user1, 1), 1);
        assertEq(stamps.balanceOf(user1, 2), 1);
    }

    function testClaimBatch() public {
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 0;
        tokenIds[1] = 1;
        tokenIds[2] = 2;

        stamps.claimBatch(user1, tokenIds);

        assertEq(stamps.balanceOf(user1, 0), 1);
        assertEq(stamps.balanceOf(user1, 1), 1);
        assertEq(stamps.balanceOf(user1, 2), 1);
        assertEq(stamps.totalSupply(0), 1);
        assertEq(stamps.totalSupply(1), 1);
        assertEq(stamps.totalSupply(2), 1);
    }

    // ============================================
    // Access Control Tests
    // ============================================

    function testClaimOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        stamps.claim(user1, 0);
    }

    function testClaimBatchOnlyOwner() public {
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 0;

        vm.prank(user1);
        vm.expectRevert();
        stamps.claimBatch(user1, tokenIds);
    }

    // ============================================
    // Duplicate Prevention Tests
    // ============================================

    function testCannotClaimTwice() public {
        stamps.claim(user1, 0);

        vm.expectRevert("Already claimed this stamp");
        stamps.claim(user1, 0);
    }

    function testCannotClaimBatchWithDuplicate() public {
        stamps.claim(user1, 0);

        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 0;
        tokenIds[1] = 1;

        vm.expectRevert("Already claimed one of these stamps");
        stamps.claimBatch(user1, tokenIds);
    }

    function testCannotClaimToZeroAddress() public {
        vm.expectRevert("Cannot mint to zero address");
        stamps.claim(address(0), 0);
    }

    // ============================================
    // Soulbound Tests (Non-Transferable)
    // ============================================

    function testCannotTransfer() public {
        stamps.claim(user1, 0);

        vm.prank(user1);
        vm.expectRevert("Soulbound: Transfers are disabled");
        stamps.safeTransferFrom(user1, user2, 0, 1, "");
    }

    function testCannotBatchTransfer() public {
        stamps.claim(user1, 0);
        stamps.claim(user1, 1);

        uint256[] memory ids = new uint256[](2);
        ids[0] = 0;
        ids[1] = 1;
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1;
        amounts[1] = 1;

        vm.prank(user1);
        vm.expectRevert("Soulbound: Transfers are disabled");
        stamps.safeBatchTransferFrom(user1, user2, ids, amounts, "");
    }

    function testCannotSetApprovalForAll() public {
        vm.prank(user1);
        vm.expectRevert("Soulbound: Approvals are disabled");
        stamps.setApprovalForAll(user2, true);
    }

    // ============================================
    // URI Tests
    // ============================================

    function testURI() public {
        string memory uri = stamps.uri(0);
        assertEq(uri, "https://metadata.kesennuma.com/0.json");
    }

    function testURIMultipleTokens() public {
        assertEq(stamps.uri(0), "https://metadata.kesennuma.com/0.json");
        assertEq(stamps.uri(1), "https://metadata.kesennuma.com/1.json");
        assertEq(stamps.uri(999), "https://metadata.kesennuma.com/999.json");
    }

    function testSetBaseURI() public {
        stamps.setBaseURI("https://new-url.com/");
        assertEq(stamps.uri(0), "https://new-url.com/0.json");
    }

    function testSetBaseURIOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        stamps.setBaseURI("https://new-url.com/");
    }

    function testBaseURI() public {
        assertEq(stamps.baseURI(), "https://metadata.kesennuma.com/");
    }

    // ============================================
    // Metadata Tests
    // ============================================

    function testName() public {
        assertEq(stamps.name(), "Kesennuma Digital Stamps");
    }

    function testSymbol() public {
        assertEq(stamps.symbol(), "KESSTAMP");
    }

    // ============================================
    // Edge Cases & Integration Tests
    // ============================================

    function testMultipleUsersClaim() public {
        // Simulate stamp rally with 3 users claiming different stamps
        stamps.claim(user1, 0);  // User 1: Port
        stamps.claim(user2, 0);  // User 2: Port
        stamps.claim(user1, 1);  // User 1: Market
        stamps.claim(user2, 2);  // User 2: Island

        assertEq(stamps.balanceOf(user1, 0), 1);
        assertEq(stamps.balanceOf(user1, 1), 1);
        assertEq(stamps.balanceOf(user1, 2), 0);

        assertEq(stamps.balanceOf(user2, 0), 1);
        assertEq(stamps.balanceOf(user2, 1), 0);
        assertEq(stamps.balanceOf(user2, 2), 1);

        assertEq(stamps.totalSupply(0), 2);
        assertEq(stamps.totalSupply(1), 1);
        assertEq(stamps.totalSupply(2), 1);
    }

    function testHasUserClaimed() public {
        assertFalse(stamps.hasUserClaimed(user1, 0));

        stamps.claim(user1, 0);

        assertTrue(stamps.hasUserClaimed(user1, 0));
        assertFalse(stamps.hasUserClaimed(user1, 1));
        assertFalse(stamps.hasUserClaimed(user2, 0));
    }

    function testSupportsInterface() public {
        // ERC1155
        assertTrue(stamps.supportsInterface(0xd9b67a26));
        // ERC1155MetadataURI
        assertTrue(stamps.supportsInterface(0x0e89341c));
    }
}
