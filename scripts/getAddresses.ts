import fs from "fs-extra";

export function getAddresses(): {
    addressesFile: string, addresses: {
        KaoDao?: string,
        KaoMoji?: string,
        KaoToken?: string,
        WETH?: string,
        AuctionHouse?: string,
    }
} {
    const addressesFile = __dirname + "/../app/src/contracts/contract-address.json";
    if (!fs.existsSync(addressesFile)) {
        fs.writeFileSync(addressesFile,
            JSON.stringify({}, undefined, 2)
        );
    }
    const addressJson = fs.readFileSync(addressesFile);
    const addresses = JSON.parse(addressJson.toString());
    return { addresses, addressesFile };
}
