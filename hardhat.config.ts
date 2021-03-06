import * as dotenv from "dotenv";
dotenv.config();

import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@typechain/hardhat'
import '@openzeppelin/hardhat-upgrades'
import "@nomiclabs/hardhat-waffle";

import './tasks/faucet'
import './tasks/misc'

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
      // mining: { // just for testing
      //   auto: false,
      //   interval: [500, 1000]
      // }
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 40000
  }
};
