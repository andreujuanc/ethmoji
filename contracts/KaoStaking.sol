// SPDX-License-Identifier: MIT
// As per https://github.com/Synthetixio/synthetix/blob/develop/LICENSE
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

struct Balance {
    /// units of staking token that has been deposited and consequently wrapped
    uint256 raw;
    /// (block.timestamp - weightedTimestamp) represents the seconds a user has had their full raw balance wrapped.
    /// If they deposit or withdraw, the weightedTimestamp is dragged towards block.timestamp proportionately
    uint256 weightedTimestamp;
}

// https://docs.synthetix.io/contracts/source/contracts/stakingrewards
contract KaoStaking is  Initializable, ReentrancyGuardUpgradeable, UUPSUpgradeable, AccessControlUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /* ========== STATE VARIABLES ========== */
    IERC20Upgradeable public stakingToken;

    uint256 private _totalSupply;
    mapping(address => Balance) private _balances;


    /* ========== EVENTS ========== */

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Recovered(address token, uint256 amount);

    /* ========== CONSTRUCTOR ========== */

    function initialize(
        address _stakingToken
    ) public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(UPGRADER_ROLE, msg.sender);

        stakingToken = IERC20Upgradeable(_stakingToken);
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account].raw;
    }

    function getRewardsMultiplier(address account) external view returns (uint256) {
        Balance memory _balance = _balances[account];
        return _timeMultiplier(_balance.weightedTimestamp);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */
    function stake(uint256 amount) external nonReentrant {
        _stakeRaw(msg.sender, amount);
    }


    function withdraw(uint256 amount) external nonReentrant  {
        _burnRaw(msg.sender, amount);
    }



    function _stakeRaw(address account, uint256 amount) internal {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply.add(amount);

        Balance memory oldBalance = _balances[account];
        
        _balances[account].raw = oldBalance.raw + amount;

        // Based out of, but simplified https://github.com/mstable/mStable-contracts/blob/master/contracts/governance/staking/GamifiedToken.sol

        // 3. Set weighted timestamp
        //  i) For new _account, set up weighted timestamp
        if (oldBalance.weightedTimestamp == 0) {
            _balances[account].weightedTimestamp = block.timestamp;
        }
        else {
            //  ii) For previous minters, recalculate time held
            //      Calc new weighted timestamp
            uint256 oldWeightedSecondsHeld = (block.timestamp - oldBalance.weightedTimestamp) *  oldBalance.raw;
            uint256 newSecondsHeld = oldWeightedSecondsHeld / (oldBalance.raw + (amount / 2));
            uint256 newWeightedTs = block.timestamp - newSecondsHeld;
            _balances[account].weightedTimestamp = newWeightedTs;
        }

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }


    function _burnRaw(
        address account,
        uint256 amount
    ) internal {
        require(account != address(0), "ERC20: burn from zero address");
        // 1. Get and update current balance
        Balance memory oldBalance = _balances[account];

        // 1.2. Update
        require(oldBalance.raw >= amount, "ERC20: burn amount > balance");

        _totalSupply = _totalSupply.sub(amount);

        // 3. Set back scaled time
        // e.g. stake 10 for 100 seconds, withdraw 5.
        //      secondsHeld = (100 - 0) * (10 - 0.625) = 937.5
        uint256 secondsHeld = (block.timestamp - oldBalance.weightedTimestamp) * (oldBalance.raw - (amount / 8));
        //      newWeightedTs = 937.5 / 100 = 93.75
        uint256 newSecondsHeld = secondsHeld / oldBalance.raw ;
        uint256 newWeightedTs = block.timestamp - newSecondsHeld;
        _balances[account].weightedTimestamp = newWeightedTs;

        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }


    // Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyRole(OWNER_ROLE) {
        require(tokenAddress != address(stakingToken), "Cannot withdraw the staking token");
        IERC20Upgradeable(tokenAddress).safeTransfer(msg.sender, tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    } 

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    /**
     * @dev Gets the multiplier awarded for a given weightedTimestamp
     * @param _ts WeightedTimestamp of a user
     * @return timeMultiplier Ranging from 20 (0.2x) to 60 (0.6x)
     */
    function _timeMultiplier(uint256 _ts) internal view returns (uint256 timeMultiplier) {
        // If the user has no ts yet, they are not in the system
        if (_ts == 0) return 0;

        uint256 hodlLength = block.timestamp - _ts;
        if(hodlLength < 1 days){
            return 5;
        } else if (hodlLength <= 1 weeks) {
            return 5 + (hodlLength * 15 / 1 weeks);
        } else if (hodlLength <= 2 weeks) {
            return 20 + (hodlLength * 10 / 2 weeks);
        } else if (hodlLength <= 5 weeks) {
            return 30 + (hodlLength * 10 / 5 weeks);
        } else if (hodlLength <= 12 weeks) {
            return 40 + (hodlLength * 10 / 12 weeks);
        } else if (hodlLength <= 30 weeks) {
            return 50 + (hodlLength * 10 / 30 weeks);
        } else {
            return 66; // 2/3th fee for long staking
        }
    }
}