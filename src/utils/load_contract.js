import contract from "@truffle/contract"

export const loadContract = async (name, provider) => {
    const res = await fetch(`/contracts/${name}.json`)
    const artifacts = await res.json()
    const _contract = contract(artifacts)
    _contract.setProvider(provider)

    let deployedContract = null

    try {
        deployedContract = await _contract.deployed()
    } catch (error) {
        console.error("Cannot load contract: You may be connected to wrong network")
    }
    return deployedContract
}