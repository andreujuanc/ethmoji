import { ethers, network, upgrades } from "hardhat";
import fs from "fs-extra";
import { AddressBook, getAddresses } from "./utils/getAddresses";
import { isValidNetwork, Networks } from "./utils/networks";
import { AuctionHouse, WETH9 } from "../typechain";

export async function deployAuctionHouse() {

    const networkName = network.name
    if (!isValidNetwork(networkName)) throw new Error(`Network not supported: ${networkName}`);

    const { addressesFile } = getAddresses();

    const addressJson = fs.readFileSync(addressesFile);
    const addresses: AddressBook = JSON.parse(addressJson.toString());

    const WETH = await ethers.getContractFactory("WETH9");
    let weth: WETH9
    if (networkName == Networks.localhost || networkName == Networks.hardhat) {
        weth = await WETH.deploy()
        await weth.deployed();
    }
    else {
        const wethAddress = addresses[networkName].WETH
        if (!wethAddress) throw new Error(`Network ${networkName} does not have WETH address configured`)
        weth = WETH.attach(wethAddress)
    }


    /**
     * Auction House
     */
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
    console.log('Deploying AuctionHouse')
    const auctionHouse = await upgrades.deployProxy(AuctionHouse, [weth.address], {
        kind: 'uups'
    });

    await auctionHouse.deployed();

    // /**
    //  * SAVING ADDRESSES
    //  */

    // const file = {
    //     ...addresses,
    //     [networkName]: { ...addresses[networkName], WETH: weth.address, AuctionHouse: auctionHouse.address }
    // }

    // fs.writeFileSync(addressesFile, JSON.stringify(file, undefined, 2));

    return {
        auctionHouse: auctionHouse as AuctionHouse,
        weth: weth
    }
}
