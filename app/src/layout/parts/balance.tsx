import { BigNumber, formatFixed } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import './balance.css'

export default function Balance() {
    const contracts = useContracts()
    const { account } = useWeb3React()
    const signer = useSigner()
    const [balance, setBalance] = useState<{ kao?: BigNumber, eth?: BigNumber }>()



    useEffect(() => {
        const getBalance = async () => {
            const address = await signer?.getAddress()
            if (!address) return
            const kaoBalance = await contracts?.token.balanceOf(address)
            const ethBalance = await signer?.getBalance()
            setBalance({
                kao: kaoBalance,
                eth: ethBalance
            })
        }

        getBalance()
        //const filter = contracts?.token.filters["Transfer(address,address,uint256)"]
        contracts?.token.on("Transfer(address,address,uint256)", getBalance)
        return () => {
            contracts?.token.off("Transfer(address,address,uint256)", getBalance)
        }
    }, [contracts, signer, account])

    const format = (value: BigNumber) => {
        if (!value) return value
        const parts = formatFixed(value, 18).split('.')

        return `${parts[0]}.${(parts[1] ?? '').substr(0, 4)}`
    }

    return (
        <div className="balanceContainer">
            <div className={'kaoBalance'}>
                {balance?.kao ? format(balance.kao) : '--'} KAO
            </div>
            <div>
                {balance?.eth ? format(balance.eth) : '--'} ETH
            </div>
        </div>
    )
}