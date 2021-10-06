import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useMemo } from 'react'
import Button from '../../components/button'

const injected = new InjectedConnector({
    supportedChainIds: [
        //1,  //Mainnet
        3, //Ropsten
        // 4, // Rinkeby not supported by paraswap
        //136, //Polygon
        31337  //Local
    ]
})

export default function Connect() {
    const { activate, active, deactivate, account } = useWeb3React()
    const connect = async () => {
        try {
            await activate(injected)
        } catch {
            await deactivate()
        }
    }
    const disconnect = async () => {
        await deactivate()
    }

    const formattedAccount = useMemo(() => {
        return `${account?.substr(0, 6)}...${account?.substr(account.length - 4, 4)}`
    }, [account])

    return (
        <Button onClick={active ? disconnect : connect} lineHeight={0.75}>
            {active ? "Disconnect: " + formattedAccount : "Connect"}
        </Button>
    )
}