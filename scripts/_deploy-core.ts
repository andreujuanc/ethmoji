import { ethers, upgrades } from "hardhat";
import { KaoDao, KaoMoji, KaoToken } from "../typechain";

export default async function deployCore(auctionHouseAddress: string): Promise<{
    kaoToken: KaoToken
    kaoMoji: KaoMoji
    kaoDao: KaoDao
}> {
    const KaoToken = await ethers.getContractFactory("KaoToken");
    console.log('Deploying KaoToken')
    const kaoToken = await KaoToken.deploy();
    await kaoToken.deployed();

    const KaoMoji = await ethers.getContractFactory("KaoMoji");
    console.log('Deploying KaoMoji')
    const kaoMoji = await upgrades.deployProxy(KaoMoji, undefined, {
        kind: 'uups'
    });
    await kaoMoji.deployed();

    await kaoMoji.setKaoToken(kaoToken.address)
    await kaoMoji.setAuctionAddress(auctionHouseAddress)


    const KaoDao = await ethers.getContractFactory("KaoDao");
    console.log('Deploying KaoDao')
    const kaoDao = await upgrades.deployProxy(KaoDao, [kaoToken.address], {
        kind: 'uups'
    });
    await kaoDao.deployed();
    await kaoDao.setKaoMojiAddress(kaoMoji.address);
    
    const minterRole = await kaoMoji.MINTER_ROLE()
    await kaoMoji.grantRole(minterRole, kaoDao.address)

    return {
        kaoToken: kaoToken as any,
        kaoMoji: kaoMoji as any,
        kaoDao: kaoDao as any
    }
}