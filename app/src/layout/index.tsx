import { Link } from 'react-router-dom'
import Balance from './parts/balance'
import Connect from './parts/connect'
import './index.css'

export function Layout({ children }: { children: any }) {
    
    return (
        <div className="App">
            <header className="header">
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
                <Balance />
                <div>
                    <Connect />
                </div>
            </header>
            <main style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                {children}
            </main>
        </div>
    )
}