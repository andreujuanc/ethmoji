import { ethers } from "ethers"
import { useContracts } from "../../../../hooks/useContracts"
import { useState } from "react"
import Button from "../../../../components/button"
import "../../../../components/input/index"
//import { useSigner } from "../../../../hooks/useSigner"
import { Input } from "../../../../components/input"
import { useStaking } from "../../../../hooks/useStaking"
import { Link } from "react-router-dom"
import { formatUnits } from "@ethersproject/units"

export default function Propose() {
    const contracts = useContracts()
    const stake = useStaking()
    //const signer = useSigner()
    const [proposalData, setProposalData] = useState<string>('')

    // const selfDelegate = async () => {
    //     const account = await signer?.getAddress()
    //     if (!account) throw new Error('Not connected')
    //     contracts?.token.delegate(account)
    // }

    const proposeKao = async () => {
        if (!proposalData || proposalData.length < 0) throw new Error("Invalid proposal value")

        const data = ethers.utils.toUtf8Bytes(proposalData)
        const description = "Some cool description here"

        try {
            const tx = await contracts?.dao.proposeKao(data, description)
            await tx?.wait()
        }
        catch (ex: any) {
            console.error(ex?.data?.message ?? ex.message)
        }
    }

    const minStake = stake.minStake
    const canPropose = minStake && stake.staked?.gte(minStake) // TODO: get from dao
    return (
        <>
            {!canPropose && <div>
                <p>In order to submit a proposal you must have at least {minStake ? formatUnits(minStake, 'ether') : '--'} KAO staked. <Link to="/stake">Go to Staking</Link></p>
            </div>}
            <div style={{
                margin: '0 calc(0.5rem + 0px)',
                display: 'flex'
            }}>
                <Input value={proposalData} onChange={setProposalData} placeholder={'✪ ω ✪'} type="text" />
                <Button onClick={proposeKao} disabled={!canPropose} >Propose Kao</Button>
                {/* <Button onClick={selfDelegate} >SelfDelegate</Button> */}
            </div>
        </>
    )
}