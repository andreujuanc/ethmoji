
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Networks, SUPPORTED_NETWORKS } from './networks'


export const injected = new InjectedConnector({
    supportedChainIds: SUPPORTED_NETWORKS
})

export const walletconnect = new WalletConnectConnector({
    rpc: { [Networks.LOCALHOST]: 'http://localhost:8545' },
    supportedChainIds: SUPPORTED_NETWORKS,
    //chainId: 31337,
})