export enum Networks {
    localhost = "localhost",
    hardhat = 'hardhat',
    ropsten = "ropsten"
}

export const isValidNetwork = (networkName: string): networkName is Networks => {
    if (!Object.values(Networks).includes(networkName as any)) throw new Error(`Network not supported: ${networkName}`);
    return true
}