import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useMemo } from 'react'

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

    const formattedAccount = useMemo(() => {
        return `${account?.substr(0, 6)}...${account?.substr(account.length - 4, 4)}`
    }, [account])

    return (
        <button onClick={active ? disconnect : connect}>
            {active ? "Disconnect: " + formattedAccount + ' ChainID: ' + chainId : "Connect"}
        </button>
    )
}