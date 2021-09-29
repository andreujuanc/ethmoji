import Button from "../../../../components/button";
import { useBlockNumber } from "../../../../hooks/useBlockNumber";
import { useContracts } from "../../../../hooks/useContracts";
import { Proposal } from "../../../../hooks/useProposals";
import { useProvider } from "../../../../hooks/useProvider";
import './index.scss'


export default function ProposalItem({ proposal }: { proposal: Proposal }): JSX.Element {

    const contracts = useContracts()
    const provider = useProvider()
    //const [currentBlockNumber, setCurrentBlockNumber] = useState<number>(0)
    const currentBlockNumber = useBlockNumber()

    // TO see if user has voted
    // hasVoted(proposalId, account)

    const vote = async (support: number) => {
        if (!contracts) return

        try {
            await contracts.dao.castVote(proposal.proposalId, support)

        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    return (
        <div style={{ marginBottom: '2.5rem', border: 'solid 5px #000', padding: '1rem', backgroundColor: '#444' }}>
            <div>Proposal: {proposal.proposalId.toString().substring(0, 5)}...{proposal.proposalId.toString().substr(proposal.proposalId.toString().length - 5, 5)}</div>
            {/* <div>{proposal.proposer.toString()}</div> */}
            <div style={{
                padding: '1rem',
                fontSize: '2rem',
                textAlign: 'center'
            }}>
                {proposal.description.toString()}
            </div>

            {(currentBlockNumber && proposal.startBlock.gt(currentBlockNumber)) ? (
                <div>Starts in {currentBlockNumber && proposal.startBlock.sub(currentBlockNumber).toString()} blocks</div>
            ) :
                (currentBlockNumber && proposal.endBlock.lt(currentBlockNumber)) ? (
                    <div>Ended  {currentBlockNumber && proposal.endBlock.sub(currentBlockNumber).toString()} blocks ago</div>
                ) : (<div>Voting ends in {currentBlockNumber && proposal.endBlock.sub(currentBlockNumber).toString()} blocks</div>)
            }

            <div className={'voteOptions'}>
                <Button onClick={() => vote(0)}>d=====(￣▽￣*)b</Button><br />
                <Button onClick={() => vote(1)}>(╯°□°）╯︵ ┻━┻</Button><br />
                <Button onClick={() => vote(2)}>(°ー°〃)</Button>
            </div>
        </div>
    )
}