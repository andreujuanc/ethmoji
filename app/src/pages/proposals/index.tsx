import { useWeb3React } from "@web3-react/core"
import addresses from '../../contracts/contract-address.json'
import { KaoDao__factory } from '../../contracts/factories/KaoDao__factory';
import { useEffect, useMemo, useState } from "react";
import { KaoDao } from "../../contracts/KaoDao";
import { BigNumber } from "ethers";
type Proposal = {
    proposalId: BigNumber;
    // proposer: string;
    // targets: string[];
    // values: BigNumber[];
    // signatures: string[];
    // calldatas: string[];
    // startBlock: BigNumber;
    // endBlock: BigNumber;
    // description: string;
}
export default function Proposals() {
    const { connector } = useWeb3React()
    const [dao, setDao] = useState<KaoDao>()
    const [proposals, setProposals] = useState<Proposal[]>([])

    const getKaoDao = useMemo(() => async () => {
        const provider = await connector?.getProvider()
        const kaoDao = await KaoDao__factory.connect(addresses.KaoDao, provider)

        const filter = dao?.filters?.ProposalCreated()
        if (filter) {
            const proposalsResult = await dao?.queryFilter(filter)
            setProposals(proposalsResult?.map((x) => ({
                proposalId: x.args.proposalId
            })) ?? [])
        }
        setDao(kaoDao)
    }, [addresses.KaoDao, connector])


    useEffect(() => {
        getKaoDao()
    }, [])

    return (
        <div>
            <h3>
                Proposals
            </h3>
            <section>
                {
                    proposals.map(x => (
                        <div>
                            {proposals}
                        </div>
                    ))
                }
            </section>
        </div>
    )
}