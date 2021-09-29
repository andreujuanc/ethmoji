task("mine", "For testing purposes, it advances the blocknumber")
  .addPositionalParam("blocks", "The Amount of blocks to mine")
  .setAction(async ({ blocks }) => {
    for (let i = 0; i < blocks; i++) {
      const tx = await ethers.provider.send('evm_mine')
      
      console.log('block', i, tx)
    }
  });


