import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";
import deployCore, { KaoContracts } from "../scripts/_deploy-core";


const transfer = async (core: KaoContracts, user: SignerWithAddress, amount: string, votingPower: string) => {
    await core.kaoToken.transfer(user.address, parseUnits(amount, 'ether'))
    await network.provider.send("evm_mine")
    
    await votes(core, user, votingPower);
}

const stake = async (core: KaoContracts, user: SignerWithAddress, amount: string, votingPower: string) => {
    await core.kaoToken.connect(user).approve(core.kaoStaking.address, parseUnits(amount, 'ether'))
    await core.kaoStaking.connect(user).stake(parseUnits(amount, 'ether'))
    
    await votes(core, user, votingPower);
}

const withdraw = async (core: KaoContracts, user: SignerWithAddress, amount: string, votingPower: string) => {
    await  core.kaoStaking.connect(user).withdraw(parseUnits(amount, 'ether'))

    await votes(core, user, votingPower);
}

const  votes = async (core: KaoContracts, user: SignerWithAddress, votingPower: string) => {
    await network.provider.send("evm_mine")
    const block = await ethers.provider.getBlockNumber();
    expect(await core.kaoDao.getVotes(user.address, block - 1)).to.be.equal(parseUnits(votingPower, 'ether').toString());
}




describe("KaoDao", function () {


    it("Should return amount of voting power correctly", async function () {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')

        await transfer(core, user1, '100', '100')
        await stake(core, user1, '25', '100')
        await stake(core, user1, '50', '100')
        await withdraw(core, user1, '45', '100')
        await withdraw(core, user1, '30', '100')

        await core.kaoToken.connect(user1).transfer(core.kaoToken.address,  parseUnits('50', 'ether'))
        await votes(core, user1, '50')

        await core.kaoToken.connect(user1).transfer(core.kaoToken.address,  parseUnits('50', 'ether'))
        await votes(core, user1, '0')

    });
});
