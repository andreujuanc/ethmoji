import { BigNumber } from "@ethersproject/bignumber";
import { useState } from "react";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useContracts } from "../../hooks/useContracts";
import useProposals from "../../hooks/useProposals";
import { useStaking } from "../../hooks/useStaking";

export default function ProposalsPage() {

    const staking = useStaking()
    const contracts = useContracts()

    const [depositAmount, setDepositAmount] = useState<string>()
    const [withdrawAmount, setWithdrawAmount] = useState<string>()

    const deposit = async () => {
        if (!depositAmount) return
        const tx = await contracts?.staking.stake(depositAmount)
    }

    const withdraw = async () => {
        if (!withdrawAmount) return
        const tx = await contracts?.staking.withdraw(withdrawAmount)
    }


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
                <div>Balance: {staking.balance?.toString() ?? '--'} KAO</div>
                <div>Staked: {staking.staked?.toString() ?? '--'}KAO</div>
                <div>Proposer Fee Multiplier: {staking.multiplier?.toString() ?? '--'}%</div>
            </section>
            <br />
            <section>
                <Input onChange={(value) => setDepositAmount(value)} placeholder={"Amount"} value={""} type="number" /><Button onClick={deposit}>Deposit</Button>
            </section>
            <section>
                <Input onChange={(value) => setWithdrawAmount(value)} placeholder={"Amount"} value={""} type="number" /><Button onClick={withdraw}>Withdraw</Button>
            </section>
        </div>
    )
}