import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useMemo } from 'react'
import Button from '../../components/button'

const injected = new InjectedConnector({
    supportedChainIds: [
        //1, 3, 4, 5, 42
        31337
    ]
})

export default function Connect() {
    const { activate, active, deactivate, account } = useWeb3React()
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
        <Button onClick={active ? disconnect : connect}>
            {active ? "Disconnect: " + formattedAccount : "Connect"}
        </Button>
    )
}