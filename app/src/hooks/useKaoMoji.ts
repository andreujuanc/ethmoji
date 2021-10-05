import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContracts } from "./useContracts";
import { KaoMojiItem } from "./useKaoMojis";
import { useSigner } from "./useSigner";

export type KaoMoji = KaoMojiItem & {
    uri?: string
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
        const uri = await contracts?.moji.uri(item.id)
        const owned = (await contracts?.moji.balanceOf(account, item.id))?.gt(0)
        const bytesToData = await contracts?.moji.getDataOf(item.id) ?? 'no data'
        const data = ethers.utils.toUtf8String(bytesToData)
        setKaoMoji({ ...kaoMoji, uri, owned, data })
    }

    useEffect(() => {
        getData()
    }, [getData])

    return kaoMoji
}