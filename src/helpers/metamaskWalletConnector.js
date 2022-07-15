import Web3 from "web3";
import web3Object from "../web3/web3";

export const web3Initializer = async () => {
  try {
    const web3 = web3Object;

    if (
      parseInt(window.ethereum.chainId) ===
      parseInt(process.env.REACT_APP_CHAIN_ID)
    ) {
      web3.web3 = new Web3(window.ethereum);
    }
  } catch (e) {
    console.log("Web-3 Initialization Failed=>", e.message)
  }
};

export const getAccount = async () => {
  try {
    const web3 = web3Object;

    const accountDetails = await web3.web3._provider.request({
      method: "eth_requestAccounts",
    });

    if (!accountDetails.length) {
      alert("please connect to metamask account!");

      return null;
    } else if (accountDetails[0]) {
      return accountDetails[0];
    }
  } catch (e) {
    console.log("Metamask account fetching is un-successfull=>", e.message)
  }
};
