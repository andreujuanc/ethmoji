// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
// import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

import "./zora/interfaces/IAuctionHouse.sol";

contract KaoMoji is ERC721, AccessControl, IERC721Receiver {
    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => bytes) private _tokenData;
    uint256 private _totalSupply;
    IAuctionHouse private _auctionHouse;
    address private _kaoToken; 

    constructor() ERC721("KaoMoji", "KMJ") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(ADDRESS_UPDATER, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://somecoolstuffsootherpeoplecangetprerenders.io/token/{id}";
    }

    function setAuctionAddress(address auctionAddress) public onlyRole(ADDRESS_UPDATER) {
        _auctionHouse = IAuctionHouse(auctionAddress);
    }

    function setKaoToken(address kaoToken) public onlyRole(ADDRESS_UPDATER) {
        _kaoToken = kaoToken;
    }

    function mint(bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _totalSupply++;

        uint256 id = _totalSupply;
        _safeMint(
            //msg.sender,
            address(this),
            //address(_auctionHouse),
             id, data);
        _tokenData[id] = data;

        _approve(address(_auctionHouse), id);


        uint8 decimals = IERC20Metadata(_kaoToken).decimals();
        _auctionHouse.createAuction(
            id, 
            address(this), // We have the balance
            10 minutes, //duration 
            1 * 10**decimals,
            payable(address(this)), // curator
            0, // curatorFeePercentages 
            _kaoToken
        );

        _approve(address(0), id);
        
    }
    
    // The following functions are overrides required by Solidity.
    // function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    //     return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    // }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getDataOf(uint256 id)
        public
        view
        returns (bytes memory)
    {
        return _tokenData[id];
    }    


    /**
     * @dev See {IERC721Receiver-onERC721Received}.
     *
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

}