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


import "hardhat/console.sol";

import "./zora/interfaces/IAuctionHouse.sol";

import "./KaoToken.sol";
import "./KaoStaking.sol";

contract KaoMoji is Initializable, ERC721Upgradeable, IERC721ReceiverUpgradeable, UUPSUpgradeable, AccessControlUpgradeable  {    
    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BALANCE_BURNER_ROLE = keccak256("BALANCE_BURNER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(uint256 => bytes) private _tokenData;
    uint256 private _totalSupply;
    IAuctionHouse private _auctionHouse;
    KaoToken private _kaoToken;    
    KaoStaking private _kaoStaking;


    function initialize() initializer public {
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

    function setAuctionAddress(address auctionAddress) public onlyRole(ADDRESS_UPDATER) {
        _auctionHouse = IAuctionHouse(auctionAddress);
    }

    function setKaoTokenAddress(address kaoToken) public onlyRole(ADDRESS_UPDATER) {
        _kaoToken = KaoToken(kaoToken);
    }

    function setKaoStakingAddress(address kaoStaking) public onlyRole(ADDRESS_UPDATER) {
        _kaoStaking = KaoStaking(kaoStaking);
    }

    function mint(bytes memory _data, address _proposer)
        public
        onlyRole(MINTER_ROLE)
    {

        uint256 id = _totalSupply;
        
        _totalSupply++;
        _safeMint(address(this), id, _data);

        _tokenData[id] = _data;

        _approve(address(_auctionHouse), id);

        uint8 decimals = _kaoToken.decimals();
        _auctionHouse.createAuction(
            id, 
            address(this), // token contract
            1 minutes, //duration 
            1 * 10 ** decimals,
            payable(_proposer), // proposer curator
            getProposerPercentageFor(_proposer), // curatorFeePercentage => proproser is the curator
            address(_kaoToken)
        );

        _approve(address(0), id);    
    }


    function getProposerPercentageFor(address user) public view returns (uint8){
        require(user != address(0), "Invalid Address");
        uint256 total = _kaoStaking.totalSupply();
        uint256 balance = _kaoStaking.balanceOf(user);
        uint256 multiplier = _kaoStaking.getRewardsMultiplier(user);
        
        if(total == 0) return 0;
        if(balance == 0) return 0;

        uint256 share = (balance * 100 / total) * multiplier;
        if(share > 100) return 100;

        return uint8(share);
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

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    /*
     * 100 - getProposerPercentageFor of the bid amount is sent to this contract to be burnt
     * TODO: Create KaoTreasury to deal with this, instead, problem is that the owner of the token is the treasury instead of (this) when minting
     */
    function burn() external onlyRole(BALANCE_BURNER_ROLE) {
        _kaoToken.burn(_kaoToken.balanceOf(address(this)));
    }

}