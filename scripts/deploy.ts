import { run, ethers, network } from "hardhat";
import { getAddresses } from "./utils/getAddresses";
import { isValidNetwork, Networks } from "./utils/networks";
import { saveFrontendFiles } from "./utils/saveFrontendFiles";

async function main() {
  await run("compile");
  const networkName = network.name
  if (!isValidNetwork(networkName)) throw new Error(`Network not supported: ${networkName}`);

  const addresses = getAddresses(networkName);
  const auctionHouseAddress = addresses[networkName].AuctionHouse
  if (!auctionHouseAddress) {
    throw new Error('Auction house must be deployed first')
  }

  const KaoToken = await ethers.getContractFactory("KaoToken");
  const kaoToken = await KaoToken.deploy();
  await kaoToken.deployed();

  const KaoMoji = await ethers.getContractFactory("KaoMoji");
  const kaoMoji = await KaoMoji.deploy();
  await kaoMoji.deployed();

  await kaoMoji.setKaoToken(kaoToken.address)
  await kaoMoji.setAuctionAddress(auctionHouseAddress)


  const KaoDao = await ethers.getContractFactory("KaoDao");
  const kaoDao = await KaoDao.deploy(kaoToken.address);
  await kaoDao.deployed();
  await kaoDao.setKaoMojiAddress(kaoMoji.address);

  const minterRole = await kaoMoji.MINTER_ROLE()
  await kaoMoji.grantRole(minterRole, kaoDao.address)

  await saveFrontendFiles(networkName, kaoDao.address, kaoMoji.address, kaoToken.address)

  console.log("KaoToken deployed to:", kaoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



