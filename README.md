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
- Fix delegation, or validate if vote has weight before sending TX. Otherwise 0 power is send.

### Faucet
 ```
 npx hardhat --network localhost faucet <ADDRESS> <AMOUNT>
 ```

 ### Cool things I managed to integrate
 - Auction
    - Zora https://github.com/ourzora/auction-house
      - Copied the AuctionHouse contract into the repo and used it.

 - AMM with sdks
    - Paraswap
      - Used SDK to build a swap feature for KAO pairs 
