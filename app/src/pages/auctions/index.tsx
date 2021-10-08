import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/button";
import Container from "../../components/container";
import { Input } from "../../components/input";
import { KaoMojiFrame } from "../../components/kaomoji";
import useAuctions, { Auction } from "../../hooks/useAuctions";
import { useContracts } from "../../hooks/useContracts";
import { KaoMojiItem } from "../../hooks/useKaoMoji";
import { useSigner } from "../../hooks/useSigner";

export default function Auctions() {
    const auctions = useAuctions()


    return (
        <div style={{
            maxWidth: '600px',
            minWidth: '600px',
        }}>
            <h3>
                Auctions
            </h3>
            <br />
            <section>
                {
                    auctions.map((a) => (<AuctionItem key={a.auctionId?.toString()} auction={a} />))
                }
            </section>
        </div>
    )
}

function AuctionItem(props: { auction: Auction }): JSX.Element {
    const [auction, setAuction] = useState<Auction>(props.auction)
    const contracts = useContracts()
    const signer = useSigner()
    const [bidAmount, setBidAmount] = useState<BigNumber>()
    const [allowance, setAllowance] = useState<BigNumber>()
    const [kaomoji, setKaomoji] = useState<KaoMojiItem>()

    const nowTimeStamp = BigNumber.from(Math.round((Date.now() / 1000)))
    const endOfAuction = auction?.firstBidTime?.add(auction.duration)
    const started = auction?.firstBidTime?.eq(0) || (endOfAuction && nowTimeStamp.lt(endOfAuction))
    const ended = auction?.firstBidTime?.gt(0) && (endOfAuction && nowTimeStamp.gt(endOfAuction))

    const getAuction = useCallback(async () => {
        const auctionData = await contracts?.auction.auctions(props.auction.auctionId)
        if (!auctionData) return

        //const kaoFilter = contracts?.moji?.filters?.Transfer(ethers.constants.AddressZero, undefined, auctionData.tokenId)
        const tokenData = await contracts?.moji.getDataOf(auctionData.tokenId)
        // const kao = (await contracts?.moji?.queryFilter(kaoFilter))?.map(x=>x.args)?.find(x => x.tokenId.toString().toLowerCase() == auctionData.tokenId?.toString().toLowerCase())
        // tokenId: auctionData?.tokenId ?? BigNumber.from('0'),
        // tokenContract: auctionData?.tokenContract ?? ''
        setKaomoji({
            id: auctionData.tokenId,
            data: tokenData,
            owner: ''
        })
        setAuction({
            ...auction,
            amount: auctionData?.amount ?? BigNumber.from('0'),
            firstBidTime: auctionData?.firstBidTime ?? BigNumber.from('0'),

        })

    }, [auction, contracts, props.auction.auctionId])

    const getAllowance = useCallback(async () => {
        const account = await signer?.getAddress()
        if (!account) return

        const allowance = await contracts?.token.allowance(account, contracts.auction.address)
        setAllowance(allowance)
    }, [signer, contracts])

    useEffect(() => {
        getAuction()
        getAllowance()
    }, [signer, getAuction, getAllowance])

    const placeBid = async () => {
        if (!bidAmount) return

        const tx = await contracts?.auction.createBid(auction.auctionId, bidAmount)
        await tx?.wait()
    }

    const increaseAllowance = async () => {
        const account = await signer?.getAddress()
        if (!account || !bidAmount) return
        const tx = await contracts?.token.increaseAllowance(contracts.auction.address, bidAmount)
        await tx?.wait()
    }

    const claim = async () => {
        const tx = await contracts?.auction.endAuction(auction.auctionId)
        await tx?.wait()
    }

    return (
        <Container>
            <div>
                Auction Id {auction.auctionId.toString()}
            </div>
            <div>
                Token Id {auction.tokenId?.toString()}
            </div>
            {started && !ended && <div>
                Ends in {endOfAuction && endOfAuction.sub(nowTimeStamp).div(60).toString() + 'min'}
            </div>}
            {ended && <div>
                Auction Ended!
            </div>}
            <div>
                Amount {auction.amount?.toString()}
            </div>

            <div>
                <KaoMojiFrame data={kaomoji?.data && ethers.utils.toUtf8String(kaomoji?.data)} />
            </div>
            {
                auction && started &&
                <div>
                    <Input type={"number"}
                        placeholder={auction.reservePrice?.toString()}
                        onChange={(x) => {
                            try {
                                if (x === '')
                                    setBidAmount(undefined)
                                else
                                    setBidAmount(BigNumber.from(x))
                            } catch { }
                        }}
                        value={bidAmount?.toString() ?? ""} />
                    {bidAmount && bidAmount?.gt(0) && allowance && allowance?.lt(bidAmount) && <Button onClick={increaseAllowance} >Increase allowance</Button>}
                    {
                        (!bidAmount || (bidAmount && allowance?.gte(bidAmount)))
                        && <Button onClick={placeBid} disabled={!bidAmount || !bidAmount?.gt(0)} >Place Bid</Button>
                    }
                </div>
            }
            {ended && <Button onClick={claim} >Claim</Button>}
        </Container>
    )
}
