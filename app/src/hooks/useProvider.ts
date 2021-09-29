import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { providers } from "ethers";


export function useProvider() {
    const { library } = useWeb3React()
    const [provider, setProvider] = useState<providers.Provider>()

    const getProvider = useMemo(() => async () => {
        debugger;
        // const provider = await connector?.getProvider();
        // if (!provider) return

        setProvider(library)

    }, [library])

    useEffect(() => {
        getProvider()
    }, [library, getProvider])


    return provider
}