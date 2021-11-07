import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { parseUnits } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";
import deployCore, { KaoContracts } from "../scripts/_deploy-core";


const transfer = async (core: KaoContracts, user: SignerWithAddress, amount: string) => {
    await core.kaoToken.transfer(user.address, parseUnits(amount, 'ether'))
    await core.kaoToken.connect(user).approve(core.auctionHouse.address, parseUnits(amount, 'ether'))
    await network.provider.send("evm_mine")
}

const stake = async (core: KaoContracts, user: SignerWithAddress, amount: string) => {
    await core.kaoToken.connect(user).approve(core.kaoStaking.address, parseUnits(amount, 'ether'))
    await core.kaoStaking.connect(user).stake(parseUnits(amount, 'ether'))
    await network.provider.send("evm_mine")

}

describe("KaoMoji", function () {


    it("Minting and bidding without any friction or permission issues", async function () {
        const [owner, user1, user2] = await ethers.getSigners();

        const core = await deployCore('1', '2')

        await transfer(core, user1, '250');
        await stake(core, user1, '250')

        await transfer(core, user2, '100');

        await core.kaoMoji.grantRole(await core.kaoMoji.MINTER_ROLE(), user1.address)

        await core.kaoMoji.mint(ethers.utils.toUtf8Bytes(':D'), user1.address)

        await core.auctionHouse.connect(user2).createBid('0', parseUnits('10', 'ether'))

        await network.provider.send("evm_increaseTime", [3600 * 24])
        await network.provider.send("evm_mine")

        await core.auctionHouse.endAuction('0')

    });
});
