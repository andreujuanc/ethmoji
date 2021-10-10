// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KaoDao is Governor, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, AccessControl {
    bytes32 public constant ADDRESS_UPDATER = keccak256("ADDRESS_UPDATER");
    address private _kaoMoji;

    constructor(ERC20Votes _token)
        Governor("KaoDao")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(5)
    {
        _setupRole(ADDRESS_UPDATER, msg.sender);
    }

    function votingDelay() public pure override returns (uint256) {
        return 273; // 1 hour
    }

    function votingPeriod() public pure override returns (uint256) {
        return 80; // TODO: back to 1 week before deploy to mainnet
            //45818; // 1 week
    }

    function setKaoMojiAddress(address kaoMoji) public onlyRole(ADDRESS_UPDATER) {
        _kaoMoji = kaoMoji;
    }

    // The following functions are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor)
        returns (uint256)
    {
        require(targets.length == 1, "One proposal per transaction only");
        require(_kaoMoji != address(0), "kaoMoji not set");
        require(targets[0] == _kaoMoji, "target can only be the kaoMoji contract");

        return super.propose(targets, values, calldatas, description);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view override(Governor, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}