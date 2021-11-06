import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContracts } from "./useContracts";
import { KaoMojiId } from "./useKaoMojis";
import { useSigner } from "./useSigner";

export type KaoMojiItem = KaoMojiId & {
    owned?: boolean
    data?: string
}

export function useEnhanceKaoMoji(item: KaoMojiId) {
    const contracts = useContracts()
    const signer = useSigner()
    const [kaoMoji, setKaoMoji] = useState<KaoMojiItem>({
        id: item.id,
        owner: item.owner
    })

    const getData = useCallback(async () => {
        const account = await signer?.getAddress()
        if (!account) return
        const owned = (await contracts?.moji.ownerOf(item.id))?.toLowerCase() === account.toLowerCase()
        const bytesToData = await contracts?.moji.getDataOf(item.id) ?? '0x0'
        const data = ethers.utils.toUtf8String(bytesToData)
        setKaoMoji({
            ...kaoMoji,
            owned,
            data
        })
    }, [contracts?.moji, item.id, kaoMoji, signer])

    useEffect(() => {
        getData()
    }, [getData])

    return kaoMoji
}