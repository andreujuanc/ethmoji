task("mine", "For testing purposes, it advances the blocknumber")
  .addPositionalParam("blocks", "The Amount of blocks to mine")
  .setAction(async ({ blocks }) => {
    for (let i = 0; i < blocks; i++) {
      const tx = await ethers.provider.send('evm_mine')
      
      console.log('block', i, tx)
    }
  });


  task("dayforward", "For testing purposes, it advances the timestamp")
  //.addPositionalParam("days", "The Amount of days to mine")
  .setAction(async ({ blocks }) => {
    await network.provider.send("evm_increaseTime", [3600*24])
    await network.provider.send("evm_mine") 
  });


