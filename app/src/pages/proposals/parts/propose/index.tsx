import { ethers } from "ethers"
import { useContracts } from "../../../../hooks/useContracts"
import addresses from '../../../../contracts/contract-address.json'
import { ChangeEvent, ChangeEventHandler, EventHandler, useState } from "react"

export default function Propose() {
    const contracts = useContracts()
    const [proposalData, setProposalData] = useState<string>('')

    const proposeKao = async () => {
        if (!proposalData || proposalData.length < 0) throw new Error("Invalid proposal value")

        const auction = '0xD200D7d095D3aE3fF5e29e721E3825c568A9aDDE'// TODO
        const data = ethers.utils.toUtf8Bytes('ಠ╭╮ಠ')
        const callData = contracts?.moji.interface.encodeFunctionData('mint', [auction, 1, data])

        if (!callData) throw new Error('Could not create proposal')

        try {
            const tx = await contracts?.dao.propose([addresses.KaoToken], [0], [callData], proposalData)
            await tx?.wait()
        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    const onInputChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setProposalData(value)
        e.preventDefault();
    }

    return (
        <div>
            <input value={proposalData} onChange={onInputChanged} placeholder={'ಠ╭╮ಠ'} />
            <button onClick={proposeKao} >Propose Kao</button>
        </div>
    )
}