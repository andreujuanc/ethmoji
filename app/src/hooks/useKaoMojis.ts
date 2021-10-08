import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "./useContracts";
import { useSigner } from "./useSigner";

export type KaoMojiId = {
    id: BigNumber
    owner: string
}

export default function useKaoMojis(ownedOnly: boolean) {
    const [kaomojis, setKaomojis] = useState<KaoMojiId[]>([])
    const contracts = useContracts()
    const signer = useSigner()

    const getKaoDao = useMemo(() => async () => {
        if (!contracts) return
        if (ownedOnly && !signer) return

        const address = await signer?.getAddress()

        const filter = contracts.moji?.filters?.Transfer(ownedOnly ? undefined : ethers.constants.AddressZero)
        if (filter) {
            const tokens: { id: BigNumber, owner: string }[] = (await contracts.moji?.queryFilter(filter))
                .sort((a, b) => a.blockNumber - b.blockNumber)
                .reduce((items: any[], x) => {
                    const item = x.args
                    const index = items.findIndex(x => x.id.toString() === item.tokenId.toString())
                    if (index < 0)
                        items.push({
                            id: item.tokenId,
                            owner: item.to
                        })
                    else {
                        items[index].owner = item.to
                    }

                    return items
                }, [])

            if (ownedOnly ) {
                setKaomojis(tokens.filter(x => x.owner.toLowerCase() === address))
            }
            else {
                setKaomojis(tokens)
            }

        }

    }, [contracts, ownedOnly, signer])

    useEffect(() => {
        getKaoDao()
    }, [contracts, getKaoDao])

    return kaomojis
}