import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers } from "hardhat";
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

    })

});
