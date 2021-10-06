import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Layout } from './layout'
import HomePage from './pages/home'
import Proposals from './pages/proposals'

import './App.css'
import Auctions from './pages/auctions'
import BuyKaoPage from './pages/buy'

function getLibrary(provider: any, connector: any) {
  console.log('getLibrary', provider, connector)
  return new ethers.providers.Web3Provider(provider)
}

export default function App() {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <Layout>
          <Switch  >

            <Route exact path="/" >
              <HomePage />
            </Route>
            <Route exact path="/proposals" >
              <Proposals />
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
      </BrowserRouter>
    </Web3ReactProvider>
  )
}