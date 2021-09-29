import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { Signer } from "ethers";


export function useSigner() {
    const { connector, library, active } = useWeb3React()
    const [signer, setSigner] = useState<Signer>()

    const getSigner = useMemo(() => async () => {

        const account = await connector?.getAccount()
        const signer = library && await library.getSigner(account)//.connectUnchecked()

        setSigner(signer)

    }, [connector, library, active])

    useEffect(() => {
        getSigner()
    }, [connector, library, active])


    return signer
}