import { run, ethers } from "hardhat";
import { getAddresses } from "./utils/getAddresses";
import { saveFrontendFiles } from "./utils/saveFrontendFiles";

async function main() {
  await run("compile");
  const { addresses } = getAddresses();
  if(!addresses.AuctionHouse){
    throw new Error('Auction house must be deployed first')
  }

  const KaoToken = await ethers.getContractFactory("KaoToken");
  const kaoToken = await KaoToken.deploy();
  await kaoToken.deployed();

  const KaoMoji = await ethers.getContractFactory("KaoMoji");
  const kaoMoji = await KaoMoji.deploy();
  await kaoMoji.deployed();

  await kaoMoji.setKaoToken(kaoToken.address)
  await kaoMoji.setAuctionAddress(addresses.AuctionHouse)


  const KaoDao = await ethers.getContractFactory("KaoDao");
  const kaoDao = await KaoDao.deploy(kaoToken.address);
  await kaoDao.deployed();


  const minterRole = await kaoMoji.MINTER_ROLE()
  await kaoMoji.grantRole(minterRole, kaoDao.address)
  await kaoMoji.grantRole(minterRole, '0xD200D7d095D3aE3fF5e29e721E3825c568A9aDDE')

  await saveFrontendFiles(kaoDao.address, kaoMoji.address, kaoToken.address)

  console.log("KaoToken deployed to:", kaoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



