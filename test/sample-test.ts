import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("KaoToken", function () {
  it("Should mint initial tokens on start", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const KaoToken = await ethers.getContractFactory("KaoToken");
    const kaoToken = await KaoToken.deploy();
    await kaoToken.deployed();
    const initTx = await kaoToken.initialize("https://kaotoken.com/token/{id}")
    await initTx.wait();
    console.log("acc", owner.address)
    const balance = await kaoToken.balanceOf(owner.address, 0);
  
    expect(balance).to.equal(BigNumber.from(10).pow(18).mul(10000));

    // const setGreetingTx = await kaoToken.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await kaoToken.greet()).to.equal("Hola, mundo!");
  });
});
