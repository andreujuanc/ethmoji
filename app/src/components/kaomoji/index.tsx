import { KaoMojiItem, useEnhanceKaoMoji } from "../../hooks/useKaoMoji";
import Container from "../container";

export function KaoMojiFrame({ data }: { data?: string }) {

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: '1rem'
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
        <Container style={{
            width: '250px',
            height: '230px'
        }}>
            <div>#{item.id.toString()}</div>
            <KaoMojiFrame data={kao.data} />
        </Container>

    )
}



