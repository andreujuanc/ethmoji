import fs from "fs-extra";
import { Networks } from "./networks";

type AddressBook = {
    [network: string]: {
        KaoDao?: string,
        KaoMoji?: string,
        KaoToken?: string,
        WETH?: string,
        AuctionHouse?: string,
    },
} & { addressesFile: string }

export function getAddresses(network: Networks): AddressBook {
    const addressesFile = __dirname + "/../../app/src/contracts/contract-address.json";
    const contractsDir = __dirname + "/../../app/src/contracts";
    if (!fs.existsSync(addressesFile)) {
        if (!fs.existsSync(contractsDir)) {
            fs.mkdirSync(contractsDir);
        }
        fs.writeFileSync(addressesFile,
            JSON.stringify({}, undefined, 2)
        );
    }
    const addressJson = fs.readFileSync(addressesFile);
    const fileContent = JSON.parse(addressJson.toString());
    return { addresses: fileContent, addressesFile } as any;
}
