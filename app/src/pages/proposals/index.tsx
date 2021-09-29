import ProposalItem from "./parts/item";
import useProposals from "../../hooks/useProposals";
import Propose from './parts/propose';

export default function Proposals() {
    const proposals = useProposals()

    return (
        <div>
            <h3>
                Proposals
            </h3>
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