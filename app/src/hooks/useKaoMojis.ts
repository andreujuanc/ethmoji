import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "./useContracts";

export type KaoMojiItem ={
    id: BigNumber
}

export default function useKaoMoji() {
    const [kaomojis, setKaomojis] = useState<KaoMojiItem[]>([])
    const contracts = useContracts()
    const getKaoDao = useMemo(() => async () => {
        if (!contracts) return
        const filter = contracts.moji?.filters?.Transfer()

        if (filter) {
            const result = await contracts.moji?.queryFilter(filter)
            console.log(result)
            setKaomojis(result?.map((x) => (
                {
                    id: x.args.id
                }
            )) ?? [])
        }

    }, [contracts])

    useEffect(() => {
        getKaoDao()
    }, [contracts, getKaoDao])

    return kaomojis
}