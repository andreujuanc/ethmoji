import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useMemo } from 'react'
import Button from '../../components/button'
import { Networks, SUPPORTED_NETWORKS } from '../../core/networks'



const injected = new InjectedConnector({
    supportedChainIds: SUPPORTED_NETWORKS
})

export default function Connect() {
    const { activate, active, deactivate, account, chainId } = useWeb3React()
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

    const onChainChanged = () => {

    }

    const formattedAccount = useMemo(() => {
        return `${account?.substr(0, 6)}...${account?.substr(account.length - 4, 4)}`
    }, [account])

    return (
        <span style={{display: 'flex'}}>
            {active && <div className="white-shadow-1" style={{
                padding: '0.25rem 0.75rem',
                margin: '0 5px 5px 0px',
                lineHeight: '0.75'
            }}>
                {chainId && Networks[chainId] ? Networks[chainId] : "Invalid Network"}
            </div>}
            <Button onClick={active ? disconnect : connect} lineHeight={0.75}>
                {active ? "Disconnect: " + formattedAccount : "Connect"}
            </Button>

        </span>
    )
}