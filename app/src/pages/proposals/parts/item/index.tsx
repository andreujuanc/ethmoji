import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Button from "../../../../components/button";
import Container from "../../../../components/container";
import { useBlockNumber } from "../../../../hooks/useBlockNumber";
import { useContracts } from "../../../../hooks/useContracts";
import { Proposal } from "../../../../hooks/useProposals";
import { useProvider } from "../../../../hooks/useProvider";
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
    const [proposalState, setState] = useState<ProposalState>()
    const [votes, setVotes] = useState<{ againstVotes: BigNumber, forVotes: BigNumber, abstainVotes: BigNumber }>()

    const vote = async (support: VoteType) => {
        if (!contracts) return

        try {
            console.log('Voting', support)
            const castTx = await contracts.dao.castVote(proposal.proposalId, support)
            await castTx.wait()

        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    const hasVoted = useCallback(async () => {
        if (!contracts) return
        const account = await provider?.getAddress()

        if (!account) return

        const hasVoted = await contracts.dao.hasVoted(proposal.proposalId, account)
        setVoted(hasVoted)

        const state = await contracts.dao.state(proposal.proposalId) as ProposalState
        setState(state)

        const { againstVotes, forVotes, abstainVotes } = await contracts.dao.proposalVotes(proposal.proposalId)
        setVotes({ againstVotes, forVotes, abstainVotes })
    }, [contracts, provider])

    const execute = async () => {
        if (!contracts) return
        debugger;
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


    const getProposalVotes = async () => {
        if (!contracts) return
        const filter = contracts.dao?.filters?.VoteCast()
        // if (filter) {
        //     const votesList = (await contracts.dao?.queryFilter(filter))//.filter(x => x.proposalId == proposal.proposalId)
        //     if (votesList.length > 0)
        //         console.log(votesList)
        //     // setProposals(proposalsResult?.map((x) => ({
        //     //     ...x.args
        //     // })) ?? [])
        // }
    }

    useEffect(() => {
        hasVoted()
        getProposalVotes()
    }, [hasVoted, provider, contracts])

    return (
        <Container>
            <div>Proposal: {proposal.proposalId.toString().substring(0, 5)}...{proposal.proposalId.toString().substr(proposal.proposalId.toString().length - 5, 5)}</div>
            {/* <div>{proposal.proposer.toString()}</div> */}
            <div style={{
                padding: '1rem',
                fontSize: '2rem',
                textAlign: 'center'
            }}>
                {proposal.description.toString()}
            </div>

            {(proposalState == ProposalState.Pending && currentBlockNumber && proposal.startBlock.gt(currentBlockNumber)) ? (
                <div>Starts in {currentBlockNumber && proposal.startBlock.sub(currentBlockNumber).toString()} blocks</div>
            ) :
                (currentBlockNumber && proposal.endBlock.lt(currentBlockNumber)) ? (
                    <div>Ended  {currentBlockNumber && proposal.endBlock.sub(currentBlockNumber).toString()} blocks ago</div>
                ) : (<div>Voting ends in {currentBlockNumber && proposal.endBlock.sub(currentBlockNumber).toString()} blocks</div>)
            }
            <br />
            {(proposalState == ProposalState.Active) &&
                <div className={'voteOptions'}>
                    <Button disabled={voted} onClick={() => vote(VoteType.For)}>d=====(￣▽￣*)b</Button><br />
                    <Button disabled={voted} onClick={() => vote(VoteType.Against)}>(╯°□°）╯︵ ┻━┻</Button><br />
                    <Button disabled={voted} onClick={() => vote(VoteType.Abstain)}>(°ー°〃)</Button>
                </div>
            }

            {
                proposalState == ProposalState.Defeated && 'Rejected ಥ_ಥ'
            }

            {
                proposalState == ProposalState.Succeeded &&
                <Button onClick={execute}>Execute</Button>
            }

            {
                proposalState == ProposalState.Queued && 'QUEUED'
            }

            {
                proposalState == ProposalState.Executed && 'EXECUTED'
            }

            {
                votes && (<div>
                    <div>For: {votes.forVotes.toString()}</div>
                    <div>Against: {votes.againstVotes.toString()}</div>
                    <div>Abstain: {votes.abstainVotes.toString()}</div>
                </div>)
            }
        </Container>
    )
}