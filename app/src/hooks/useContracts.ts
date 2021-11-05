import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";

import { KaoDao__factory } from "../contracts/factories/KaoDao__factory";
import { KaoMoji__factory } from "../contracts/factories/KaoMoji__factory";
import { KaoToken__factory } from "../contracts/factories/KaoToken__factory";
import { AuctionHouse__factory } from "../contracts/factories/AuctionHouse__factory";

import { KaoDao } from "../contracts/KaoDao";
import { KaoMoji } from "../contracts/KaoMoji";
import { KaoToken } from "../contracts/KaoToken";
import { AuctionHouse } from "../contracts/AuctionHouse";
import { useAddresses } from "./useAddresses";
import { KaoStaking__factory } from "../contracts/factories/KaoStaking__factory";
import { KaoStaking } from "../contracts/KaoStaking";


export function useContracts() {
    const { connector, library, active } = useWeb3React()
    const [contracts, setContracts] = useState<{ dao: KaoDao, moji: KaoMoji, token: KaoToken, auction: AuctionHouse, staking: KaoStaking }>()
    const addresses = useAddresses()

    const getKaoDao = useMemo(() => async () => {
        if (!active || !connector || !library || !addresses) return
        const account = await connector?.getAccount()
        const signer = library && await library.getSigner(account).connectUnchecked()

        const dao = KaoDao__factory.connect(addresses.KaoDao, signer);
        const moji = KaoMoji__factory.connect(addresses.KaoMoji, signer);
        const token = KaoToken__factory.connect(addresses.KaoToken, signer);
        const auction = AuctionHouse__factory.connect(addresses.AuctionHouse, signer);
        const staking = KaoStaking__factory.connect(addresses.KaoStaking, signer)

        setContracts({ dao, moji, token, staking, auction })

    }, [connector, library, active, addresses])

    useEffect(() => {
        getKaoDao()
    }, [connector, library, getKaoDao])


    return contracts
}