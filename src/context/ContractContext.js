import React, { useState, createContext, useEffect } from "react";
import { ethers } from "ethers";
import {
  // abis
  APICONSUMER_ABI,
  VRF_ABI,
  MINTER_ABI,
  AUTOMATION_ABI,
  // address
  APICONSUMER_ADDRESS,
  VRF_ADDRESS,
  MINTER_ADDRESS,
  AUTOMATION_ADDRESS,
} from "./constants";
import BigNumber from "bignumber.js";

export const ContractContext = createContext();
const { ethereum } = window;

const WalletProvider = ethereum
  ? new ethers.providers.Web3Provider(ethereum, "any")
  : undefined;

const QuickProvider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_MUMBAI_RPC_URL
);

const gasToMint = 2000000; // Mumbai
const priceToMint = "0"; // Mumbai

export const ContractProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [chainId, setChainId] = useState(0);
  const [provider, setProvider] = useState(QuickProvider);
  const [collections, setCollections] = useState([]);
  const [openMintModal, setOpenMintModal] = useState(false);

  const [mintSteps, setMintSteps] = useState({
    minting: false,
    interviewing: false,
    painting: false,
    creating: false,
    created: false,
  });

  const checkProvider = async () => {
    try {
      if (!ethereum)
        return console.log("Please install a Cryptocurrency Software Wallet");

      setProvider(WalletProvider);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };
  const checkIfWalletisConnected = async () => {
    try {
      if (!ethereum)
        return console.log("Please install a Cryptocurrency Software Wallet");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };
  const checkChainId = async () => {
    try {
      if (!ethereum)
        return console.log("Please install a Cryptocurrency Software Wallet");

      const chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId.length) {
        setChainId(parseInt(chainId, 16));
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };
  const getAllCollections = async () => {
    try {
      // if (!ethereum)
      //   return console.log("Please install a Cryptocurrency Software Wallet");

      const MinterContract = new ethers.Contract(
        MINTER_ADDRESS.mumbai,
        MINTER_ABI,
        provider
      );
      const totalSupplyBigNumber = await MinterContract.totalSupply();
      const totalSupply = BigNumber(totalSupplyBigNumber._hex).c[0];

      const collection = [];

      for (var i = 0; i < totalSupply; i++) {
        collection[i] = {
          tokenid: i,
          addresssender: await MinterContract.ownerOf(i),
          uri64: await MinterContract.tokenURI(i),
        };
      }
      setCollections(collection);
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum)
        return console.log("Please install a Cryptocurrency Software Wallet");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object.");
    }
  };
  const createNFT = async () => {
    try {
      if (!ethereum)
        return console.log("Please install a Cryptocurrency Software Wallet");

      const AutomationContract = new ethers.Contract(
        AUTOMATION_ADDRESS.mumbai,
        AUTOMATION_ABI,
        WalletProvider.getSigner(0)
      );
      // Create NFT
      const create_tx = await AutomationContract.mint({
        gasLimit: gasToMint,
      });
      // Start create
      console.log(`Loading - ${create_tx.hash}`);
      setMintSteps({ ...mintSteps, minting: true });
      // NFT Minted, now wait or close
      await create_tx.wait(1);
      setMintSteps({
        ...mintSteps,
        minting: false,
        interviewing: true,
      });
      // Set alert, when quote exists

      // Set alert, when svg exists

      // TokenURI exists
    } catch (error) {
      console.log(error);
      setMintSteps({
        minting: false,
        interviewing: false,
        painting: false,
        creating: false,
        created: false,
      });
      console.log(
        "No able to mint. Check if you send the right Mint price or reach the Max token per Wallet"
      );
    }
  };

  useEffect(() => {
    if (ethereum) {
      ethereum.on("chainChanged", () => {
        checkChainId();
      });
      ethereum.on("accountsChanged", () => {
        checkIfWalletisConnected();
      });
      if (mintSteps.interviewing) {
        // Set alert, when quote exists
        const APIConsumer = new ethers.Contract(
          APICONSUMER_ADDRESS.mumbai,
          APICONSUMER_ABI,
          provider.getSigner(0)
        );
        APIConsumer.once("RequestQuote", async (res) => {
          console.log("RequestQuote event fired!", res);
          setMintSteps({
            ...mintSteps,
            interviewing: false,
            painting: true,
          });
        });
      } else if (mintSteps.painting) {
        // Set alert, when svg exists
        const VRF = new ethers.Contract(
          VRF_ADDRESS.mumbai,
          VRF_ABI,
          provider.getSigner(0)
        );
        VRF.once("RequestFulfilled", async (res) => {
          console.log("RequestFulfilled event fired!", res);
          setMintSteps({
            ...mintSteps,
            painting: false,
            creating: true,
          });
        });
      } else if (mintSteps.creating) {
        // TokenURI exists
        const AutomationContract = new ethers.Contract(
          AUTOMATION_ADDRESS.mumbai,
          AUTOMATION_ABI,
          provider.getSigner(0)
        );
        AutomationContract.once("Created", async (res) => {
          console.log("Created event fired!", res);
          setMintSteps({
            ...mintSteps,
            creating: false,
            created: true,
          });
        });
      } else if (mintSteps.created) {
        alert.success("We have Created your NFT with Success");
      }
    }
  });

  useEffect(() => {
    checkProvider();
    checkIfWalletisConnected();
    checkChainId();
    getAllCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ContractContext.Provider
      value={{
        //States:
        gasToMint,
        priceToMint,
        currentAccount,
        chainId,
        collections,
        mintSteps,
        openMintModal,
        //Functions:
        connectWallet,
        setOpenMintModal,
        createNFT,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
