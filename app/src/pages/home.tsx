import { KaoMojiCard } from "../components/kaomoji"
import useKaoMojis from "../hooks/useKaoMojis"
import { Logo } from "../components/logo"

export default function HomePage() {
    const kaoMojis = useKaoMojis(true)
    
    return (
        <div>
            <Logo />
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


