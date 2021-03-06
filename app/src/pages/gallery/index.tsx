import { KaoMojiCard } from "../../components/kaomoji"
import useKaoMojis from "../../hooks/useKaoMojis"

export default function GalleryPage() {
    const kaoMojis = useKaoMojis(false)

    return (
        <div>
            <header>
                <h1>
                    Gallery
                </h1>
                <sub>The Kaoverse (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</sub>
            </header>
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


