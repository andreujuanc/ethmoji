import { useCallback, useEffect, useState } from "react";
import { useProvider } from "./useProvider";


export function useBlockNumber() {
    const provider = useProvider()
    const [currentBlockNumber, setCurrentBlockNumber] = useState<number>()

    const updateBlockNumber = useCallback(async () => {
        const blockNumber = await provider?.getBlockNumber()
        setCurrentBlockNumber(blockNumber)
    }, [provider])

    useEffect(() => {
        provider?.on('block', updateBlockNumber)
        return () => {
            provider?.off('block', updateBlockNumber)
        }
    }, [provider, updateBlockNumber])


    return currentBlockNumber
}