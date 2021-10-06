import { ethers } from "ethers"
import Button from "../../components/button"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import { ParaSwap } from 'paraswap';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../../components/input";
import './index.scss'

type OperationToken = {
    address: string
    symbol: string
    icon?: string
}

type SwapOperation = {
    from: OperationToken
    to: OperationToken
}



export default function BuyKaoPage() {
    const signer = useSigner()
    const contracts = useContracts()
    const paraSwap = useMemo(() => new ParaSwap(), []);
    const [operation, setOperation] = useState<SwapOperation>()
    const [tokenList, setTokenList] = useState<OperationToken[]>([])

    const mint = async () => {
        const address = await signer?.getAddress()
        if (!address) return
        const data = ethers.utils.toUtf8Bytes('HOLA')
        await contracts?.moji.mint(data)
    }

    const loadTokenList = useCallback(async () => {
        const tokens = await paraSwap.getTokens()
        if (tokens && Array.isArray(tokens)) {

            setTokenList(tokens.map(x => ({
                address: x.address,
                symbol: x.symbol ?? 'No Symbol :/',
                icon: x.img
            })))
        } else {
            setTokenList([])
        }
    }, [])

    useEffect(() => {
        loadTokenList()
    }, [])

    return (
        <div style={{
            maxWidth: '600px',
            minWidth: '600px',
        }}>
            <div>
                (o゜▽゜)o☆
            </div>
            <TokenItem token={operation?.from} label={"You'll pay"} tokenList={tokenList} />
            <TokenItem token={operation?.to} label={"You'll receive"} tokenList={[{ address: contracts?.token.address ?? '', symbol: 'KAO', icon: ':D' }]} />

            <div>
                <Button onClick={mint}  >
                    Buy
                </Button>
            </div>
        </div>
    )
}

function TokenItem({ token, label, tokenList }: { token?: OperationToken, label: string, tokenList: OperationToken[] }) {
    const selectToken = () => {

    }


    return (<div className={'token-item-container'}>

        <div style={{ width: '100%' }}>
            {label}
        </div>
        <div className={'token-item'}>
            <Input onChange={() => { }} placeholder={"0"} type={"number"} value={"0"} />
            <Select
                items={tokenList}
                onChange={() => { }}
                value={token}
                renderValue={(value) => (
                    <div style={{ width: '100px' }}>
                        {value?.icon ?? ':D'}
                        {value?.symbol.toUpperCase() ?? '---'}
                    </div>
                )}
                renderSelectItem={(item) => (
                    <>
                        {item?.icon ?  <img height={"25"} src={item.icon} /> : ':D'}
                        {item?.symbol.toUpperCase() ?? '---'}
                    </>
                )}
            />
        </div>
    </div>)
}

function Select<T>({ value, items, renderValue, renderSelectItem }: {
    items: T[],
    value: T,
    onChange: (item: T) => void,
    renderValue: (value: T) => React.ReactElement
    renderSelectItem: (item: T) => React.ReactElement
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button disabled={open} className={open ? 'open' : ''} onClick={items && items.length > 0 ? () => setOpen(true) : () => { }} >
                {!open && (
                    <div className={'selected-item'}>
                        {renderValue(value)}
                        ⛛
                    </div>
                )}
                {open && (
                <div className="select-popup white-shadow-1">
                    {items.map((item, index) => (
                        <div className={'select-popup-item'} key={`selector-key-${index}`} onClick={() => setOpen(false)}>
                            {renderSelectItem(item)}
                        </div>
                    ))}
                </div>
            )}
            </Button>
            
        </>
    )
}