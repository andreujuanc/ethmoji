import { useWeb3React } from "@web3-react/core";
import { Networks } from "../core/networks";
import addresses from '../contracts/contract-address.json'

type KaoAddresses = {
    KaoDao: string,
    KaoMoji: string,
    KaoToken: string,
    WETH: string,
    AuctionHouse: string,
}

type AddressBook = {
    [network: string]: KaoAddresses,
}


export function useAddresses (): KaoAddresses{
    const { chainId } = useWeb3React()
    const network =  chainId && Networks[chainId] ? Networks[chainId] : "Invalid Network"
    return addresses && (addresses as AddressBook)[network]
}