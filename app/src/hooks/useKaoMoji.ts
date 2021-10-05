import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContracts } from "./useContracts";
import { KaoMojiItem } from "./useKaoMojis";
import { useSigner } from "./useSigner";

export type KaoMoji = KaoMojiItem & {
    owned?: boolean
    data?: string
}

export function useEnhanceKaoMoji(item: KaoMojiItem) {
    const contracts = useContracts()
    const signer = useSigner()
    const [kaoMoji, setKaoMoji] = useState<KaoMoji>({
        id: item.id
    })

    const getData = async () => {
        const account = await signer?.getAddress()
        if (!account) return
        const owned = (await contracts?.moji.ownerOf(item.id))?.toLowerCase() == account.toLowerCase()
        const bytesToData = await contracts?.moji.getDataOf(item.id) ?? 'no data'
        const data = ethers.utils.toUtf8String(bytesToData)
        setKaoMoji({ ...kaoMoji, owned, data })
    }

    useEffect(() => {
        getData()
    }, [getData])

    return kaoMoji
}