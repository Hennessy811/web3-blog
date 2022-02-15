import "easymde/dist/easymde.min.css";
import { AccountContext } from "../lib/context";
import Nav from "../components/Nav";

import { useEffect, useState } from "react";

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState("");
  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
          },
        },
      },
    });
    return web3Modal;
  }

  useEffect(() => {
    const acc = localStorage.getItem("account");
    console.log(acc);
    if (acc) {
      setAccount(acc);
    }
  }, []);

  /* the connect function uses web3 modal to connect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();

      localStorage.setItem("account", accounts[0]);
      setAccount(accounts[0]);
    } catch (err) {
      console.log("error:", err);
    }
  }
  return (
    <div>
      <Nav account={account} connect={connect} />

      <div className="">
        <AccountContext.Provider value={account}>
          <Component {...pageProps} connect={connect} />
        </AccountContext.Provider>
      </div>
    </div>
  );
}

export default MyApp;
