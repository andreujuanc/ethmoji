// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/// @custom:security-contact me@something.com
contract KaoDao is Initializable, 
    GovernorUpgradeable,  GovernorCountingSimpleUpgradeable, GovernorVotesUpgradeable, GovernorVotesQuorumFractionUpgradeable,
    UUPSUpgradeable, AccessControlUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    bytes32 public constant CONTRACT_UPGRADER = keccak256("CONTRACT_UPGRADER");
    
    address private _kaoMoji;

    function initialize(ERC20VotesUpgradeable _token) public initializer 
    {
         __Governor_init("KaoDao");
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(25);
        __UUPSUpgradeable_init();
        _setupRole(ADDRESS_UPDATER, msg.sender);
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
        _kaoMoji = kaoMoji;
    }


    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(GovernorUpgradeable)
        returns (uint256)
    {
        require(targets.length == 1, "targets.length != 1");
        require(_kaoMoji != address(0), "kaoMoji == 0");
        require(targets[0] == _kaoMoji, "target != kaomoji");

        return super.propose(targets, values, calldatas, description);
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
        onlyRole(CONTRACT_UPGRADER)
        override
    {}

}