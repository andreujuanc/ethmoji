import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { useContracts } from "./useContracts"
import { useSigner } from "./useSigner"
import { BigNumber } from "@ethersproject/bignumber"


export function useStaking() {
    const contracts = useContracts()
    const { account } = useWeb3React()
    const signer = useSigner()
    const [staked, setStaked] = useState<BigNumber>()
    const [balance, setBalance] = useState<BigNumber>()
    const [multiplier, setMultiplier] = useState<BigNumber>()
    const [allowance, setAllowance] = useState<BigNumber>()

    useEffect(() => {
        const getBalance = async () => {
            const address = await signer?.getAddress()
            if (!address) return
            const kaoBalance = await contracts?.token.balanceOf(address)
            setBalance(kaoBalance)
        }

        const getStaking = async () => {
            const address = await signer?.getAddress()
            if (!address) return
            const staked = await contracts?.staking.balanceOf(address)
            setStaked(staked)
        }

        const getMultiplier = async () => {
            const address = await signer?.getAddress()
            if (!address) return
            const multiplier = await contracts?.staking.getRewardsMultiplier(address)
            setMultiplier(multiplier)
        }

        const getAllowance = async () => {
            const account = await signer?.getAddress()
            if (!account) return

            const allowed = await contracts?.token.allowance(account, contracts.staking.address)
            setAllowance(allowed)
        }

        getBalance()
        getStaking()
        getMultiplier()
        getAllowance()

        const multiplierInterval = setInterval(getMultiplier, 5000)
        contracts?.token.on("Transfer(address,address,uint256)", getBalance)
        contracts?.staking.on('Staked(address,uint256)', getStaking)
        contracts?.staking.on('Withdrawn(address,uint256)', getStaking)
        contracts?.token.on('Approval(address,address,uint256)', getAllowance) //indexed owner, indexed spender, value

        return () => {
            clearInterval(multiplierInterval)
            contracts?.token.off("Transfer(address,address,uint256)", getBalance)
            contracts?.staking.off('Staked(address,uint256)', getStaking)
            contracts?.staking.off('Withdrawn(address,uint256)', getStaking)
            contracts?.token.off('Approval(address,address,uint256)', getAllowance)
        }
    }, [contracts, signer, account])

    return {
        balance,
        staked,
        multiplier,
        allowance
    };

}