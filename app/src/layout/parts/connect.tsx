import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

const injected = new InjectedConnector({
    supportedChainIds: [
        //1, 3, 4, 5, 42
        31337
    ]
})

export default function Connect() {
    const { activate, active, chainId, deactivate, account } = useWeb3React()
    const connect = async () => {
        await activate(injected)
    }
    const disconnect = async () => {
        await deactivate()
    }

    return (
        <button onClick={active ? disconnect : connect}>
            {active ? "Disconnect: " + chainId + " " + account : "Connect"}
        </button>
    )
}