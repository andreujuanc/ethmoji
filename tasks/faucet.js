const fs = require("fs");

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .addPositionalParam("amount", "Amount of tokens to transfer")
  .setAction(async ({ receiver, amount }) => {
    // if (network.name !== "hardhat") {
    //   throw new Error('Only for dev for now')
    // }

    const KaoToken = await ethers.getContractFactory("KaoToken");
    const addressesFile =
      __dirname + "/../app/src/contracts/contract-address.json";
    if (!fs.existsSync(addressesFile)) {
      console.error("You need to build your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);


    if ((await ethers.provider.getCode(address.KaoToken)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("KaoToken", address.KaoToken);
    const [sender] = await ethers.getSigners();

    const tx = await token.transfer(receiver, ethers.utils.parseUnits(amount, 18).toString())
    await tx.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 tokens to ${receiver}`);
  });
