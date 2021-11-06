import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";
import deployCore, { KaoContracts } from "../scripts/_deploy-core";


const transfer = async (core: KaoContracts, user: SignerWithAddress, amount: string, votingPower: string) => {
    await core.kaoToken.transfer(user.address, parseUnits(amount, 'ether'))
    await network.provider.send("evm_mine")
    const block = await ethers.provider.getBlockNumber() 
    expect(await core.kaoDao.getVotes(user.address, block - 1)).to.be.equal(parseUnits(votingPower, 'ether').toString())
}

const stake = async (core: KaoContracts, user: SignerWithAddress, amount: string, votingPower: string) => {
    await core.kaoToken.connect(user).approve(core.kaoStaking.address, parseUnits(amount, 'ether'))
    await core.kaoStaking.connect(user).stake(parseUnits(amount, 'ether'))
    await network.provider.send("evm_mine")
    await network.provider.send("evm_mine")
    
    const block = await ethers.provider.getBlockNumber() 
    expect(await core.kaoDao.getVotes(user.address, block - 1)).to.be.equal(parseUnits(votingPower, 'ether').toString())
}

const withdraw = async (core: KaoContracts, user: SignerWithAddress, amount: string, satakedByUser: string, stakedTotalSupply: string) => {
    await expect(() => core.kaoStaking.connect(user).withdraw(parseUnits(amount, 'ether'))).to.changeTokenBalance(core.kaoToken, user, parseUnits(amount, 'ether'))
    expect(await core.kaoStaking.totalSupply()).to.be.equal(parseUnits(stakedTotalSupply, 'ether'), 'Incorrect total supply')
    expect(await core.kaoStaking.balanceOf(user.address)).to.be.eq(parseUnits(satakedByUser, 'ether').toString(), 'Incorrect staked balane')
}


describe("KaoDao", function () {


    it("Should return amount of voting power correctly", async function () {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')

        await transfer(core, user1, '100', '100')

        await stake(core, user1, '25', '100')

        // await stake(core, user1, '10', '20', '40')

        // await withdraw(core, user1, '5', '15', '65')

        // await withdraw(core, user1, '10', '5', '45');

        // await expect(withdraw(core, user2, '1000', '5', '45')).to.be.revertedWith('ERC20: burn amount > balance')

    });
});
