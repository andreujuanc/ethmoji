import { run, ethers, network } from "hardhat";
import { getAddresses } from "./utils/getAddresses";
import { isValidNetwork, Networks } from "./utils/networks";
import { saveFrontendFiles } from "./utils/saveFrontendFiles";
import deployCore from "./_deploy-core";
import upgradeCore from "./_upgrade-core";

async function main() {
    await run("compile");
    const networkName = network.name
    if (!isValidNetwork(networkName)) throw new Error(`Network not supported: ${networkName}`);

    const addresses = getAddresses()[networkName];
    const auctionHouseAddress = addresses.AuctionHouse
    if (!auctionHouseAddress) {
        throw new Error('Auction house must be deployed first')
    }

    await upgradeCore()

    //await saveFrontendFiles(networkName, core.kaoDao.address, core.kaoMoji.address, core.kaoToken.address, core.kaoStaking.address)

    console.log("Done!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



