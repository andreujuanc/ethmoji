import { BigNumberish } from "@ethersproject/bignumber";
import { ethers, upgrades, network } from "hardhat";
import { getAddresses } from "./utils/getAddresses";
import { isValidNetwork } from "./utils/networks";

export default async function upgradeCore(): Promise<void> {
    const networkName = network.name
    if (!isValidNetwork(networkName)) throw new Error(`Network not supported: ${networkName}`);

    const addresses = getAddresses()[networkName]

    if (!addresses.KaoMoji) throw new Error('No proxy address for KaoMoji')

    /**
     * KAOMOJI
     */
    const KaoMoji = await ethers.getContractFactory("KaoMoji");

    console.log('Upgrading KaoMoji')
    const kaoMoji = await upgrades.upgradeProxy(addresses.KaoMoji, KaoMoji, {
        kind: 'uups'
    });


    // /**
    //  * KAOSTAKING
    //  */
    // const KaoStaking = await ethers.getContractFactory('KaoStaking')
    // console.log('Deploying KaoStaking')
    // const kaoStaking = await upgrades.deployProxy(KaoStaking, undefined, {
    //     kind: 'uups'
    // })

    // /**
    //  * KAODAO
    //  */
    // const KaoDao = await ethers.getContractFactory("KaoDao");
    // console.log('Deploying KaoDao')
    // const kaoDao = await upgrades.deployProxy(KaoDao, [kaoToken.address, kaoStaking.address, voteDelay, votePeriod], {
    //     kind: 'uups'
    // });
    // await kaoDao.deployed();
    // await kaoDao.setKaoMojiAddress(kaoMoji.address);



}