import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Button from "../../../../components/button";
import Container from "../../../../components/container";
import { KaoMojiFrame } from "../../../../components/kaomoji";
import { useBlockNumber } from "../../../../hooks/useBlockNumber";
import { useContracts } from "../../../../hooks/useContracts";
import { Proposal } from "../../../../hooks/useProposals";
import { useSigner } from "../../../../hooks/useSigner";
import './index.scss'

// FROM IGovernor
enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

enum VoteType {
    Against,
    For,
    Abstain
}

export default function ProposalItem({ proposal }: { proposal: Proposal }): JSX.Element {

    const contracts = useContracts()
    const provider = useSigner()
    const currentBlockNumber = useBlockNumber()
    const [voted, setVoted] = useState<boolean>()
    const [proposalState, setProposalState] = useState<ProposalState>()
    const [votes, setVotes] = useState<{ againstVotes: BigNumber, forVotes: BigNumber, abstainVotes: BigNumber }>()

    const vote = async (support: VoteType) => {
        if (!contracts) return

        try {
            const castTx = await contracts.dao.castVote(proposal.proposalId, support)
            await castTx.wait()

        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    const hasVoted = useCallback(async (currentBlockNumber?: number) => {
        if (!contracts || !currentBlockNumber) return
        const account = await provider?.getAddress()

        if (!account) return

        const hasVoted = await contracts.dao.hasVoted(proposal.proposalId, account)
        setVoted(hasVoted)

        const state = await contracts.dao.state(proposal.proposalId) as ProposalState
        setProposalState(state)

        const { againstVotes, forVotes, abstainVotes } = await contracts.dao.proposalVotes(proposal.proposalId)
        setVotes({ againstVotes, forVotes, abstainVotes })
    }, [contracts, provider, proposal, currentBlockNumber])

    const execute = async () => {
        if (!contracts) return
        const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(proposal.description))
        // TODO: For some reason values comes empty array in the prop
        const executionTx = await contracts.dao.execute(
            proposal.targets,
            (proposal as any)[3],
            proposal.calldatas,
            descriptionHash
        )
        await executionTx.wait()
    }


    const getProposalVotes = useCallback(async () => {
        if (!contracts) return
        // const filter = contracts.dao?.filters?.VoteCast()
        // if (filter) {
        //     const votesList = (await contracts.dao?.queryFilter(filter))//.filter(x => x.proposalId == proposal.proposalId)
        //     if (votesList.length > 0)
        //         console.log(votesList)
        //     // setProposals(proposalsResult?.map((x) => ({
        //     //     ...x.args
        //     // })) ?? [])
        // }
    }, [contracts])

    useEffect(() => {
        hasVoted(currentBlockNumber)
        getProposalVotes()
    }, [hasVoted, getProposalVotes, provider, contracts, currentBlockNumber])

    const ProposalStateComponent = (currentBlockNumber?: number, state?: ProposalState) => {
        if (currentBlockNumber && proposal.startBlock.gt(currentBlockNumber))
            return <div>Starts in {currentBlockNumber && proposal.startBlock.sub(currentBlockNumber).toString()} blocks</div>
        if (currentBlockNumber && state === ProposalState.Active)
            return <div>Voting ends in {proposal.endBlock.sub(currentBlockNumber).toString()} blocks</div>
        if (currentBlockNumber && proposal.endBlock.lt(currentBlockNumber))
            return <div>Ended  {proposal.endBlock.sub(currentBlockNumber).toString()} blocks ago</div>
        return null
    }
    
    return (
        <Container>
            {/* <div>{proposalState}</div>
            <div>{proposal.startBlock.toString()}</div>
            <div>{currentBlockNumber}</div> */}
            <div>Proposal: {proposal.proposalId.toString().substring(0, 5)}...{proposal.proposalId.toString().substr(proposal.proposalId.toString().length - 5, 5)}</div>
            {/* <div>{proposal.proposer.toString()}</div> */}
            <div style={{
                padding: '1rem',
                fontSize: '2rem',
                textAlign: 'center'
            }}>
                <KaoMojiFrame data={proposal.description.toString()} />
            </div>
            {ProposalStateComponent(currentBlockNumber, proposalState)}
            <br />
            {(proposalState === ProposalState.Active) &&
                <div className={'voteOptions'}>
                    <Button disabled={voted} onClick={() => vote(VoteType.For)}>d=====(￣▽￣*)b</Button><br />
                    <Button disabled={voted} onClick={() => vote(VoteType.Against)}>(╯°□°）╯︵ ┻━┻</Button><br />
                    <Button disabled={voted} onClick={() => vote(VoteType.Abstain)}>(°ー°〃)</Button>
                </div>
            }

            {
                proposalState === ProposalState.Defeated && 'Rejected ಥ_ಥ'
            }

            {
                proposalState === ProposalState.Succeeded &&
                <Button onClick={execute}>Execute</Button>
            }

            {
                proposalState === ProposalState.Queued && 'QUEUED'
            }

            {
                proposalState === ProposalState.Executed && 'EXECUTED'
            }

            {
                votes && (<div>
                    <div>For: {ethers.utils.formatUnits(votes.forVotes.toString(), 18)}</div>
                    <div>Against: {ethers.utils.formatUnits(votes.againstVotes.toString(), 18)}</div>
                    <div>Abstain: {ethers.utils.formatUnits(votes.abstainVotes.toString(), 18)}</div>
                </div>)
            }
        </Container>
    )
}