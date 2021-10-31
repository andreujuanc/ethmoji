import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers } from "hardhat";
import deployCore from "../scripts/_deploy-core";

describe("KapStaking", function () {
    it("Should return amount of kaotokens staked correctly", async function () {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')

        const USER_1_BALANCE = parseUnits('10', 'ether')
        const USER_2_BALANCE = parseUnits('20', 'ether')

        const transferAndStake = async (user: SignerWithAddress, amount: BigNumberish, expectedTotal: BigNumberish) => {
            await expect(() => core.kaoToken.transfer(user.address, amount)).to.changeTokenBalance(core.kaoToken, user, amount)
            await expect(() => core.kaoToken.connect(user).approve(core.kaoStaking.address, amount)).to.changeTokenBalance(core.kaoToken, user, '0')
            await expect(() => core.kaoStaking.connect(user).stake(amount)).to.changeTokenBalance(core.kaoToken, user, BigNumber.from(amount).mul(-1))
            expect(await core.kaoStaking.totalSupply()).to.be.equal(expectedTotal.toString())
        }

        const withdraw = async (user: SignerWithAddress, amount: BigNumberish, expectedTotal: BigNumberish) => {
            await expect(() => core.kaoStaking.connect(user).withdraw(amount)).to.changeTokenBalance(core.kaoToken, user, BigNumber.from(amount))
            expect(await core.kaoStaking.totalSupply()).to.be.equal(expectedTotal.toString(), 'Incorrect total supply')
        }


        await transferAndStake(user1, parseUnits('10', 'ether'), parseUnits('10', 'ether'))
        await transferAndStake(user2, parseUnits('20', 'ether'), parseUnits('30', 'ether'))

        await withdraw(user1, parseUnits('5', 'ether'), parseUnits('25', 'ether'))
        await withdraw(user2, parseUnits('10', 'ether'), parseUnits('15', 'ether'))

        await withdraw(user1, parseUnits('5', 'ether'), parseUnits('10', 'ether'));

        await expect(withdraw(user2, parseUnits('1000', 'ether'), parseUnits('10', 'ether'))).to.be.revertedWith('ERC20: burn amount > balance')

    });



});
