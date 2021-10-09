# How to run

### Contracts
```
npm install
npm run local:node
npm run local:deploy
```

### Frontend
```
cd app
npm install
npm run start
```



# TODO:
- NFT Data size should depend on voting power somehow
- Would be nice to set the curator as the proposal creator so it gets a cut
- Should we burn the auction winning bid?
- Check data for invalid characters \n\r\t

# Utils
```
npm run local:deploy:zora --chainId=31337
```

### Faucet
 ```
 npx hardhat --network localhost faucet <ADDRESS> <AMOUNT>
 ```


 ### Cool things to see if fit
 - Auction
    - Zora https://github.com/ourzora/auction-house
 
 - Storage 
    - IPFS
    - Textile https://eth.storage/docs/

 - AMM with sdks (time is of the essence )
    - Paraswap
    - Uniswap