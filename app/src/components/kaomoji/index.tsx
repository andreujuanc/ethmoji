import { KaoMojiItem } from "../../hooks/useKaoMojis";
import Container from "../container";

export default function KaoMoji({ item }: { item: KaoMojiItem }) {

    // const kaoMoji = useEnhanceKaoMoji(item)
    // console.log(kaoMoji)
    return (
        <Container>
            {/* <div>{kaoMoji.id?.toString()}</div>
            <div>{kaoMoji.owned}</div>
            <div>{kaoMoji.data}</div> */}
        </Container>

    )
}


