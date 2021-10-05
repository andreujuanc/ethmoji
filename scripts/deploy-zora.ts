// @ts-ignore
import { ethers } from "hardhat";
import fs from "fs-extra";

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



    /**
     * SAVING ADDRESSES
     */
    const addressesFile = __dirname + "/../app/src/contracts/contract-address.json";
    if (!fs.existsSync(addressesFile)) {
        console.error("You need to build your contract first");
        return;
    }
    const addressJson = fs.readFileSync(addressesFile);
    const addresses = JSON.parse(addressJson.toString());
    addresses.WETH = weth.address
    addresses.AuctionHouse = auctionHouse.address


    fs.writeFileSync(addressesFile,
        JSON.stringify(addresses, undefined, 2)
    );

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });