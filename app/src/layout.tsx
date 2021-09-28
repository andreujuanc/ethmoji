import { Link } from 'react-router-dom'

export function Layout({ children }: { children: any }) {
    return (
        <div className="App">
            <header className="App-header">
                <nav>
                    <Link to="/">
                        Home
                    </Link>
                    <Link to="/gallery">
                        Gallery
                    </Link>
                    <Link to="/proposals">
                        Proposals
                    </Link>
                    <Link to="/auctions">
                        Auction
                    </Link>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}