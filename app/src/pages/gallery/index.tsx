import { ethers } from "ethers"
import Button from "../../components/button"
import { KaoMojiCard } from "../../components/kaomoji"
import { useContracts } from "../../hooks/useContracts"
import useKaoMojis from "../../hooks/useKaoMojis"
import { useSigner } from "../../hooks/useSigner"
import { Logo } from "../../components/logo"

export default function GalleryPage() {
    const kaoMojis = useKaoMojis(true)
    const signer = useSigner()
    const contracts = useContracts()

    return (
        <div>
            <h1>Gallery</h1>
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


