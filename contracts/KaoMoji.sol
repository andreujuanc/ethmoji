// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "hardhat/console.sol";

import "./zora/interfaces/IAuctionHouse.sol";

contract KaoMoji is ERC1155Supply, AccessControl {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => bytes) private _tokenData;
    uint256 private _totalSupply;
    IAuctionHouse private _auctionHouse;
    address private _kaoToken; 

    constructor() ERC1155("https://kao.finance/token/{id}") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(ADDRESS_UPDATER, msg.sender);
    }


    function setAuctionAddress(address auctionAddress) public onlyRole(ADDRESS_UPDATER) {
        _auctionHouse = IAuctionHouse(auctionAddress);
    }

    function setKaoToken(address kaoToken) public onlyRole(ADDRESS_UPDATER) {
        _kaoToken = kaoToken;
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function mint(bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        uint256 id = _totalSupply;
        _mint(address(this), id, 1, data);
        _tokenData[id] = data;

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

        _totalSupply++;
    }
    
    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
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

}