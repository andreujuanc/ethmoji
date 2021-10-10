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
            if (provider)
                updateBlockNumber(await provider.getBlockNumber())
        })()
        
        provider?.on('block', updateBlockNumber)
        return () => {
            provider?.off('block', updateBlockNumber)
        }
    }, [provider])


    return currentBlockNumber
}