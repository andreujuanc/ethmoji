import { ethers } from "ethers"
import { useContracts } from "../../../../hooks/useContracts"
import addresses from '../../../../contracts/contract-address.json'
import { useState } from "react"
import Button from "../../../../components/button"
import "../../../../components/input/index"
import { useSigner } from "../../../../hooks/useSigner"
import { Input } from "../../../../components/input"

export default function Propose() {
    const contracts = useContracts()
    const signer = useSigner()
    const [proposalData, setProposalData] = useState<string>('')

    const selfDelegate = async () => {
        const account = await signer?.getAddress()
        if (!account) throw new Error('Not connected')
        contracts?.token.delegate(account)
    }

    const proposeKao = async () => {
        if (!proposalData || proposalData.length < 0) throw new Error("Invalid proposal value")

        const data = ethers.utils.toUtf8Bytes(proposalData)
        const callData = contracts?.moji.interface.encodeFunctionData('mint', [data])

        if (!callData) throw new Error('Could not create proposal')

        try {
            const tx = await contracts?.dao.propose([addresses.KaoMoji], [0], [callData], proposalData)
            await tx?.wait()
        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    // Check if holding tokens but voting power is zero to show the self delegate button
    return (
        <div>
            <Input value={proposalData} onChange={setProposalData} placeholder={'ಠ╭╮ಠ'} type="text" />
            <Button onClick={proposeKao} >Propose Kao</Button>
            <Button onClick={selfDelegate} >SelfDelegate</Button>
        </div>
    )


}

