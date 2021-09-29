import addresses from '../../contracts/contract-address.json'

import { ethers } from "ethers";
import ProposalItem from "./parts/item";
import useProposals from "../../hooks/useProposals";
import { useContracts } from "../../hooks/useContracts";

export default function Proposals() {
    const contracts = useContracts()
    const proposals = useProposals()


    const proposeKao = async () => {
        const auction = '0xD200D7d095D3aE3fF5e29e721E3825c568A9aDDE'// TODO
        const data = ethers.utils.toUtf8Bytes('ಠ╭╮ಠ')
        const callData = contracts?.moji.interface.encodeFunctionData('mint', [auction, 1, data])

        if (!callData) throw new Error('Could not create proposal')

        try {
            const tx = await contracts?.dao.propose([addresses.KaoToken], [0], [callData], 'ಠ╭╮ಠ')
            await tx?.wait()
        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }


    return (
        <div>
            <h3>
                Proposals <button onClick={proposeKao} >Propose Kao</button>
            </h3>
            <section>
                {
                    proposals.map(x => <ProposalItem key={x.proposalId.toString()} proposal={x} />)
                }
            </section>
        </div>
    )
}