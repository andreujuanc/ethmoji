import { BigNumber } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProposalCreatedEvent } from "../contracts/KaoDao";
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
            const proposals: Proposal[] = proposalsResult?.map((x) => ({
                ...x.args
            })) ?? []


            setProposals(proposals.sort((a, b) => b?.startBlock.toNumber() - a?.startBlock?.toNumber()))
        }

    }, [contracts])

    const subscribeToProposalCreated = useCallback(() => {
        getKaoDao()
        contracts?.dao.on('ProposalCreated', (e: ProposalCreatedEvent) => {
            console.log('proposalId', e.proposalId)
            getKaoDao()
        })
        return () => {
            console.log('CLEANUP')
        }
    }, [contracts, getKaoDao])

    useEffect(() => {
        return subscribeToProposalCreated()
    }, [contracts, subscribeToProposalCreated])

    return proposals
}