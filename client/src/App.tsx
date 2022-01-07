import React, { Component, useEffect } from "react";
import getWeb3 from "./getWeb3";

import "./App.css";
import Web3 from "web3";

const App = () => {

  useEffect(() => {
    loadWeb3()
  })

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

  return (
    <div>
      <p>Hello World</p> 
    </div>
  )
}

const loadWeb3 = async () => {
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3() as Web3;

    // Use web3 to get the user's accounts.
    const accounts = (await web3.eth.getAccounts()).forEach(async account => console.log(`Account ${account} has a balance of ${await web3.eth.getBalance(account, "latest")}`));

  } catch (error) {
    // Catch any errors for any of the above operations.
    console.error(error);
  }
};

export default App;
