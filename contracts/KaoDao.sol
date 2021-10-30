// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./KaoMoji.sol";

/// @custom:security-contact me@something.com
contract KaoDao is Initializable, 
    GovernorUpgradeable,  GovernorCountingSimpleUpgradeable, GovernorVotesUpgradeable, GovernorVotesQuorumFractionUpgradeable,
    UUPSUpgradeable, AccessControlUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant ADMIN_PROPOSE_ROLE = keccak256("ADMIN_PROPOSE_ROLE");
    
    KaoMoji private _kaoMoji;

    function initialize(ERC20VotesUpgradeable _token) public initializer 
    {
         __Governor_init("KaoDao");
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(25);
        __UUPSUpgradeable_init();
        _setupRole(ADDRESS_UPDATER, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);
        _setupRole(ADMIN_PROPOSE_ROLE, msg.sender);
    }

    function votingDelay() public pure override returns (uint256) {
        return 20;
            //273; // 1 hour
    }

    function votingPeriod() public pure override returns (uint256) {
        return 80; // TODO: back to 1 week before deploy to mainnet
            //45818; // 1 week
    }

    function setKaoMojiAddress(address kaoMoji) public onlyRole(ADDRESS_UPDATER) {
        require(kaoMoji != address(0));
        _kaoMoji = KaoMoji(kaoMoji);
    }


    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        onlyRole(ADMIN_PROPOSE_ROLE)
        override(GovernorUpgradeable)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function proposeKao(bytes memory data, string memory description)
        public
        returns (uint256)
    {
        require(address(_kaoMoji) != address(0), "kaoMoji == 0");
        require(data.length > 0, "data == 0");
        // TODO: trim string to ensure uniqueness

     
        address[] memory targets = new address[](1);
        targets[0] = address(_kaoMoji);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory proposals = new bytes[](1);
        proposals[0] = abi.encodeWithSelector(_kaoMoji.mint.selector, data, msg.sender); // mint(data, proposer)

        return super.propose(targets, values , proposals, description);
    }


    // The following functions are overrides required by Solidity.
    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernorUpgradeable, GovernorVotesUpgradeable)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }


    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view override(GovernorUpgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

}