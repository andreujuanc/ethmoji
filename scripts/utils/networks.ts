export enum Networks {
    localhost = "localhost",
    ropsten = "ropsten"
}

export const isValidNetwork = (networkName: string): networkName is Networks => {
    if (!Object.keys(Networks).indexOf(networkName)) throw new Error(`Network not supported: ${networkName}`);
    return true
}