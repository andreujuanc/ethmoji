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

### Move forward in time
```
npx hardhat --network localhost dayforward
```
 