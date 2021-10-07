import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "./useContracts";

export type KaoMojiItem = {
    id: BigNumber
}

export default function useKaoMoji() {
    const [kaomojis, setKaomojis] = useState<KaoMojiItem[]>([])
    const contracts = useContracts()
    const getKaoDao = useMemo(() => async () => {
        if (!contracts) return
        const filter = contracts.moji?.filters?.Transfer(ethers.constants.AddressZero)
        if (filter) {
            const result: { id: BigNumber }[] = (await contracts.moji?.queryFilter(filter))
                .reduce((items: any[], { args: item }) => {
                    console.log("ITEM", item)
                    if (!items.find(x => x.id.toString() === item.tokenId.toString())) {
                        items.push({
                            id: item.tokenId
                        })
                    }
                    return items
                }, [])
            console.log('mojis', result)
            setKaomojis(result)
        }

    }, [contracts])

    useEffect(() => {
        getKaoDao()
    }, [contracts, getKaoDao])

    return kaomojis
}