import { BigNumber } from "@ethersproject/bignumber";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/button";
import Container from "../../components/container";
import { Input } from "../../components/input";
import useAuctions, { Auction } from "../../hooks/useAuctions";
import { useContracts } from "../../hooks/useContracts";
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

    const getAuction = useCallback(async () => {
        const auctionData = await contracts?.auction.auctions(props.auction.auctionId)

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
        console.log('allowance', allowance)
        setAllowance(allowance)
    }, [signer, contracts])

    useEffect(() => {
        getAuction()
        getAllowance()
    }, [signer])

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

    return (
        <Container>
            <div>
                Auction Id {auction.auctionId.toString()}
            </div>
            <div>
                Token Id {auction.tokenId?.toString()}
            </div>
            <div>
                Duration {auction.duration?.toString()}
            </div>
            <div>
                Amount {auction.amount?.toString()}
            </div>
            {
                auction && (auction.firstBidTime.eq(0) || BigNumber.from(Date.now()).lt(auction.firstBidTime.add(auction.duration))) &&
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
                    {bidAmount && allowance?.gte(bidAmount)
                        && <Button onClick={placeBid} disabled={!bidAmount || !bidAmount?.gt(0)} >Place Bid</Button>}
                </div>
            }
        </Container>
    )
}
