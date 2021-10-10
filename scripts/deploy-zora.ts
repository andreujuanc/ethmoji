// @ts-ignore
import { ethers, network } from "hardhat";
import fs from "fs-extra";
import { getAddresses } from "./utils/getAddresses";
import { isValidNetwork, Networks } from "./utils/networks";

async function main() {
    const WETH = await ethers.getContractFactory("WETH9");
    const weth = await WETH.deploy()
    await weth.deployed();

    // We get the contract to deploy
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");

    console.log(`Deploying Auction House`);

    const auctionHouse = await AuctionHouse.deploy(weth.address);

    console.log(`Auction House deploying to ${auctionHouse.address}. Awaiting confirmation...`);
    await auctionHouse.deployed();

    console.log("Auction House contracts deployed 📿");

    const networkName = network.name
    if (!isValidNetwork(networkName)) throw new Error(`Network not supported: ${networkName}`);

    /**
     * SAVING ADDRESSES
     */
    const { addressesFile } = getAddresses(networkName);

    const addressJson = fs.readFileSync(addressesFile);
    const addresses = JSON.parse(addressJson.toString());

    const file = {
        ...addresses,
        [networkName]: { ...addresses[networkName], WETH: weth.address, AuctionHouse: auctionHouse.address }
    }

    fs.writeFileSync(addressesFile, JSON.stringify(file, undefined, 2));

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


