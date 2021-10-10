import { BigNumber } from "ethers"
import Button from "../../components/button"
import { useContracts } from "../../hooks/useContracts"
import { useSigner } from "../../hooks/useSigner"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "../../components/input";
import './index.scss'
import { useWeb3React } from "@web3-react/core";
import { APIError, ParaSwap } from 'paraswap';
import { OptimalRate, SwapSide } from "paraswap-core";
import { Select } from "../../components/select";
import { Networks } from "../../core/networks";
import { formatEther, formatUnits, parseUnits } from "@ethersproject/units";

type OperationToken = {
    address: string
    symbol: string
    decimals: number
    icon?: string
}

type SourceOperationData = {
    from?: OperationToken
    fromAmount?: BigNumber
}

type DestinationOperationData = {
    to?: OperationToken
    toAmount?: BigNumber
}


type SwapOperation = {
    optimalRate?: OptimalRate
    error?: APIError
}

export default function BuyKaoPage() {
    const signer = useSigner()
    const { active, chainId } = useWeb3React()
    const contracts = useContracts()
    const paraSwap = useMemo(() => (chainId && active) && Object.values(Networks).includes(chainId) ? new ParaSwap(chainId as any) : undefined, [active, chainId]);
    const [sourceOperationData, setSourceOperationData] = useState<SourceOperationData>()
    const [destinationOperationData, setDestinationOperationData] = useState<DestinationOperationData>()
    const [operation, setOperation] = useState<SwapOperation>()
    const [tokenList, setTokenList] = useState<OperationToken[]>([])

    const swap = async () => {
        const address = await signer?.getAddress()
        if (!address || !paraSwap || !signer) return
        if (!sourceOperationData?.from?.address || !destinationOperationData?.to?.address) return
        if (!sourceOperationData?.fromAmount || !destinationOperationData.toAmount?.toString()) return
        if (!operation?.optimalRate) return
        if (operation?.error) return

        const srcToken = sourceOperationData.from.address;
        const destToken = destinationOperationData.to.address;
        const srcAmount = sourceOperationData.fromAmount.toString();
        const destAmount = destinationOperationData.toAmount.toString();
        const senderAddress = address;
        const receiver = address;
        const referrer = 'ethmoji';

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

        if ('message' in txParams) throw txParams

        const tx = await signer.sendTransaction({
            from: txParams.from,
            to: txParams.to,
            value: BigNumber.from(txParams.value),
            gasPrice: BigNumber.from((txParams as any).gasPrice),
            gasLimit: BigNumber.from((txParams as any).gas),
            chainId: txParams.chainId,
            data: txParams.data
        });
        await tx.wait()

    }

    const loadTokenList = useCallback(async () => {
        const tokens = await paraSwap?.getTokens()

        // ROPSTEN WETH: 0xc778417E063141139Fce010982780140Aa0cD5Ab


        if (tokens && Array.isArray(tokens) && chainId) {
            if (chainId == Networks.ROPSTEN) {
                tokens.push({
                    address: '0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C',
                    decimals: 6,
                    symbol: 'USDC',
                    network: 3,
                    tokenType: 'ERC20',
                    connectors: [],
                    mainConnector: '',
                    img: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389'
                })
            }
            setTokenList(tokens.map(x => ({
                address: x.address,
                symbol: x.symbol ?? 'No Symbol :/',
                icon: x.img,
                decimals: x.decimals
            })))
        } else {
            setTokenList([])
        }
    }, [paraSwap, chainId])

    useEffect(() => {
        loadTokenList()
    }, [paraSwap, chainId, loadTokenList])

    const kaoToken = { address: contracts?.token.address ?? '', symbol: 'KAO', decimals: 18 }

    const onSourceTokenSelected = (selected?: OperationToken) => {
        // TODO: const allowance = await paraSwap.getAllowance(userAddress, tokenAddress);
        // TODO: const txHash = await paraSwap.approveToken(amount, userAddress, tokenAddress);

        if (sourceOperationData?.from?.address === selected?.address) return
        setSourceOperationData({ ...sourceOperationData, from: selected })
        if (kaoToken.address !== selected?.address) {
            setDestinationOperationData({ to: kaoToken })
        }
    }

    const onDestinationTokenSelected = (selected?: OperationToken) => {
        if (destinationOperationData?.to?.address === selected?.address) return
        setDestinationOperationData({ to: selected })
        if (kaoToken.address !== selected?.address) {
            setSourceOperationData({ from: kaoToken })
        }
    }

    const calculateRate = useCallback(async () => {
        if (!sourceOperationData?.from?.address ||
            !sourceOperationData?.fromAmount ||
            !destinationOperationData?.to?.address ||
            !paraSwap) return

        const address = await signer?.getAddress()
        if (!address) return

        const priceRoute = await paraSwap?.getRate(
            sourceOperationData.from.address,
            destinationOperationData.to.address,
            sourceOperationData.fromAmount.toString(),
            address,
            SwapSide.SELL,
            {
                partner: 'ethmoji',
                // maxUSDImpact: 100000000,
                // maxImpact: 100,
                includeDEXS: 'UniswapV2' //'Uniswap, Kyber, Bancor, Oasis, Compound, Fulcrum, 0x, MakerDAO, Chai, ParaSwapPool, Aave, Aave2, MultiPath, MegaPath, Curve, Curve3, Saddle, IronV2, BDai, idle, Weth, Beth, UniswapV2, Balancer, 0xRFQt, ParaSwapPool2, ParaSwapPool3, ParaSwapPool4, ParaSwapPool5, ParaSwapPool6, SushiSwap, LINKSWAP, Synthetix, DefiSwap, Swerve, CoFiX, Shell, DODOV1, DODOV2, OnChainPricing, PancakeSwap, PancakeSwapV2, ApeSwap, Wbnb, acryptos, streetswap, bakeryswap, julswap, vswap, vpegswap, beltfi, ellipsis, QuickSwap, COMETH, Wmatic, Nerve, Dfyn, UniswapV3, Smoothy, PantherSwap, OMM1, OneInchLP, CurveV2, mStable, WaultFinance, MDEX, ShibaSwap, CoinSwap, SakeSwap, JetSwap, Biswap, BProtocol'
            },
            sourceOperationData.from.decimals,
            destinationOperationData.to.decimals
        );


        setOperation({
            optimalRate: (priceRoute as OptimalRate).contractMethod ? priceRoute as any : undefined,
            error: (priceRoute as APIError).message ? priceRoute as any : undefined
        })
        setDestinationOperationData({
            to: destinationOperationData.to,
            toAmount: (priceRoute as OptimalRate)?.destAmount ? BigNumber.from((priceRoute as OptimalRate)?.destAmount) : undefined
        })

    }, [sourceOperationData?.from?.address, sourceOperationData?.fromAmount, destinationOperationData?.to?.address, paraSwap])

    useEffect(() => {
        calculateRate()
    }, [sourceOperationData?.fromAmount, calculateRate])

    const onSourceAmountChanged = (value?: BigNumber) => {
        if (!sourceOperationData) return
        setSourceOperationData({ ...sourceOperationData, fromAmount: value })
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
            <TokenItem token={sourceOperationData?.from} label={"You pay"} tokenList={tokenList} tokenSelected={onSourceTokenSelected} amount={sourceOperationData?.fromAmount} amountChanged={onSourceAmountChanged} />
            <TokenItem token={destinationOperationData?.to} label={"You'll receive"} tokenList={tokenList} tokenSelected={onDestinationTokenSelected} amount={destinationOperationData?.toAmount} amountChanged={onDestinationAmountChanged} />

            <div style={{
                marginTop: '1rem'
            }}>
                <Button onClick={swap} disabled={!!operation?.error} >
                    Buy
                </Button>
                <span style={{
                    marginLeft: '1rem'
                }}>
                    {operation?.error?.message}
                </span>
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
            <Input onChange={(value) => amountChanged(value ? BigNumber.from(parseUnits(value, token?.decimals ?? 18)) : undefined)} placeholder={"0"} type={"number"} value={amount ? formatUnits(amount.toString(), token?.decimals ?? 18) : ''} />
            <Select
                items={tokenList}
                onChange={tokenSelected}
                value={token}
                renderValue={(value) => (
                    <div className={'token-component'}>
                        {value?.icon ? <img height={"25"} src={value.icon} alt={value.symbol} /> : <span>:D</span>}
                        {value?.symbol.toUpperCase() ?? '---'}
                    </div>
                )}
                renderSelectItem={(item) => (
                    <div className={'token-component'}>
                        {item?.icon ? <img height={"25"} src={item.icon} alt={item.symbol} /> : <span>:D</span>}
                        {item?.symbol.toUpperCase() ?? '---'}
                    </div>
                )}
            />
        </div>
    </div>)
}

