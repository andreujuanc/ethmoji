import { ethers } from "ethers"
import Button from "../components/button"
import KaoMoji from "../components/kaomoji"
import { useContracts } from "../hooks/useContracts"
import useKaoMoji from "../hooks/useKaoMojis"
import { useSigner } from "../hooks/useSigner"

export default function HomePage() {
    const kaoMojis = useKaoMoji()
    const signer = useSigner()
    const contracts = useContracts()

    const mint = async () => {
        const address = await signer?.getAddress()
        if (!address) return
        const data = ethers.utils.toUtf8Bytes('HOLA')
        await contracts?.moji.mint(data)

    }
    console.log("kaoMojis", kaoMojis)
    return (
        <div>
            <div>
                Home Page
            </div>
            <div>
                <Button onClick={mint}  >
                    Test Mint
                </Button>
            </div>
            <br />
            <div>
                {/* {
                    kaoMojis.map(x => (<KaoMoji key={x.id.toString()} item={x} />))
                } */}
            </div>
        </div>
    )
}