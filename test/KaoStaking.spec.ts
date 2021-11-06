import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";
import deployCore, { KaoContracts } from "../scripts/_deploy-core";

describe("KapStaking", function () {

    const transfer = async (core: KaoContracts, user: SignerWithAddress, amount: string, stakedTotalSupply: string) => {
        await expect(() => core.kaoToken.transfer(user.address, parseUnits(amount, 'ether'))).to.changeTokenBalance(core.kaoToken, user, parseUnits(amount, 'ether'))
        expect(await core.kaoStaking.totalSupply()).to.be.equal(parseUnits(stakedTotalSupply, 'ether').toString())
    }

    const stake = async (core: KaoContracts, user: SignerWithAddress, amount: string, satakedByUser: string, stakedTotalSupply: string) => {
        await expect(() => core.kaoToken.connect(user).approve(core.kaoStaking.address, parseUnits(amount, 'ether'))).to.changeTokenBalance(core.kaoToken, user, '0')
        await expect(() => core.kaoStaking.connect(user).stake(parseUnits(amount, 'ether'))).to.changeTokenBalance(core.kaoToken, user, BigNumber.from(parseUnits(amount, 'ether')).mul(-1))
        expect(await core.kaoStaking.totalSupply()).to.be.equal(parseUnits(stakedTotalSupply, 'ether').toString())
        expect(await core.kaoStaking.balanceOf(user.address)).to.be.eq(parseUnits(satakedByUser, 'ether').toString())
    }

    const withdraw = async (core: KaoContracts, user: SignerWithAddress, amount: string, satakedByUser: string, stakedTotalSupply: string) => {
        await expect(() => core.kaoStaking.connect(user).withdraw(parseUnits(amount, 'ether'))).to.changeTokenBalance(core.kaoToken, user, parseUnits(amount, 'ether'))
        expect(await core.kaoStaking.totalSupply()).to.be.equal(parseUnits(stakedTotalSupply, 'ether'), 'Incorrect total supply')
        expect(await core.kaoStaking.balanceOf(user.address)).to.be.eq(parseUnits(satakedByUser, 'ether').toString(), 'Incorrect staked balane')
    }


    it("Should return amount of kaotokens staked correctly", async function () {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')

        await transfer(core, user1, '100', '0')
        await transfer(core, user2, '200', '0')

        await stake(core, user1, '10', '10', '10')
        await stake(core, user2, '20', '20', '30')

        await stake(core, user1, '10', '20', '40')
        await stake(core, user2, '30', '50', '70')

        await withdraw(core, user1, '5', '15', '65')
        await withdraw(core, user2, '10', '40', '55')

        await withdraw(core, user1, '10', '5', '45');
        await withdraw(core, user2, '40', '0', '5')

        await expect(withdraw(core, user2, '1000', '5', '45')).to.be.revertedWith('ERC20: burn amount > balance')
        await expect(stake(core, user2, '1000', '0', '10')).to.be.revertedWith('ERC20: transfer amount exceeds balance')


    });


    it("Should increase the multiplier as time passes", async () => {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')


        await transfer(core, user1, '100', '0')
        await transfer(core, user2, '200', '0')

        expect((await core.kaoStaking.getRewardsMultiplier(user1.address)).toString()).to.eq('0')
        expect((await core.kaoStaking.getRewardsMultiplier(user2.address)).toString()).to.eq('0')


        await stake(core, user1, '100', '100', '100')
        await stake(core, user2, '200', '200', '300')

        expect((await core.kaoStaking.getRewardsMultiplier(user1.address)).toString()).to.eq('5') // 5% is the base fee
        expect((await core.kaoStaking.getRewardsMultiplier(user2.address)).toString()).to.eq('5') // 5% is the base fee

        let prev_user1 = BigNumber.from('0');
        let prev_user2 = BigNumber.from('0');

        for (let i = 1; i < (30 * 7); i++) { // Max staking for rewards is 30 weeks
            await network.provider.send("evm_increaseTime", [3600 * 24])
            await network.provider.send("evm_mine")

            let current_user1 = await core.kaoStaking.getRewardsMultiplier(user1.address)
            let current_user2 = await core.kaoStaking.getRewardsMultiplier(user2.address)

            expect(current_user1.toString()).to.be.gte(prev_user1)
            expect(current_user1.toString()).to.be.gte(prev_user2)

            prev_user1 = current_user1
            prev_user2 = current_user2
        }

        await network.provider.send("evm_increaseTime", [3600 * 24])
        await network.provider.send("evm_mine")

        expect((await core.kaoStaking.getRewardsMultiplier(user1.address)).toString()).to.be.gte(BigNumber.from('66'))
        expect((await core.kaoStaking.getRewardsMultiplier(user2.address)).toString()).to.be.gte(BigNumber.from('66'))





    })

});
