import { run, ethers, artifacts } from "hardhat";
import fs from 'fs'

async function main() {
  await run("compile");

  const KaoToken = await ethers.getContractFactory("KaoToken");
  const kaoToken = await KaoToken.deploy();
  await kaoToken.deployed();

  saveFrontendFiles(kaoToken.address)

  console.log("KaoToken deployed to:", kaoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



function saveFrontendFiles(kaoDaoAddress: string) {
  const contractsDir = __dirname + "/../app/src/contracts";
  console.log('contractsDir', contractsDir)
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ KaoDao: kaoDaoAddress }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("KaoDao");

  fs.writeFileSync(
    contractsDir + "/KaoDao.json",
    JSON.stringify(TokenArtifact, null, 2)
  );

  // TODO: Copy types to /app

  console.log("Files saved to frontend")
}