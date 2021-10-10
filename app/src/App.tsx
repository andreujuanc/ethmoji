import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { Layout } from './layout'
import HomePage from './pages/home'
import ProposalsPage from './pages/proposals'

import './App.css'
import Auctions from './pages/auctions'
import BuyKaoPage from './pages/buy'
import GalleryPage from './pages/gallery'

function getLibrary(provider: any, connector: any) {
  return new ethers.providers.Web3Provider(provider)
}

export default function App() {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HashRouter>
        <Layout>
          <Switch  >

            <Route exact path="/" >
              <HomePage />
            </Route>

            <Route exact path="/gallery" >
              <GalleryPage />
            </Route>

            <Route exact path="/proposals" >
              <ProposalsPage />
            </Route>

            <Route exact path="/auctions" >
              <Auctions />
            </Route>

            <Route exact path="/buy" >
              <BuyKaoPage />
            </Route>

            <Route path="*" >
              404 ಥ_ಥ
            </Route>
          </Switch>
        </Layout>
      </HashRouter>
    </Web3ReactProvider>
  )
}