import { BigNumber } from "@ethersproject/bignumber";
import { parseUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useContracts } from "../../hooks/useContracts";
import { useSigner } from "../../hooks/useSigner";
import { useStaking } from "../../hooks/useStaking";
import { formatValue } from "../../utils/formatValue";

import './index.scss'

export default function ProposalsPage() {

    const staking = useStaking()
    const contracts = useContracts()
    const signer = useSigner()

    const [depositAmount, setDepositAmount] = useState<string>()
    const [withdrawAmount, setWithdrawAmount] = useState<string>()
    const [allowance, setAllowance] = useState<string>()
    const DECIMALS= 18

    const deposit = async () => {
        if (!depositAmount) return
        const tx = await contracts?.staking.stake(parseUnits(depositAmount, DECIMALS))
        await tx?.wait()
    }

    const withdraw = async () => {
        if (!withdrawAmount) return
        const tx = await contracts?.staking.withdraw(parseUnits(withdrawAmount, DECIMALS))
        await tx?.wait()
    }

    const increaseAllowance = async () => {
        if (!depositAmount) return
        const tx = await contracts?.token.approve(contracts.staking.address, parseUnits(depositAmount, DECIMALS))
        await tx?.wait()
    }

    const getAllowance = useCallback(async () => {
        const account = await signer?.getAddress()
        if (!account) return

        const allowed = await contracts?.token.allowance(account, contracts.staking.address)
        setAllowance(allowed?.toString())
    }, [signer, contracts])

    useEffect(() => {
        getAllowance()
    }, [signer, getAllowance])

    const allowed = depositAmount && allowance && BigNumber.from(allowance).gte(depositAmount || '0')

    return (
        <div className="page">
            <header>
                <h1>
                    Stake your KAOs
                </h1>
                <sub>Increase your slice of the pie when your proposed kaomoji is auctioned.</sub>
            </header>
            <br />
            <section>
                <div>Balance: {formatValue(staking.balance, '-- ')} KAO</div>
                <div>Staked: {formatValue(staking.staked, '-- ')}KAO</div>
                <div>Proposer Commission: {staking.multiplier?.toString() ?? '-- '}%</div>
            </section>
            <br />
            <section className="stake-section">
                <Input onChange={(value) => setDepositAmount(value)} placeholder={"Deposit Amount"} value={depositAmount ?? ""} type="number" />
                {allowed && <Button onClick={deposit} disabled={!depositAmount}>Deposit</Button>}
                {!allowed && <Button onClick={increaseAllowance}>Approve</Button>}
            </section>
            <section className="stake-section">
                <Input onChange={(value) => setWithdrawAmount(value)} placeholder={"Withdraw Amount"} value={withdrawAmount ?? ""} type="number" />
                <Button onClick={withdraw} disabled={!staking.staked || BigNumber.from(staking.staked || "0").lt(withdrawAmount ?? '0')}>Withdraw</Button>
            </section>
        </div>
    )
}