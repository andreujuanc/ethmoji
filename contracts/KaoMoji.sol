// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
// import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


//import "hardhat/console.sol";

import "./zora/interfaces/IAuctionHouse.sol";

contract KaoMoji is Initializable, ERC721Upgradeable, IERC721ReceiverUpgradeable, UUPSUpgradeable, AccessControlUpgradeable  {
    /// @custom:oz-upgrades-unsafe-allow constructor
    //constructor() initializer {}
    
    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");


    mapping(uint256 => bytes) private _tokenData;
    uint256 private _totalSupply;
    IAuctionHouse private _auctionHouse;
    address private _kaoToken;    


    function initialize() initializer external {
        __ERC721_init("KaoMoji", "KMJ");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(ADDRESS_UPDATER, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://somecoolstuffsootherpeoplecangetprerenders.io/token/{id}";
    }

    function setAuctionAddress(address auctionAddress) external onlyRole(ADDRESS_UPDATER) {
        _auctionHouse = IAuctionHouse(auctionAddress);
    }

    function setKaoToken(address kaoToken) external onlyRole(ADDRESS_UPDATER) {
        _kaoToken = kaoToken;
    }

    function mint(bytes memory data)
        external
        onlyRole(MINTER_ROLE)
    {

        uint256 id = _totalSupply;
        _safeMint(address(this), id, data);
        _tokenData[id] = data;

        _approve(address(_auctionHouse), id);


        uint8 decimals = IERC20MetadataUpgradeable(_kaoToken).decimals();
        _auctionHouse.createAuction(
            id, 
            address(this), // We have the balance
            1 minutes, //duration 
            1 * 10 ** decimals,
            payable(address(this)), // curator
            0, // curatorFeePercentages 
            _kaoToken
        );

        _approve(address(0), id);
        _totalSupply++;
        
    }
    
    // The following functions are overrides required by Solidity.
    // function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    //     return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
    // }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getDataOf(uint256 id)
        external
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

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

}