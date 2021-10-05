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



async function saveFrontendFiles(kaoDaoAddress: string, kaoMojiAddress: string, kaoTokenAddress: string) {
  const contractsDir = __dirname + "/../app/src/contracts";
  const typesDir = __dirname + "/../typechain";
  const addressesFile = contractsDir + "/contract-address.json"

  console.log('contractsDir', contractsDir)
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  if (!fs.existsSync(addressesFile)) {
    fs.writeFileSync(addressesFile,
        JSON.stringify({}, undefined, 2)
    );
}

  const addressJson = fs.readFileSync(addressesFile);
  const addresses = JSON.parse(addressJson.toString());

  fs.writeFileSync(
    addressesFile,
    JSON.stringify({ ...addresses, KaoDao: kaoDaoAddress, KaoMoji: kaoMojiAddress, KaoToken: kaoTokenAddress }, undefined, 2)
  );

  if(!fs.existsSync(`${contractsDir}/factories`)){
    fs.mkdirSync(`${contractsDir}/factories`)
  }

  await copy("KaoDao");
  await copy("KaoMoji");
  await copy("KaoToken");
  // TODO: Copy types to /app

  console.log("Files saved to frontend")

  async function copy(artifact: string) {
    const TokenArtifact = artifacts.readArtifactSync(artifact);

    fs.writeFileSync(
      contractsDir + `/${artifact}.json`,
      JSON.stringify(TokenArtifact, null, 2)
    );

    console.log(artifact)
    fs.copyFileSync(`${typesDir}/${artifact}.d.ts`, `${contractsDir}/${artifact}.d.ts`)
    fs.copyFileSync(`${typesDir}/factories/${artifact}__factory.ts`, `${contractsDir}/factories/${artifact}__factory.ts`)
  }
}