import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { KaoDao__factory } from "../contracts/factories/KaoDao__factory";
import { KaoMoji__factory } from "../contracts/factories/KaoMoji__factory";
import { KaoToken__factory } from "../contracts/factories/KaoToken__factory";
import { KaoToken__factory } from "../contracts/factories/";

import { KaoDao } from "../contracts/KaoDao";
import { KaoMoji } from "../contracts/KaoMoji";
import { KaoToken } from "../contracts/KaoToken";
import addresses from '../contracts/contract-address.json'


export function useContracts() {
    const { connector, library, active } = useWeb3React()
    const [contracts, setContracts] = useState<{ dao: KaoDao, moji: KaoMoji, token: KaoToken }>()

    const getKaoDao = useMemo(() => async () => {
        if (!active || !connector || !library) return
        const account = await connector?.getAccount()
        const signer = library && await library.getSigner(account).connectUnchecked()

        const dao = KaoDao__factory.connect(addresses.KaoDao, signer);
        const moji = KaoMoji__factory.connect(addresses.KaoMoji, signer);
        const token = KaoToken__factory.connect(addresses.KaoToken, signer);
        const token = KaoToken__factory.connect(addresses.KaoToken, signer);

        setContracts({ dao, moji, token })

    }, [connector, library, active])

    useEffect(() => {
        getKaoDao()
    }, [connector, library, getKaoDao])


    return contracts
}