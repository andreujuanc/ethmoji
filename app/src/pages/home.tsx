import { KaoMojiCard } from "../components/kaomoji"
import useKaoMojis from "../hooks/useKaoMojis"
import { Logo } from "../components/logo"
import { Link } from "react-router-dom"

export default function HomePage() {
    const kaoMojis = useKaoMojis(true)

    return (
        <div className="page">
            <Logo />
            <br />
            <div style={{
                display: 'flex'
            }}>
                {
                    kaoMojis.map(x => (<KaoMojiCard key={x.id.toString()} item={x} />))
                }
                {kaoMojis.length === 0 && (<div>
                    <p>You don't own any KaoMojis.</p>
                    <p> Head over the <Link to={"/auctions"}>auction house</Link> and bid for your favourite one ( $ _ $ )</p>
                </div>)}
            </div>
        </div>
    )
}


