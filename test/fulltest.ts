import { BigNumber } from "@ethersproject/bignumber";
import { ContractReceipt } from "@ethersproject/contracts";
import { expect } from "chai";
import { ethers } from "hardhat";
import deployCore from "../scripts/_deploy-core";

describe("KapDao", function () {
  it("Should allow only to propose kao, generic propose method is for admin only", async function () {
    const [owner, user1] = await ethers.getSigners();

    const core = await deployCore('0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9')

    // Should have a create proposal specific for kaomojis. and a separate for governance
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
});

function getProposalIdFromReceipt(receipt: ContractReceipt) {
  const event = receipt.events?.find(x => x.event === 'ProposalCreated')
  if (!event?.args || event?.args?.length === 0) return null
  const firstArg = event.args
  if (!firstArg) return null;
  return firstArg.proposalId.toString()
}
