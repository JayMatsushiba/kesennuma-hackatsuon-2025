// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title KesennumaStamps
 * @notice Soulbound NFT stamps for Kesennuma stamp rally
 * @dev ERC-1155 with transfers disabled (except minting)
 */
contract KesennumaStamps is ERC1155, Ownable {
    using Strings for uint256;

    // Contract metadata
    string public name = "Kesennuma Digital Stamps";
    string public symbol = "KESSTAMP";

    // Base URI for token metadata
    string private _baseTokenURI;

    // Track total supply per token ID
    mapping(uint256 => uint256) public totalSupply;

    // Track if an address has claimed a specific token
    mapping(address => mapping(uint256 => bool)) public hasClaimed;

    // Events
    event StampClaimed(address indexed user, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);

    /**
     * @dev Constructor
     * @param baseURI_ Base URI for token metadata
     */
    constructor(string memory baseURI_) ERC1155(baseURI_) Ownable(msg.sender) {
        _baseTokenURI = baseURI_;
    }

    /**
     * @notice Claim a stamp (mint one token)
     * @param to Address to mint to
     * @param tokenId Token ID to mint
     */
    function claim(address to, uint256 tokenId) external onlyOwner {
        require(!hasClaimed[to][tokenId], "Already claimed this stamp");
        require(to != address(0), "Cannot mint to zero address");

        hasClaimed[to][tokenId] = true;
        totalSupply[tokenId] += 1;

        _mint(to, tokenId, 1, "");

        emit StampClaimed(to, tokenId);
    }

    /**
     * @notice Batch claim multiple stamps
     * @param to Address to mint to
     * @param tokenIds Array of token IDs to mint
     */
    function claimBatch(address to, uint256[] memory tokenIds) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");

        uint256[] memory amounts = new uint256[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(!hasClaimed[to][tokenIds[i]], "Already claimed one of these stamps");
            hasClaimed[to][tokenIds[i]] = true;
            totalSupply[tokenIds[i]] += 1;
            amounts[i] = 1;

            emit StampClaimed(to, tokenIds[i]);
        }

        _mintBatch(to, tokenIds, amounts, "");
    }

    /**
     * @notice Check if user has claimed a specific stamp
     * @param user User address
     * @param tokenId Token ID to check
     */
    function hasUserClaimed(address user, uint256 tokenId) external view returns (bool) {
        return hasClaimed[user][tokenId];
    }

    /**
     * @notice Get URI for a specific token
     * @param tokenId Token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    /**
     * @notice Update base URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @notice Get base URI
     */
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    // ============================================
    // SOULBOUND: Disable all transfers
    // ============================================

    /**
     * @dev Override _update to make tokens soulbound (non-transferable)
     * @notice Allows minting (from == 0) but blocks all transfers
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        // Allow minting (from == address(0))
        // Block all transfers (from != address(0) && to != address(0))
        require(
            from == address(0) || to == address(0),
            "Soulbound: Transfers are disabled"
        );

        super._update(from, to, ids, values);
    }

    /**
     * @dev Disable setApprovalForAll (not needed for soulbound tokens)
     */
    function setApprovalForAll(address, bool) public virtual override {
        revert("Soulbound: Approvals are disabled");
    }

    /**
     * @notice Check if contract supports an interface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
