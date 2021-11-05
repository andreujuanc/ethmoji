import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import './balance.css'
import { formatValue } from "../../utils/formatValue"

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

    return (
        <div className="balanceContainer">
            <div className={'kaoBalance'}>
                {formatValue(balance?.kao, '-- ')} KAO
            </div>
            <div>
                {formatValue(balance?.eth, '-- ')} ETH
            </div>
        </div>
    )
}


