// @ts-ignore
import { ethers } from "hardhat";
import fs from "fs-extra";
import { AuctionHouse } from "../typechain/AuctionHouse";

async function main() {
    const addressesFile = __dirname + "/../app/src/contracts/contract-address.json";
    if (!fs.existsSync(addressesFile)) {
        console.error("You need to build your contract first");
        return;
    }
    const addressJson = fs.readFileSync(addressesFile);
    const addresses = JSON.parse(addressJson.toString());


    // We get the contract to deploy
    const AuctionHouse = await ethers.getContractFactory("AuctionHouse");
    const wethAddress = addresses.KaoToken
    const mediaAddress = addresses.KaoMoji

    console.log(`Deploying Auction House`);

    const auctionHouse = await AuctionHouse.deploy(wethAddress);

    console.log(`Auction House deploying to ${auctionHouse.address}. Awaiting confirmation...`);
    await auctionHouse.deployed();

    console.log("Auction House contracts deployed 📿");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });