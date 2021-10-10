// @ts-ignore
import { ethers, network } from "hardhat";
import fs from "fs-extra";
import { AddressBook, getAddresses } from "./utils/getAddresses";
import { isValidNetwork, Networks } from "./utils/networks";
import { WETH9 } from "../typechain";

async function main() {

    const networkName = network.name
    if (!isValidNetwork(networkName)) throw new Error(`Network not supported: ${networkName}`);

    const { addressesFile } = getAddresses(networkName);

    const addressJson = fs.readFileSync(addressesFile);
    const addresses: AddressBook = JSON.parse(addressJson.toString());

    const WETH = await ethers.getContractFactory("WETH9");
    let weth: WETH9
    if (networkName == Networks.localhost) {
        weth = await WETH.deploy()
        await weth.deployed();
    }
    else{
        const wethAddress = addresses[networkName].WETH
        if(!wethAddress) throw new Error(`Network ${networkName} does not have WETH address configured`)
        weth = WETH.attach(wethAddress)
    }

    // We get the contract to deploy
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");

    console.log(`Deploying Auction House`);

    const auctionHouse = await AuctionHouse.deploy(weth.address);

    console.log(`Auction House deploying to ${auctionHouse.address}. Awaiting confirmation...`);
    await auctionHouse.deployed();

    console.log("Auction House contracts deployed 📿");


    /**
     * SAVING ADDRESSES
     */

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


