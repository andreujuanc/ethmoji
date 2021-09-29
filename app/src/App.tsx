import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Layout } from './layout'
import HomePage from './pages/home'
import Proposals from './pages/proposals'

import './App.css'

function getLibrary(provider: any, connector: any) {
  console.log(provider, connector)
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

            <Route path="*" >
              404
            </Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    </Web3ReactProvider>
  )
}