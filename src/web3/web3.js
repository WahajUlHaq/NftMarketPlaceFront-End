import Web3 from "web3";

let web3;

if (window.ethereum) {
  if (
    parseInt(window.ethereum.chainId) ===
    parseInt(process.env.REACT_APP_CHAIN_ID)
  ) {
    web3 = new Web3(window.ethereum);

    console.log("Your chain id matched with required chain id");
    console.log("Required =>" + process.env.REACT_APP_CHAIN_ID);
    console.log("Current Chain Id =>" + window.ethereum.chainId);
  } else {
    web3 = new Web3(process.env.REACT_APP_NODE_URL_RPC);

    console.log("Your chain id not matched with required chain id");
    console.log("Required =>" + process.env.REACT_APP_CHAIN_ID);
    console.log("Current Chain Id =>" + window.ethereum.chainId);
  }
} else {
  web3 = new Web3(process.env.REACT_APP_NODE_URL_RPC);

  console.log("Metamask not installed or you have multiple wallet installed.");
}

let web3Object = {
  web3: web3,
};

export default web3Object;
