import { useWeb3React } from "@web3-react/core"
import addresses from '../../contracts/contract-address.json'

import { KaoDao__factory } from '../../contracts/factories/KaoDao__factory';
import { KaoMoji__factory } from "../../contracts/factories/KaoMoji__factory";

import { KaoDao } from "../../contracts/KaoDao";
import { KaoMoji } from "../../contracts/KaoMoji";


import { useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";


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
    const { connector, library, active } = useWeb3React()
    const [contracts, setContracts] = useState<{ dao: KaoDao, moji: KaoMoji }>()
    const [proposals, setProposals] = useState<Proposal[]>([])



    const getKaoDao = useMemo(() => async () => {
        const provider = await connector?.getProvider();
        if (!provider) return

        const account = await connector?.getAccount()
        const signer = library && await library.getSigner(account).connectUnchecked()

        const dao = KaoDao__factory.connect(addresses.KaoDao, signer);
        const moji = KaoMoji__factory.connect(addresses.KaoMoji, signer);



        const filter = dao?.filters?.ProposalCreated()
        if (filter) {
            debugger;
            const proposalsResult = await dao?.queryFilter(filter)
            setProposals(proposalsResult?.map((x) => ({
                proposalId: x.args.proposalId
            })) ?? [])
        }
        setContracts({ dao, moji })
    }, [addresses.KaoDao, addresses.KaoMoji, connector, library, active])


    const proposeKao = async () => {
        const auction = '0xD200D7d095D3aE3fF5e29e721E3825c568A9aDDE'// TODO
        const data = ethers.utils.toUtf8Bytes('hola')
        const callData = contracts?.moji.interface.encodeFunctionData('mint', [auction, 1, data])

        if (!callData) throw new Error('Could not create proposal')

        try {
            const tx = await contracts?.dao.propose([addresses.KaoToken], [0], [callData], 'Proposal')
            await tx?.wait()
        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    useEffect(() => {
        getKaoDao()
    }, [addresses.KaoDao, addresses.KaoMoji, connector, library, active])


    return (
        <div>
            <h3>
                Proposals <button onClick={proposeKao} >Propose Kao</button>
            </h3>
            <section>
                {
                    proposals.map(x => (
                        <div>
                            {x.proposalId.toString()}
                        </div>
                    ))
                }
            </section>
        </div>
    )
}