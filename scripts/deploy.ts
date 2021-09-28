import { run, ethers, artifacts } from "hardhat";

async function main() {
  await run("compile");

  const KaoToken = await ethers.getContractFactory("KaoToken");
  const kaoToken = await KaoToken.deploy();

  await kaoToken.deployed();

  saveFrontendFiles(kaoToken)

  console.log("KaoToken deployed to:", kaoToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



function saveFrontendFiles(token: any) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../app/src/contracts";
  console.log('contractsDir', contractsDir)
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("KaoToken");

  fs.writeFileSync(
    contractsDir + "/KaoToken.json",
    JSON.stringify(TokenArtifact, null, 2)
  );

  console.log("Files saved to frontend")
}