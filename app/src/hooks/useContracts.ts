import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { KaoDao__factory } from "../contracts/factories/KaoDao__factory";
import { KaoMoji__factory } from "../contracts/factories/KaoMoji__factory";
import { KaoDao } from "../contracts/KaoDao";
import { KaoMoji } from "../contracts/KaoMoji";
import addresses from '../contracts/contract-address.json'


export function useContracts() {
    const { connector, library, active } = useWeb3React()
    const [contracts, setContracts] = useState<{ dao: KaoDao, moji: KaoMoji }>()

    const getKaoDao = useMemo(() => async () => {
        if (!active || !connector || !library) return
        const account = await connector?.getAccount()
        const signer = library && await library.getSigner(account).connectUnchecked()

        const dao = KaoDao__factory.connect(addresses.KaoDao, signer);
        const moji = KaoMoji__factory.connect(addresses.KaoMoji, signer);

        setContracts({ dao, moji })

    }, [connector, library, active])

    useEffect(() => {
        getKaoDao()
    }, [connector, library, getKaoDao])


    return contracts
}