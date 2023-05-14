import { useCallback, useEffect, useState } from "react";
import "./App.css"
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load_contract";

function App() {

  const [web3API, setWeb3API] = useState({
    web3: null,
    provider: null,
    contract: null,
    isProviderLoaded: false,
  })

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false)

  const canConnectToContract = account && web3API.contract;
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])
  const setAccountListener = (provider) => {
    provider.on('accountsChanged', (accounts) => setAccount(accounts[0]))
    provider.on('chainChanged', () => window.location.reload())
  }

  useEffect(() => {
    const loadProvider = async () => {
     const provider = await detectEthereumProvider();
     
     if(provider) {
        const contract = await loadContract("Faucet", provider)
        setAccountListener(provider)
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      }else {
          setWeb3API((api) => {
            return {
              ...api,
              isProviderLoaded: true
            }
          })
          console.log("Please install metamask")
      }
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const loadBalance = async () => {
      const {contract, web3} = web3API
      const balance = await web3.eth.getBalance(contract.address)
      const ethBalance = web3.utils.fromWei(balance)
      setBalance(ethBalance)
    }

    web3API.contract && loadBalance();
  }, [web3API, shouldReload])

  useEffect(() => {
      const getAccount = async () => {
        const accounts = await web3API.web3.eth.getAccounts()
        setAccount(accounts[0])
      }

     web3API.web3 && getAccount()
  }, [web3API.web3])

  const addFunds = useCallback(async () => {
    const {contract, web3} = web3API
    try {
      await contract.addFunds({
        from: account,
        value: web3.utils.toWei("1")
      })
      reloadEffect()
    } catch (error) {
      console.log(error)
    }
  }, [account, web3API, reloadEffect])

  const withdraw = async () => {
    const {contract, web3} = web3API
    const withdrawAmount = web3.utils.toWei("1");
    try {
      await contract.withdraw(withdrawAmount, {
        from: account,
      })
      reloadEffect()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="faucet-wrapper">
          <div className="faucet">
              {
                web3API.isProviderLoaded ?
                <div className="is-flex is-align-items-center">
                <span>
                  <strong className="mr-2">Account:</strong>
                </span>
                  {account ? account : 
                  !web3API.provider ?
                  <> 
                    <div className="notification is-warning is-small is-rounded">
                      Wallet is not detected.
                      <a target="_blank" rel="noreferrer" href="https://docs.metamask.io">Install Metamask</a>
                    </div>
                  </>
                  :
                <button className="button is-small is-info" onClick={async () => {
                  await web3API.provider.request({method: "eth_requestAccounts"})                
                }}>Connect</button>
                } 
              </div>
              :
              <span>Loading web3...</span>  
            }
              <div className="balance-view is-size-2 my-5">
                Current Balance: <strong>{balance}</strong> ETH
              </div>
              {!canConnectToContract &&

              <i className="is-block">
                You may be connected to the wrong contract: Connect to Ganache
              </i>

              }
              <button disabled={!canConnectToContract} onClick={addFunds} className="button is-primary mr-2">Donate 1ETH</button>
              <button disabled={!canConnectToContract} onClick={withdraw} className="button is-link">Withdraw</button>
          </div>
      </div>
    </>
  );
}

export default App;
