import { run, ethers, artifacts } from "hardhat";
import fs from 'fs'

async function main() {
  await run("compile");

  const KaoToken = await ethers.getContractFactory("KaoToken");
  const kaoToken = await KaoToken.deploy();
  await kaoToken.deployed();

  const KaoMoji = await ethers.getContractFactory("KaoMoji");
  const kaoMoji = await KaoMoji.deploy();
  await kaoMoji.deployed();


  const KaoDao = await ethers.getContractFactory("KaoDao");
  const kaoDao = await KaoDao.deploy(kaoToken.address);
  await kaoDao.deployed();

  saveFrontendFiles(kaoDao.address, kaoMoji.address, kaoToken.address)

  console.log("KaoToken deployed to:", kaoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



function saveFrontendFiles(kaoDaoAddress: string, kaoMojiAddress: string, kaoTokenAddress: string) {
  const contractsDir = __dirname + "/../app/src/contracts";
  console.log('contractsDir', contractsDir)
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ KaoDao: kaoDaoAddress, KaoMoji: kaoMojiAddress, KaoToken: kaoTokenAddress }, undefined, 2)
  );

  copy("KaoDao");
  copy("KaoMoji");
  copy("KaoToken");
  // TODO: Copy types to /app

  console.log("Files saved to frontend")

  function copy(artifact: string) {
    const TokenArtifact = artifacts.readArtifactSync(artifact);

    fs.writeFileSync(
      contractsDir + `/${artifact}.json`,
      JSON.stringify(TokenArtifact, null, 2)
    );
  }
}