import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "./useContracts";

export type Auction = {
    auctionId: BigNumber
    
    tokenId: BigNumber
    // Address for the ERC721 contract
    tokenContract: string
    // Whether or not the auction curator has approved the auction to start
    approved: boolean
    // The current highest bid amount
    amount: BigNumber
    // The length of time to run the auction for, after the first bid was made
    duration: BigNumber
    // The time of the first bid
    firstBidTime: BigNumber
    // The minimum price of the first bid
    reservePrice: BigNumber
    // The sale percentage to send to the curator
    curatorFeePercentage: number
    // The address that should receive the funds once the NFT is sold.
    tokenOwner : string;
    // The address of the current highest bid
     bidder: string
    // The address of the auction's curator.
    // The curator can reject or approve an auction
    curator: string
    // The address of the ERC-20 currency to run the auction with.
    // If set to 0x0, the auction will be run in ETH
    auctionCurrency: string;
}


export default function useAuctions() {
    const [auctions, setAuctions] = useState<Auction[]>([])
    const contracts = useContracts()
    const getAuctions = useMemo(() => async () => {
        if (!contracts) return

        const filter = contracts.auction?.filters.AuctionCreated(null, null, contracts.moji.address)
        if (filter) {
            const auctionsResult = await contracts.auction?.queryFilter(filter)
            const auctions: Auction[] = auctionsResult?.map((x) => ({
                ...x.args
            })) ?? []

                
            setAuctions(auctions.sort((a, b) => BigNumber.from(b?.firstBidTime ?? 0 ).sub(a?.firstBidTime ?? 0)?.toNumber()))
        }

    }, [contracts])

    useEffect(() => {
        getAuctions()
    }, [contracts, getAuctions])

    return auctions
}