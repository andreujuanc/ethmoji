import { BigNumber } from "@ethersproject/bignumber"
import { ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import './balance.css'

export default function Balance() {
    const contracts = useContracts()
    const signer = useSigner()
    const [balance, setBalance] = useState<{ kao?: BigNumber, eth?: BigNumber }>()

    const getBalance = useCallback(async () => {
        const address = await signer?.getAddress()
        if (!address) return
        const kaoBalance = await contracts?.token.balanceOf(address)
        const ethBalance = await signer?.getBalance()
        setBalance({
            kao: kaoBalance,
            eth: ethBalance
        })
    }, [contracts, signer])

    useEffect(() => {
        getBalance()
    }, [getBalance, contracts, signer])

    return (
        <div className="balanceContainer">
            <div>
                {balance?.kao ? ethers.utils.formatUnits(balance.kao, 18) : '--'} KAO
            </div>
            <div>
                {balance?.eth ? ethers.utils.formatUnits(balance.eth, 18) : '--'} ETH
            </div>
        </div>
    )
}