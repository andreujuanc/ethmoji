import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "../../components/container";
import useAuctions, { Auction } from "../../hooks/useAuctions";
import { useContracts } from "../../hooks/useContracts";

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
                    auctions.map((a) => (<AuctionItem auction={a} />))
                }
            </section>
        </div>
    )
}

function AuctionItem(props: { auction: Auction }): JSX.Element {
    const [auction, setAuction] = useState<Auction>(props.auction)
    const contracts = useContracts()

    const getAuction = useCallback(() => {
        contracts?.auction.auctions(props.auction.auctionId)
    }, [auction])

    useEffect(() => {
        getAuction()
    }, [getAuction])

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
                Duration {auction.amount?.toString()}
            </div>
        </Container>
    )
}
