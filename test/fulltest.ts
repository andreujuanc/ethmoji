import { BigNumber } from "@ethersproject/bignumber";
import { ContractReceipt } from "@ethersproject/contracts";
import { parseUnits } from "@ethersproject/units";
import { expect } from "chai";
import { ethers } from "hardhat";
import deployCore from "../scripts/_deploy-core";

describe("KapDao", function () {
  it("Should allow only to propose kao, generic propose method is for admin only", async function () {
    const [owner, user1] = await ethers.getSigners();

    const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')

    const result = await core.kaoDao.propose([core.kaoMoji.address], [0], ["0x"], "Test")
    expect(getProposalIdFromReceipt(await result.wait())).to.have.lengthOf(77)

    try {
      const result2 = await core.kaoDao.connect(user1).propose([core.kaoMoji.address], [0], ["0x01"], "Test")
      await result2.wait()
      throw new Error('This should not execute')
    } catch (ex: any) {
      expect(ex.message).to.include('AccessControl')
    }

  });

  it("Should allow to propose kaomojis securely", async function () {
    const [owner, user1] = await ethers.getSigners();

    const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9', '1', '2')
    core.kaoToken.transfer(user1.address, parseUnits('1', 'ether'))

    await core.kaoToken.connect(user1).increaseAllowance(core.kaoStaking.address, parseUnits('1', 'ether'))
    await core.kaoStaking.connect(user1).stake(parseUnits('1', 'ether'))

    const kaoData = ethers.utils.toUtf8Bytes(":D")
    const result = await core.kaoDao.connect(user1).proposeKao(kaoData, "Happy face")
    expect(getProposalIdFromReceipt(await result.wait())).to.have.lengthOf(77)

    //expect('').to.emit(core.kaoDao, 'ProposalCreated').withArgs('a', 'b', 'c') //this is much better
  });

});

function getProposalIdFromReceipt(receipt: ContractReceipt) {
  const event = receipt.events?.find(x => x.event === 'ProposalCreated')
  if (!event?.args || event?.args?.length === 0) return null
  const firstArg = event.args
  if (!firstArg) return null;
  return firstArg.proposalId.toString()
}
