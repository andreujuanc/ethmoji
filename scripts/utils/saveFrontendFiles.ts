import { artifacts } from "hardhat";
import fs from 'fs';

export async function saveFrontendFiles(kaoDaoAddress: string, kaoMojiAddress: string, kaoTokenAddress: string) {
  const contractsDir = __dirname + "/../../app/src/contracts";
  const typesDir = __dirname + "/../../typechain";
  const addressesFile = contractsDir + "/contract-address.json";

  console.log('contractsDir', contractsDir);
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

  if (!fs.existsSync(`${contractsDir}/factories`)) {
    fs.mkdirSync(`${contractsDir}/factories`);
  }

  await copy("KaoDao");
  await copy("KaoMoji");
  await copy("KaoToken");
  await copy("AuctionHouse");
  // TODO: Copy types to /app
  console.log("Files saved to frontend");

  async function copy(artifact: string) {
    const TokenArtifact = artifacts.readArtifactSync(artifact);

    fs.writeFileSync(
      contractsDir + `/${artifact}.json`,
      JSON.stringify(TokenArtifact, null, 2)
    );

    console.log(artifact);
    fs.copyFileSync(`${typesDir}/${artifact}.d.ts`, `${contractsDir}/${artifact}.d.ts`);
    fs.copyFileSync(`${typesDir}/factories/${artifact}__factory.ts`, `${contractsDir}/factories/${artifact}__factory.ts`);
  }
}
