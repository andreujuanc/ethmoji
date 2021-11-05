import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import Button from '../../components/button'
import { Networks } from '../../core/networks'
import { AbstractConnector } from '@web3-react/abstract-connector'

import './connect.scss'
import { useEagerConnect } from '../../hooks/useEagerConnect'
import { injected, walletconnect } from '../../core/connectors'


export default function Connect() {
    const { activate, active, deactivate, account, chainId, error, setError } = useWeb3React<ethers.providers.Web3Provider>()
    const [showProviderModal, setShowProviderModal] = useState(false)
    const triedEager = useEagerConnect()

    async function connect(connector: AbstractConnector) {
        try {
            await activate(connector)
            console.log('Connected.Active?', active)
            //setShowProviderModal(false)
        } catch (ex) {
            console.error(ex)
            await deactivate()
        }
    }
    const disconnect = async () => {
        await deactivate()
    }

    const formattedAccount = useMemo(() => {
        return `${account?.substr(0, 6)}...${account?.substr(account.length - 4, 4)}`
    }, [account])

    console.log(active, account, chainId, error)

    return (
        <span style={{ display: 'flex' }}>
            {active && <div className="white-shadow-1" style={{
                padding: '0.25rem 0.75rem',
                margin: '0 5px 5px 0px',
                lineHeight: '0.75'
            }}>
                {chainId && Networks[chainId] ? Networks[chainId] : "Invalid Network"}
            </div>}

            <Button onClick={() => active ? disconnect() : setShowProviderModal(true)} lineHeight={0.75}>
                {active ? "Disconnect: " + formattedAccount : "Connect"}
            </Button>

            {!active && showProviderModal && (
                <div className="connect-modal">
                    <div className="content black-shadow-3">
                        <span>
                            Connect with your preferred wallet
                        </span>
                        <br />
                        <Button onClick={() => connect(injected)}>
                            Metamask
                        </Button>
                        <Button onClick={() => connect(walletconnect)}>
                            WalletConnnect
                        </Button>
                        <br />
                        <Button onClick={() => setShowProviderModal(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}

            {error && (
                <div className="connect-modal">
                    <div className="content black-shadow-3">
                        <span>
                            {error.message}
                        </span>
                        
                        <br />
                        <Button onClick={() => setError(undefined as any)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}

        </span>
    )
}