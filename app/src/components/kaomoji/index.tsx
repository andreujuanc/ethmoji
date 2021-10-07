import { KaoMojiItem, useEnhanceKaoMoji } from "../../hooks/useKaoMoji";
import { KaoMojiId } from "../../hooks/useKaoMojis";
import Container from "../container";

export function KaoMojiFrame({ data }: { data?: string }) {

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: '1.5rem'
            }}
        >
            <Container style={{
                backgroundColor: '#282828',
                textAlign: 'center',
                marginBottom: 'inherit',
                boxShadow: 'none'
            }}>
                {data}
            </Container>
        </div >

    )
}

export function KaoMojiCard({ item }: { item: KaoMojiItem }) {
    const kao = useEnhanceKaoMoji(item)

    return (
        <Container>
            <KaoMojiFrame data={kao.data} />
        </Container>

    )
}



