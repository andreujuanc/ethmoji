import Container from "../container";

export default function KaoMojiFrame({ data }: { data?: string }) {

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


