import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "./useContracts";

export type KaoMoji = {
   
}


export default function useKaoMojis() {
    const [kaomojis, setKaomojis] = useState<KaoMoji[]>([])
    const contracts = useContracts()
    const getKaoDao = useMemo(() => async () => {
        if (!contracts) return
        const filter = contracts.moji?.filters?.TransferSingle()
        if (filter) {
            const proposalsResult = await contracts.dao?.queryFilter(filter)
            setKaomojis(proposalsResult?.map((x) => ({
                ...x.args
            })) ?? [])
        }

    }, [contracts])

    useEffect(() => {
        getKaoDao()
    }, [contracts, getKaoDao])

    return kaomojis
}