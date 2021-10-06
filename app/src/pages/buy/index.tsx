import { ethers } from "ethers"
import Button from "../../components/button"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import { ParaSwap } from 'paraswap';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../../components/input";
import './index.scss'
import { useWeb3React } from "@web3-react/core";

type OperationToken = {
    address: string
    symbol: string
    icon?: string
}

type SwapOperation = {
    buy: boolean
    from?: OperationToken
    to?: OperationToken
}


enum Networks {
    MAINNET = 1,
    RINKEBY = 4,
    POLYGON = 137,
    LOCAL = 31337
}


export default function BuyKaoPage() {
    const signer = useSigner()
    const { chainId } = useWeb3React()
    const contracts = useContracts()
    const paraSwap = useMemo(() => chainId && Object.values(Networks).includes(chainId) ? new ParaSwap(chainId as any) : undefined, []);
    const [operation, setOperation] = useState<SwapOperation>()
    const [tokenList, setTokenList] = useState<OperationToken[]>([])

    const mint = async () => {
        const address = await signer?.getAddress()
        if (!address) return
        const data = ethers.utils.toUtf8Bytes('HOLA')
        await contracts?.moji.mint(data)
    }

    const loadTokenList = useCallback(async () => {
        const tokens = await paraSwap?.getTokens()
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
        setOperation({
            buy: true
        })
    }, [])


    const kaoToken = { address: contracts?.token.address ?? '', symbol: 'KAO' }

    const onSourceTokenSelected = (selected?: OperationToken) => {
        if (operation?.from?.address === selected?.address) return
        if (kaoToken.address !== selected?.address) {
            setOperation({ ...operation, buy: true, from: selected, to: kaoToken })
        } else {
            setOperation({ ...operation, buy: false, from: selected, to: undefined })
        }
    }

    const onDestinationTokenSelected = (selected?: OperationToken) => {
        if (operation?.to?.address === selected?.address) return
        if (kaoToken.address !== selected?.address) {
            setOperation({ ...operation, buy: true, to: selected, from: kaoToken })
        } else {
            setOperation({ ...operation, buy: false, to: selected, from: undefined })
        }
    }



    return (
        <div style={{
            maxWidth: '600px',
            minWidth: '600px',
        }}>
            <div>
                (o゜▽゜)o☆
            </div>
            <TokenItem token={operation?.from} label={"You'll pay"} tokenList={operation?.buy ? tokenList : [kaoToken]} tokenSelected={onSourceTokenSelected} />
            <TokenItem token={operation?.to} label={"You'll receive"} tokenList={operation?.buy ? [kaoToken] : tokenList} tokenSelected={onDestinationTokenSelected} />

            <div>
                <Button onClick={mint}  >
                    Buy
                </Button>
            </div>
        </div>
    )
}

function TokenItem({ token, label, tokenList, tokenSelected }: { token?: OperationToken, label: string, tokenList: OperationToken[], tokenSelected: (selected?: OperationToken) => void }) {
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
                onChange={tokenSelected}
                value={token}
                renderValue={(value) => (
                    <div className={'token-component'}>
                        {value?.icon ? <img height={"25"} src={value.icon} /> : <span>:D</span>}
                        {value?.symbol.toUpperCase() ?? '---'}
                    </div>
                )}
                renderSelectItem={(item) => (
                    <div className={'token-component'}>
                        {item?.icon ? <img height={"25"} src={item.icon} /> : <span>:D</span>}
                        {item?.symbol.toUpperCase() ?? '---'}
                    </div>
                )}
            />
        </div>
    </div>)
}

function Select<T>({ value, items, renderValue, renderSelectItem, onChange }: {
    items: T[],
    value: T,
    onChange: (item: T) => void,
    renderValue: (value: T) => React.ReactElement
    renderSelectItem: (item: T) => React.ReactElement
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button className={open ? 'open active' : ''} onClick={items && items.length > 0 ? () => setOpen(!open) : () => { }} >

                <div className={'selected-item'}>
                    {renderValue(value)}
                    ⛛
                </div>

                {open && (
                    <div className="select-popup white-shadow-1">
                        {items.map((item, index) => (
                            <div className={'select-popup-item'} key={`selector-key-${index}`} onClick={() => { onChange(item); setOpen(false); }}>
                                {renderSelectItem(item)}
                            </div>
                        ))}
                    </div>
                )}
            </Button>

        </>
    )
}