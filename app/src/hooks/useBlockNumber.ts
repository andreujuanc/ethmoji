import { useEffect, useState } from "react";
import { useProvider } from "./useProvider";


export function useBlockNumber() {
    const provider = useProvider()
    const [currentBlockNumber, setCurrentBlockNumber] = useState<number>()



    useEffect(() => {
        const updateBlockNumber = async (block: number) => {
            setCurrentBlockNumber(block)
        }
        (async () => {
            if (provider) {
                const latestBlock = await provider.getBlockNumber()
                if (latestBlock !== currentBlockNumber)
                    updateBlockNumber(latestBlock)
            }
        })()

        provider?.on('block', updateBlockNumber)
        return () => {
            provider?.off('block', updateBlockNumber)
        }
    }, [provider, currentBlockNumber])


    return currentBlockNumber
}