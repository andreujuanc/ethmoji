import ProposalItem from "./parts/item";
import useProposals from "../../hooks/useProposals";
import Propose from './parts/propose';

export default function ProposalsPage() {
    const proposals = useProposals()

    return (
        <div style={{
            maxWidth: '600px',
            minWidth: '600px',
        }}>
            <h1>
                Proposals
            </h1>
            <Propose />
            <br />
            <section>
                {
                    proposals.map(x => <ProposalItem key={x.proposalId.toString()} proposal={x} />)
                }
            </section>
        </div>
    )
}