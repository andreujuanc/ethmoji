import { useEffect, useState } from "react";
import { useContracts } from "../../../../hooks/useContracts";
import { Proposal } from "../../../../hooks/useProposals";
import { useProvider } from "../../../../hooks/useProvider";

export default function ProposalItem({ proposal }: { proposal: Proposal }): JSX.Element {

    const contracts = useContracts()
    const provider = useProvider()
    const [currentBlockNumber, setCurrentBlockNumber] = useState<number>(0)

    const vote = async (support: number) => {
        if (!contracts) return

        try {
            await contracts.dao.castVote(proposal.proposalId, support)

        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    const updateBlockNumber = async () => {
        debugger;
        const blockNumber = await provider?.getBlockNumber()
        setCurrentBlockNumber(blockNumber ?? 0)
    }

    useEffect(() => {
        updateBlockNumber()
    })

    const isEnabled = proposal.startBlock.gt(currentBlockNumber)

    return (
        <div>
            <div>Enabled: {isEnabled}</div>
            <div>{proposal.proposalId.toString()}</div>
            <div>{proposal.proposer.toString()}</div>
            <div>{proposal.description.toString()}</div>
            <div>
                <button onClick={() => vote(0)}>d=====(￣▽￣*)b</button>
                <button onClick={() => vote(1)}>(╯°□°）╯︵ ┻━┻</button>
                <button onClick={() => vote(2)}>(°ー°〃)</button>
            </div>
        </div>
    )
}