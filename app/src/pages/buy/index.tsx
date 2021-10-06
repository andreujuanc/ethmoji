import { BigNumber, ethers } from "ethers"
import Button from "../../components/button"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../../components/input";
import './index.scss'
import { useWeb3React } from "@web3-react/core";
import { ParaSwap } from 'paraswap';
import { OptimalRate } from "paraswap-core";

type OperationToken = {
    address: string
    symbol: string
    icon?: string
}

type SwapOperation = {
    buy: boolean
    from?: OperationToken
    fromAmount?: BigNumber
    to?: OperationToken
    toAmount?: BigNumber
    optimalRate?: OptimalRate
}


enum Networks {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    POLYGON = 137,
    LOCAL = 31337
}


export default function BuyKaoPage() {
    const signer = useSigner()
    const { active, chainId } = useWeb3React()
    const contracts = useContracts()
    const paraSwap = useMemo(() => chainId && Object.values(Networks).includes(chainId) ? new ParaSwap(chainId as any) : undefined, [active, chainId]);
    const [operation, setOperation] = useState<SwapOperation>()
    const [tokenList, setTokenList] = useState<OperationToken[]>([])

    const swap = async () => {
        console.log('operation', operation)
        const address = await signer?.getAddress()
        if (!address || !paraSwap || !signer) return
        if (!operation?.from?.address || !operation?.to?.address) return
        if (!operation?.fromAmount || !operation.toAmount?.toString()) return
        if (!operation.optimalRate) return

        const srcToken = operation.from.address;
        const destToken = operation.to.address;
        const srcAmount = operation.fromAmount.toString();
        const destAmount = operation.toAmount.toString();
        const senderAddress = address;
        const receiver = address;
        const referrer = 'ethmoji';
        console.log('SENDING')
        const txParams = await paraSwap.buildTx(
            srcToken,
            destToken,
            srcAmount,
            destAmount,
            operation.optimalRate,
            senderAddress,
            referrer,
            receiver,
        );

        const tx = await signer.sendTransaction(txParams);
        await tx.wait()
        console.log('SENT')
    }

    const loadTokenList = useCallback(async () => {
        const tokens = await paraSwap?.getTokens()
        console.log('tokens', tokens)
        if (tokens && Array.isArray(tokens)) {

            setTokenList(tokens.map(x => ({
                address: x.address,
                symbol: x.symbol ?? 'No Symbol :/',
                icon: x.img
            })))
        } else {
            setTokenList([])
        }
    }, [paraSwap, chainId])

    useEffect(() => {
        loadTokenList()
        setOperation({
            buy: true
        })
    }, [paraSwap, chainId])

    const kaoToken = { address: contracts?.token.address ?? '', symbol: 'KAO' }

    const onSourceTokenSelected = (selected?: OperationToken) => {
        // TODO: const allowance = await paraSwap.getAllowance(userAddress, tokenAddress);
        // TODO: const txHash = await paraSwap.approveToken(amount, userAddress, tokenAddress);

        if (operation?.from?.address === selected?.address) return
        if (kaoToken.address !== selected?.address) {
            setOperation({ ...operation, buy: true, from: selected, /* to: kaoToken*/ })
        } else {
            setOperation({ ...operation, buy: false, from: selected, to: undefined })
        }
    }

    const onDestinationTokenSelected = (selected?: OperationToken) => {
        if (operation?.to?.address === selected?.address) return
        if (kaoToken.address !== selected?.address) {
            setOperation({ ...operation, buy: true, to: selected, /* from: kaoToken */ })
        } else {
            setOperation({ ...operation, buy: false, to: selected, from: undefined })
        }
    }

    const calculateRate = useCallback(async () => {
        if (!operation?.from?.address ||
            !operation?.to?.address ||
            !operation?.fromAmount ||
            !paraSwap) return
        const priceRoute = await paraSwap?.getRate(
            operation.from.address,
            operation.to.address,
            operation.fromAmount.toString(),
        );
        console.log('Prices', priceRoute)
    }, [])

    useEffect(() => {
        calculateRate()
    }, [operation?.fromAmount])

    const onSourceAmountChanged = (value?: BigNumber) => {
        if (!operation) return
        setOperation({ ...operation, fromAmount: value })
    }

    const onDestinationAmountChanged = (value?: BigNumber) => {

    }


    return (
        <div style={{
            maxWidth: '600px',
            minWidth: '600px',
        }}>
            <h3>
                Buy Kao (o゜▽゜)o☆
            </h3>
            <TokenItem token={operation?.from} label={"You pay"} tokenList={tokenList} tokenSelected={onSourceTokenSelected} amount={operation?.fromAmount} amountChanged={onSourceAmountChanged} />
            <TokenItem token={operation?.to} label={"You'll receive"} tokenList={tokenList} tokenSelected={onDestinationTokenSelected} amount={operation?.toAmount} amountChanged={onDestinationAmountChanged} />

            <div>
                <Button onClick={swap}  >
                    Buy
                </Button>
            </div>
        </div>
    )
}

function TokenItem({ token, label, tokenList, tokenSelected, amountChanged, amount }:
    {
        token?: OperationToken,
        label: string,
        tokenList: OperationToken[],
        tokenSelected: (selected?: OperationToken) => void,
        amount?: BigNumber,
        amountChanged: (value?: BigNumber) => void
    }) {


    return (<div className={'token-item-container'}>

        <div style={{ width: '100%' }}>
            {label}
        </div>
        <div className={'token-item'}>
            <Input onChange={(value) => amountChanged(value ? BigNumber.from(value) : undefined)} placeholder={"0"} type={"number"} value={amount?.toString() ?? ''} />
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