import { ethers } from "ethers"
import Button from "../components/button"
import { KaoMojiCard } from "../components/kaomoji"
import { useContracts } from "../hooks/useContracts"
import useKaoMojis from "../hooks/useKaoMojis"
import { useSigner } from "../hooks/useSigner"
import { Logo } from "../components/logo"

export default function HomePage() {
    const kaoMojis = useKaoMojis(true)
    const signer = useSigner()
    const contracts = useContracts()

    const mint = async () => {
        const address = await signer?.getAddress()
        if (!address) return
        const data = ethers.utils.toUtf8Bytes('(＃°Д°)')
        await contracts?.moji.mint(data)

    }
    console.log("kaoMojis", kaoMojis)
    return (
        <div>
            <Logo />
            <div>
                <Button onClick={mint}  >
                    Test Mint
                </Button>
            </div>
            <br />
            <div style={{
                display: 'flex'
            }}>
                {
                    kaoMojis.map(x => (<KaoMojiCard key={x.id.toString()} item={x} />))
                }
            </div>
        </div>
    )
}


