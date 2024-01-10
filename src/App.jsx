import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { http, createPublicClient } from "viem";
import {
  WagmiConfig,
  configureChains,
  createConfig,
  mainnet,
  sepolia,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Web3Modal from "web3modal";
import HomePage from "./pages/HomePage";
import { updateAddress } from "./services/homepage.service";
import "./styles.css"; // Import your styles
import "./styles/color.css";
import "./styles/font.css";
import "./styles/index.css";
import "./styles/tailwind.css";
import Dashboard from "./pages/Dashboard";
import useMediaQuery from "./hooks/useMediaQuery";
import Navbar from "./components/Navbar/Navbar";
import { Banner } from "./components/banner";
import { Footer } from "./components/Footer";

import { appChains } from "./utils/chains";
import usePhantomWallet from "./hooks/usePhantomWallet";
import LandingPage from "./pages/LandingPage";

const { webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  webSocketPublicClient,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});
const providerOptions = {};
const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});
function App() {
  const [step, setStep] = useState(0);
  const [fromChain, setFromChain] = useState(appChains[1]);
  const [toChain, setToChain] = useState(appChains[0]);
  const [unisatAddress, setUnisatAddress] = useState("");
  const [metaMaskAddress, setMetamaskAddress] = useState("");
  const [phantomAddress, setPhantomAddress] = useState("");
  const [userDetails, setUserDetails] = useState();
  const [type, setType] = useState("btoe");
  const [sessionKey, setSessionKey] = useState("");
  const [pendingEntryPopup, setPendingEntryPopup] = useState(false);
  const [isMobile, setIsMobile] = useState();
  const isMob = useMediaQuery("(max-width:630px)");
  const walletUpdate = async (address) => {
    await updateAddress({
      user_details: address,
    }).then((res) => {
      setSessionKey(res.data.user_details.session_key);
    });
  };

  const { connect: connectPhantom, account: phantomAccount } =
    usePhantomWallet();

  const unisatHandler = async () => {
    try {
      const accounts = await window.unisat.requestAccounts();
      if (accounts[0].substring(0, 3) === "bc1") {
        setUnisatAddress(accounts[0]);
        setUserDetails((prev) => {
          return { ...prev, unisat_address: accounts[0] };
        });
        walletUpdate({ ...userDetails, unisat_address: accounts[0] });
      } else {
        toast.error(
          "Please Connect to Native Segwit Address starts with bc1...",
        );
      }
    } catch (e) {
      toast.error(
        "Something went wrong while connecting to wallet, please try again later",
      );
    }
  };

  const switchUnisatNetwork = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      let res = await window?.unisat?.switchNetwork("livenet");
      await unisatHandler();
    } catch (e) {
      console.log(e);
    }
  };

  const getUnisatNetwork = async () => {
    if (isMob) {
      setIsMobile(true);
    } else {
      if (window.unisat) {
        try {
          const res = await window.unisat.getNetwork();
          if (res === "livenet") {
            await unisatHandler();
          } else {
            await switchUnisatNetwork();
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        window.open("https://unisat.io/download", "_blank");
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (res) => {
        setMetamaskAddress(res[0]);
      });
    }
  }, []);

  useEffect(async () => {
    // To Check Unisat is connected after page refreshing
    if (!isMob && window.unisat) {
      try {
        var UnisatAccount = await window.unisat.getAccounts();
        if (UnisatAccount?.length > 0) {
          setUnisatAddress(UnisatAccount[0]);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }

    // To Check Metamask is connected after page refreshing
    try {
      var MetamaskAccount = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (MetamaskAccount?.length > 0) {
        setMetamaskAddress(MetamaskAccount[0]);
      }
    } catch (err) {
      console.log(err.message);
    }
    let payload = {};
    if (MetamaskAccount?.length > 0) {
      payload = { metamask_address: MetamaskAccount[0] };
    }
    if (UnisatAccount?.length > 0) {
      payload = { ...payload, unisat_address: UnisatAccount[0] };
    }
    if (MetamaskAccount?.length > 0 || UnisatAccount?.length > 0) {
      setUserDetails(payload);
      walletUpdate(payload);
    }
  }, []);

  const MetaMaskConnection = async () => {
    try {
      const web3instance = await web3Modal.connect();
      const web3provider = new ethers.providers.Web3Provider(web3instance);
      const accounts = await web3provider.listAccounts();
      setUserDetails((prev) => {
        return { ...prev, metamask_address: accounts[0] };
      });
      setMetamaskAddress(accounts[0]);
      await walletUpdate({ ...userDetails, metamask_address: accounts[0] });
      // const network = await web3provider.getNetwork();
    } catch (error) {
      toast.error(
        "Something went wrong while connecting to wallet, please try again later",
      );
    }
  };

  const CustomToastWithLink = ({ id, tag, type }) => (
    <div>
      Seems like you don't have {tag} chain added to your metamask wallet.
      Please add {type}-Chain via{" "}
      <a
        href={`https://chainlist.org/chain/${id}`}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500"
      >
        this link.
      </a>
    </div>
  );

  const getEvmChain = () => {
    if (fromChain.isEvm) {
      return fromChain;
    } else {
      return toChain;
    }
  };

  const connectMetamaskWallet = async (desiredChainId) => {
    if (window.ethereum) {
      const chainId = await window?.ethereum?.request({
        method: "eth_chainId",
      });

      const appChainId = isNaN(desiredChainId)
        ? getEvmChain().chainId
        : desiredChainId;
      if (chainId === appChainId) {
        MetaMaskConnection();
      } else {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: appChainId }],
          });
          MetaMaskConnection();
        } catch (error) {
          if (error.code === 4902) {
            let { chainListId, tag, value } = appChains?.filter(
              (ele) => ele["chainId"] === desiredChainId,
            )[0];
            toast.info(
              <CustomToastWithLink id={chainListId} tag={tag} type={value} />,
            );
          } else {
            toast.error(error.message);
          }
        }
      }
    } else {
      window.open("https://metamask.io/", "_blank");
    }
  };

  const connectUnisatWallet = async () => {
    getUnisatNetwork();
  };

  const connectPhantomWallet = async () => {
    if (!phantomAccount || phantomAccount === "") {
      // If not connected, call the connect function from the hook
      await connectPhantom();
    }
    setPhantomAddress(phantomAccount);
  };

  useEffect(() => {
    // Additional useEffect to handle the case where the account or connection status changes
    if (phantomAccount) {
      setPhantomAddress(phantomAccount);
    }
  }, [phantomAccount]);

  return (
    <WagmiConfig config={config}>
      <BrowserRouter>
        <ToastContainer />
        <div className="vh-100">
          <Navbar
            unisatAddress={unisatAddress}
            fromChain={fromChain}
            setFromChain={setFromChain}
            setToChain={setToChain}
            metaMaskAddress={metaMaskAddress}
            phantomAddress={phantomAddress}
            connectUnisatWallet={connectUnisatWallet}
            connectMetamaskWallet={connectMetamaskWallet}
            connectPhantomWallet={connectPhantomWallet}
            sessionKey={sessionKey}
            type={type}
            setStep={setStep}
            pendingEntryPopup={pendingEntryPopup}
            setPendingEntryPopup={setPendingEntryPopup}
          />

          <Routes>
            <Route
              path="/bridge"
              element={
                <HomePage
                  step={step}
                  setStep={setStep}
                  toChain={toChain}
                  setToChain={setToChain}
                  fromChain={fromChain}
                  setFromChain={setFromChain}
                  appChains={appChains}
                  unisatAddress={unisatAddress}
                  metaMaskAddress={metaMaskAddress}
                  phantomAddress={phantomAddress}
                  connectUnisatWallet={connectUnisatWallet}
                  isMobile={isMobile}
                  setIsMobile={setIsMobile}
                  connectMetamaskWallet={connectMetamaskWallet}
                  connectPhantomWallet={connectPhantomWallet}
                  session_key={sessionKey}
                  setType={setType}
                  type={type}
                  pendingEntryPopup={pendingEntryPopup}
                  setPendingEntryPopup={setPendingEntryPopup}
                />
              }
            />
            <Route
              element={<Dashboard appChains={appChains} />}
              path="dashboard"
            />
            <Route element={<LandingPage />} path="/" />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
