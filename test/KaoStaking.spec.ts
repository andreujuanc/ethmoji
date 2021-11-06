import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";
import deployCore from "../scripts/_deploy-core";

describe("KapStaking", function () {

    const transfer = async (core: any, user: SignerWithAddress, amount: BigNumberish, stakedTotalSupply: BigNumberish) => {
        await expect(() => core.kaoToken.transfer(user.address, amount)).to.changeTokenBalance(core.kaoToken, user, amount)
        expect(await core.kaoStaking.totalSupply()).to.be.equal(stakedTotalSupply.toString())
    }

    const stake = async (core: any, user: SignerWithAddress, amount: BigNumberish, stakedTotalSupply: BigNumberish) => {
        await expect(() => core.kaoToken.connect(user).approve(core.kaoStaking.address, amount)).to.changeTokenBalance(core.kaoToken, user, '0')
        await expect(() => core.kaoStaking.connect(user).stake(amount)).to.changeTokenBalance(core.kaoToken, user, BigNumber.from(amount).mul(-1))
        expect(await core.kaoStaking.totalSupply()).to.be.equal(stakedTotalSupply.toString())
    }

    const withdraw = async (core: any, user: SignerWithAddress, amount: BigNumberish, stakedTotalSupply: BigNumberish) => {
        await expect(() => core.kaoStaking.connect(user).withdraw(amount)).to.changeTokenBalance(core.kaoToken, user, BigNumber.from(amount))
        expect(await core.kaoStaking.totalSupply()).to.be.equal(stakedTotalSupply.toString(), 'Incorrect total supply')
    }


    it("Should return amount of kaotokens staked correctly", async function () {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')

        await transfer(core, user1, parseUnits('10', 'ether'), parseUnits('0', 'ether'))
        await transfer(core, user2, parseUnits('20', 'ether'), parseUnits('0', 'ether'))

        await stake(core, user1, parseUnits('10', 'ether'), parseUnits('10', 'ether'))
        await stake(core, user2, parseUnits('20', 'ether'), parseUnits('30', 'ether'))

        await withdraw(core, user1, parseUnits('5', 'ether'), parseUnits('25', 'ether'))
        await withdraw(core, user2, parseUnits('10', 'ether'), parseUnits('15', 'ether'))

        await withdraw(core, user1, parseUnits('5', 'ether'), parseUnits('10', 'ether'));

        await expect(withdraw(core, user2, parseUnits('1000', 'ether'), parseUnits('10', 'ether'))).to.be.revertedWith('ERC20: burn amount > balance')
        await expect(stake(core, user2, parseUnits('1000', 'ether'), parseUnits('10', 'ether'))).to.be.revertedWith('ERC20: transfer amount exceeds balance')


    });


    it("Should increase the multiplier as time passes", async () => {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')


        await transfer(core, user1, parseUnits('100', 'ether'), parseUnits('0', 'ether'))
        await transfer(core, user2, parseUnits('200', 'ether'), parseUnits('0', 'ether'))

        expect((await core.kaoStaking.getRewardsMultiplier(user1.address)).toString()).to.eq('0')
        expect((await core.kaoStaking.getRewardsMultiplier(user2.address)).toString()).to.eq('0')


        await stake(core, user1, parseUnits('100', 'ether'), parseUnits('100', 'ether'))
        await stake(core, user2, parseUnits('200', 'ether'), parseUnits('300', 'ether'))

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
