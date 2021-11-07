import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'

import './App.css'
import { Messages } from './components/messages'
import { MessagesProvider } from './contexts/messages'
import { Routes } from './Routes'

function getLibrary(provider: any, connector: any) {
  return new ethers.providers.Web3Provider(provider)
}

export default function App() {
  return (
    <MessagesProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Routes />
        <Messages />
      </Web3ReactProvider>
    </MessagesProvider>
  )
}