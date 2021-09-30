import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "./useContracts";

export type Proposal = {
    proposalId: BigNumber;
    proposer: string;
    targets: string[];
    values: BigNumber[];
    signatures: string[];
    calldatas: string[];
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
}


export default function useProposals() {
    const [proposals, setProposals] = useState<Proposal[]>([])
    const contracts = useContracts()
    const getKaoDao = useMemo(() => async () => {
        if (!contracts) return
        const filter = contracts.dao?.filters?.ProposalCreated()
        if (filter) {
            const proposalsResult = await contracts.dao?.queryFilter(filter)
            setProposals(proposalsResult?.map((x) => ({
                ...x.args
            })) ?? [])
        }

    }, [contracts])

    useEffect(() => {
        getKaoDao()
    }, [contracts, getKaoDao])

    return proposals
}