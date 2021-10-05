import useAuctions from "../../hooks/useAuctions";

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
                    auctions.map(x=>x.toString())
                }
            </section>
        </div>
    )
}