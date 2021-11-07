import { BigNumberish } from "@ethersproject/bignumber";
import { ethers, upgrades } from "hardhat";
import { KaoDao, KaoMoji, KaoToken, KaoStaking, AuctionHouse } from "../typechain";
import { deployAuctionHouse } from "./_deploy-zora";

export type KaoContracts = {
    kaoToken: KaoToken
    kaoMoji: KaoMoji
    kaoDao: KaoDao
    kaoStaking: KaoStaking
    auctionHouse: AuctionHouse
}

export default async function deployCore(voteDelay: BigNumberish, votePeriod: BigNumberish): Promise<KaoContracts> {
    const auction = await deployAuctionHouse()

    /**
     * KAOTOKEN
     */
    const KaoToken = await ethers.getContractFactory("KaoToken");
    console.log('Deploying KaoToken')
    const kaoToken = await KaoToken.deploy();
    await kaoToken.deployed();



    /**
     * KAOMOJI
     */
    const KaoMoji = await ethers.getContractFactory("KaoMoji");
    console.log('Deploying KaoMoji')
    const kaoMoji = await upgrades.deployProxy(KaoMoji, undefined, {
        kind: 'uups'
    });
    await kaoMoji.deployed();


    /**
     * KAOSTAKING
     */
    const KaoStaking = await ethers.getContractFactory('KaoStaking')
    console.log('Deploying KaoStaking')
    const kaoStaking = await upgrades.deployProxy(KaoStaking, [kaoToken.address], {
        kind: 'uups'
    })

    /**
     * KAODAO
     */
    const KaoDao = await ethers.getContractFactory("KaoDao");
    console.log('Deploying KaoDao')
    const kaoDao = await upgrades.deployProxy(KaoDao, [kaoToken.address, kaoStaking.address, voteDelay, votePeriod], {
        kind: 'uups'
    });
    await kaoDao.deployed();
    await kaoDao.setKaoMojiAddress(kaoMoji.address);

    /**
     * SETUP
     */
    
    const minterRole = await kaoMoji.MINTER_ROLE()
    await kaoMoji.grantRole(minterRole, kaoDao.address)

    await kaoMoji.setKaoTokenAddress(kaoToken.address)
    await kaoMoji.setAuctionAddress(auction.auctionHouse.address)
    await kaoMoji.setKaoStakingAddress(kaoStaking.address)

    return {
        kaoToken: kaoToken as any,
        kaoMoji: kaoMoji as any,
        kaoDao: kaoDao as any,
        kaoStaking: kaoStaking as any,
        auctionHouse: auction.auctionHouse
    }
}