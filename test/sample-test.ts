import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import { ethers } from "hardhat";
import deployCore from "../scripts/_deploy-core";

describe("KaoToken", function () {
  it("Should mint initial tokens on start", async function () {
    const [owner, addr1] = await ethers.getSigners();

    //const core = deployCore('0x0')
   

  });
});
