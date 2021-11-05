import { BigNumber } from "@ethersproject/bignumber";
import { useState } from "react";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useContracts } from "../../hooks/useContracts";
import { useStaking } from "../../hooks/useStaking";
import { formatValue } from "../../utils/formatValue";

import './index.scss'

export default function ProposalsPage() {

    const staking = useStaking()
    const contracts = useContracts()

    const [depositAmount, setDepositAmount] = useState<string>()
    const [withdrawAmount, setWithdrawAmount] = useState<string>()
    const [allowance, setAllowance] = useState<string>()

    const deposit = async () => {
        if (!depositAmount) return
        const tx = await contracts?.staking.stake(depositAmount)
    }

    const withdraw = async () => {
        if (!withdrawAmount) return
        const tx = await contracts?.staking.withdraw(withdrawAmount)
    }

    const increaseAllowance = async () => {
        if (!depositAmount) return
        const tx = await contracts?.token.approve(contracts.staking.address, depositAmount)
    }

    const allowed = allowance && depositAmount && BigNumber.from(allowance).gte(depositAmount)
    console.log(allowed, depositAmount, withdrawAmount)
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
                <div>Proposer Fee Multiplier: {staking.multiplier?.toString() ?? '-- '}%</div>
            </section>
            <br />
            <section className="stake-section">
                <Input onChange={(value) => setDepositAmount(value)} placeholder={"Deposit Amount"} value={depositAmount ?? ""} type="number" />
                {allowed && <Button onClick={deposit}>Deposit</Button>}
                {!allowed && <Button onClick={increaseAllowance}>Approve</Button>}
            </section>
            <section className="stake-section">
                <Input onChange={(value) => setWithdrawAmount(value)} placeholder={"Withdraw Amount"} value={withdrawAmount ?? ""} type="number" />
                <Button onClick={withdraw} disabled={!staking.staked || BigNumber.from(staking.staked ?? "0").lt(withdrawAmount ?? '0')}>Withdraw</Button>
            </section>
        </div>
    )
}