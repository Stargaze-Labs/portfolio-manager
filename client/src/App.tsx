import React, { Component, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from "web3";

import "./App.css";
import { CLIENT_RENEG_WINDOW } from "tls";

type BLOCKCHAIN = "eth" | "fantom" | "avax";
interface Blockchain {
  mainnet: number,
  testnet: number,
  localnet?: number,
}

type ChainIds = {
  [key in BLOCKCHAIN]?: Blockchain;
};

const CHAIN_IDS: ChainIds = {
  "eth": {
    mainnet: 1,
    testnet: 4
  },
}

let metaMaskEthClient;
let web3Client: Web3;

const App = () => {

  const [isLoading, setIsLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const [chainId, setChainId] = React.useState<number>(-1);

  const loadWeb3 = async () => {
    try {
      // Get network provider and web3 instance.
      metaMaskEthClient = await detectEthereumProvider() as any;
      //@ts-ignore
      if (metaMaskEthClient !== window.ethereum) {
        console.error('Do you have multiple wallets installed?');
        return;
      }

      await requestAccountsOnChain();
      setChainId(await getCurrentChainId());

      web3Client = new Web3(metaMaskEthClient);
      setIsLoading(false);   

    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentChainId = async (): Promise<number> => {
    return parseInt( await metaMaskEthClient.request({ method: 'eth_chainId' }));
  }

  const requestAccountsOnChain = async () => {
    const accounts = await metaMaskEthClient.request({ method: 'eth_requestAccounts'});
    console.log(`Accounts are: ${accounts}`);
    metaMaskEthClient.on('accountsChanged', onAccountsChanged)


  }

  const onAccountsChanged = async (accounts: string[]) => {
    if(accounts.length === 0) {
      console.log("Please connect to metamask");
      return;
    } 
    setAccounts(accounts);
  }

  const mainAccount = accounts[0];


  const minABI = [  
    // balanceOf
    {    
      constant: true,
  
      inputs: [{ name: "_owner", type: "address" }],
  
      name: "balanceOf",
  
      outputs: [{ name: "balance", type: "uint256" }],
  
      type: "function",
    },
  
  ];

  useEffect(() => {
    loadWeb3()
  })

  return (
    <div>
      {
        isLoading ? <p> Loading </p> : <p> {`Current chain ID: ${chainId}`}</p>
      }
    </div>
  )
}



export default App;
