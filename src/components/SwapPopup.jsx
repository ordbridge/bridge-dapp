import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosInformationCircleOutline } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

import { LuClock3 } from "react-icons/lu";
import { toast } from "react-toastify";
import Web3 from "web3";

import { PendingEntries } from "../pages/PendingEntries";
import { initiateBridge } from "../services/homepage.service";
import AVAX_ABI from "../utils/avax";
import ETH_ABI from "../utils/eth";
import { AddressPopup } from "./AddressPopup";
import { Button } from "./Button";
import { CustomTokenModal } from "./CustomTokenModal";
import { CustomDropdown } from "./Dropdown";
import ConnectMetaMaskWallet from "./Navbar/ConnectMetaMaskWallet";
import ConnectPhantomWallet from "./Navbar/ConnectPhantomWallet";
import ConnectUnisatWallet from "./Navbar/ConnectUnisatWallet";
import { Step1 } from "./ProcessSteps/Step1";
import { Step2 } from "./ProcessSteps/Step2";
import { Step3 } from "./ProcessSteps/Step3";
import { Step4 } from "./ProcessSteps/Step4";
import useMediaQuery from "../hooks/useMediaQuery";
import usePhantomWallet from "../hooks/usePhantomWallet";
import { burnHandler } from "../utils/solanaHandler";
import { Link } from "react-router-dom";

export const SwapPopup = ({
  step,
  setStep,
  token,
  setToken,
  toChain,
  setToChain,
  fromChain,
  setFromChain,
  appChains,
  tokenList,
  unisatAddress,
  connectUnisatWallet,
  setType,
  metaMaskAddress,
  connectMetamaskWallet,
  phantomAddress,
  connectPhantomWallet,
  session_key,
  pendingEntryPopup,
  setPendingEntryPopup
}) => {
  const [showModal, setShowModal] = useState(false);
  const [swap, setSwap] = useState(true);
  const [addressModal, setAddressModal] = useState(false);
  const [tokenValue, setTokenValue] = useState(1);
  const [modalType, setModalType] = useState("etob");
  const [initiateBridgeResponse, setInitiateBridgeResponse] = useState({});
  const [metaMaskResponse, setMetamaskResponse] = useState();
  const [loader, setLoader] = useState(false);
  const [pendingEntriesDataById, setPendingEntriesDataById] = useState([]);
  const [pendingInscriptionId, setPendingInscriptionId] = useState("");
  const [tokenName, setTokenName] = useState(tokenList[0]);
  const [claimButton, setClaimButton] = useState(false);
  const [claimStatus, setClaimStatus] = useState("success");

  const isMob = useMediaQuery("(max-width:630px)");
  const [fromChainConnected, setFromChainConnected] = useState(false);
  const [toChainConnected, setToChainConnected] = useState(false);

  const { provider: phantomProvider } = usePhantomWallet();

  // isRedundant and is placed in app.jsx as well
  const getEvmChain = () => {
    if (fromChain.isEvm) {
      return fromChain;
    }

    return toChain;
  };

  const setChain = (isFrom, chain) => async () => {
    // If user selects the same token on the other side, just swap
    if ((isFrom && chain === toChain) || (!isFrom && chain === fromChain)) {
      swapChains();
    }

    // If neither token is BRC, change to other to BRC
    else if (isFrom && chain.tag !== "BRC") {
      if (chain.tag === toChain.tag) {
        toast.error("Please select different chain");
        return;
      }

      setFromChain(chain);

      if (chain.isEvm) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        });
        if (chainId !== chain.chainId) {
          connectMetamaskWallet(chain.chainId);
        }
      }
      // setToChain(appChains[1]);
      // } else if (!isFrom && chain.tag !== 'BRC') {
      //   setToChain(chain);
      //   setFromChain(appChains[1]);
      // } else if (isFrom) {
      //   setFromChain(chain);
    } else {
      if (chain.tag === fromChain.tag) {
        toast.error("Please select different chain");
        return;
      }

      setToChain(chain);
    }
  };

  const chainConnectButton = (chain) => {
    if (chain.tag === "BRC") {
      return (
        <div
          className="w-full mt-3 rounded-3xl   cursor-pointer "
          style={{
            background: "linear-gradient(90deg, #A681FF 0.02%, #4616FF 99.97%)"
          }}
          onClick={connectUnisatWallet}>
          <ConnectUnisatWallet
            onConnectClick={connectUnisatWallet}
            address={unisatAddress}
            text="Connect Wallets"
          />
        </div>
      );
    } else if (chain.tag === "SOL") {
      return (
        <div className="w-full mt-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer mt-3">
          <ConnectPhantomWallet
            onConnectClick={connectPhantomWallet}
            address={phantomAddress}
            text="Connect Wallets"
          />
        </div>
      );
    } else {
      return (
        <div className="w-full mt-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer mt-3">
          <ConnectMetaMaskWallet
            onConnectClick={connectMetamaskWallet}
            address={metaMaskAddress}
            text="Connect Wallets"
          />
        </div>
      );
    }
  };

  const fromChainConnectButton = () => {
    return chainConnectButton(fromChain);
  };

  const toChainConnectButton = () => {
    return chainConnectButton(toChain);
  };

  // Handles the
  useEffect(() => {
    if (fromChain.wallet === "unisat" && unisatAddress && unisatAddress !== "") {
      setFromChainConnected(true);
    } else if (fromChain.wallet === "phantom" && phantomAddress && phantomAddress !== "") {
      setFromChainConnected(true);
    } else if (fromChain.wallet === "metamask" && metaMaskAddress && metaMaskAddress !== "") {
      setFromChainConnected(true);
    } else {
      setFromChainConnected(false);
    }

    if (toChain.wallet === "unisat" && unisatAddress && unisatAddress !== "") {
      setToChainConnected(true);
    } else if (toChain.wallet === "phantom" && phantomAddress && phantomAddress !== "") {
      setToChainConnected(true);
    } else if (toChain.wallet === "metamask" && metaMaskAddress && metaMaskAddress !== "") {
      setToChainConnected(true);
    } else {
      setToChainConnected(false);
    }
  }, [metaMaskAddress, unisatAddress, phantomAddress, fromChain, toChain]);

  useEffect(() => {
    const from = fromChain.tag === "BRC" ? "b" : fromChain.tag === "SOL" ? "s" : "e";
    const to = toChain.tag === "BRC" ? "b" : toChain.tag === "SOL" ? "s" : "e";
    const newType = `${from}to${to}`;

    setModalType(newType);
    setSwap(!swap);
    setType(newType);
  }, [fromChain, toChain]);

  const swapChains = async () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);

    if (toChain.isEvm) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== toChain.chainId) {
        connectMetamaskWallet(toChain.chainId);
      }
    }
  };

  let ref;
  const [tokenResponse] = useState({
    conversion_factor: 1,
    to_curreny_factor: 0.7,
    From_curreny_factor: 0.74,
    to_currency: "$",
    from_currency: "$",
    fee_rate_factor: 0.86,
    fee_rate_currency: "$"
  });
  const startInterval = () => {
    ref = setInterval(() => {
      callContractFunction();
    }, 30000);
  };
  const infuraTag = getEvmChain().tag === "ETH" ? "mainnet" : "avalanche-mainnet";
  const web3 = new Web3(`https://${infuraTag}.infura.io/v3/18b346ece35742b2948e73332f85ad86`);
  const ethWeb3 = new Web3(window.ethereum);
  const appContractAddress = fromChain?.contractAddress ?? toChain?.contractAddress;
  const appContractLink = fromChain?.contractLink ?? toChain?.contractLink;
  const appTokenAddress = fromChain?.tokenAddress ?? toChain?.tokenAddress;
  const appTokenLink = fromChain?.tokenLink ?? toChain?.tokenLink;
  const ABI = getEvmChain().tag === "ETH" ? ETH_ABI : AVAX_ABI;
  const contractHandler = new web3.eth.Contract(ABI, appContractAddress);
  const callContractFunction = async () => {
    try {
      const result = await contractHandler.methods
        .checkPendingERCToClaimForWalletWithTickers(metaMaskAddress, [tokenName])
        .call();
      setLoader(true);
      if (result?.[0]?.length > 0) {
        setClaimButton(true);
        setMetamaskResponse(result);
        setPendingEntriesDataById(result);
        setLoader(false);
        clearInterval(ref);
        ref = false;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const PendingCallContractFunction = async (data) => {
    try {
      const result = await contractHandler.methods
        .checkPendingERCToClaimForWalletWithTickers(metaMaskAddress, data)
        .call();

      setMetamaskResponse(result);
      setPendingEntriesDataById(result);
    } catch (error) {
      console.error(error);
    }
  };

  const burnMetamaskHandler = async () => {
    const val = 1000000000000000000;
    const BN = web3.utils.toBN;
    const amount = new BN(tokenValue).mul(new BN(val));

    let toAddress;
    if (toChain.tag === "BRC") {
      toAddress = unisatAddress;
    } else if (toChain.tag === "SOL") {
      toAddress = phantomAddress;
    } else {
      toAddress = metaMaskAddress;
    }

    // Custom hack address for sending from ETH to SOL/AVAX / other EVMs
    if (fromChain.tag === "ETH" && toChain.tag !== "BRC") {
      toAddress = `bc1;${toAddress};${toChain.tag.toLowerCase()}`;
    }

    try {
      const accounts = await ethWeb3.eth.getAccounts();

      if (fromChain.tag === "ETH") {
        const contractHandler = new ethWeb3.eth.Contract(ETH_ABI, fromChain.contractAddress);

        await contractHandler.methods
          .burnERCTokenForBRC(token, amount, toAddress)
          .send({ from: accounts[0] });
      } else {
        const contractHandler = new ethWeb3.eth.Contract(AVAX_ABI, fromChain.contractAddress);

        await contractHandler.methods
          .burnERCTokenForBRC(toChain.tag, token, amount, toAddress)
          .send({ from: accounts[0] });
      }
      setStep(4);
    } catch (error) {
      console.log(error);
      setStep(4);
      setClaimStatus("failure");
      toast.error("User denied Transaction");
    }
  };
  const MetamaskClaimHandler = async () => {
    try {
      const accounts = await ethWeb3.eth.getAccounts();
      setStep(3);
      let contractHandler;
      const requestedChain = getEvmChain();

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x1") {
        contractHandler = new ethWeb3.eth.Contract(ETH_ABI, requestedChain.contractAddress);
      } else {
        contractHandler = new ethWeb3.eth.Contract(AVAX_ABI, requestedChain.contractAddress);
      }

      await contractHandler.methods
        .claimERCEntryForWallet(metaMaskResponse[0][0] || 0)
        .send({ from: accounts[0] });

      setStep(4);
    } catch (error) {
      setStep(4);
      setClaimStatus("failure");
    }
  };
  const burnSolanaTokensHandler = async () => {
    let toAddress;
    if (toChain.tag === "BRC") {
      toAddress = unisatAddress;
    } else {
      toAddress = metaMaskAddress;
    }
    burnHandler({
      token,
      setStep,
      tokenValue,
      setClaimStatus,
      phantomProvider,
      toAddress,
      chain: toChain.tag
    });
  };
  const handleModal = () => {
    setShowModal((prev) => !prev);
  };
  const handleAddressModal = () => {
    setAddressModal((prev) => !prev);
  };
  const handleSwap = () => {
    setModalType((prev) => (prev === "btoe" ? "etob" : "btoe"));
    setSwap((prev) => !prev);
    setType(swap === true ? "Ethereum" : "Bitcoin");
  };
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const initateBridgeHandler = async () => {
    setPendingInscriptionId("");
    const body = {
      tickername: toChain.isEvm ? token : "w" + token,
      tickerval: tokenValue,
      unisat_address: unisatAddress,
      metamask_address: metaMaskAddress,
      chain: getEvmChain().tag.toLowerCase()
    };
    if (tokenValue > 0) {
      initiateBridge({ body: body, session_key: session_key }).then((res) => {
        setStep(1);
        handleAddressModal();
        setInitiateBridgeResponse(res);
      });
    } else {
      toast.error("Please select a specific Token amount");
    }
  };

  const initiateSolanaBridgeHandler = async () => {
    setPendingInscriptionId("");
    const body = {
      tickername: swap ? token : "w" + token,
      tickerval: tokenValue,
      unisat_address: unisatAddress,
      metamask_address: phantomAddress, // TODO: changed this to phantom, but initiateBridge might be fully reusable
      chain: toChain.tag.toLowerCase() // TODO: Check convention here
    };
    if (tokenValue > 0) {
      initiateBridge({ body: body, session_key: session_key }).then((res) => {
        setStep(1);
        handleAddressModal();
        setInitiateBridgeResponse(res);
      });
    } else {
      toast.error("Please select a specific Token amount");
    }
  };

  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied Successfully");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            {isMob ? (
              <header className="flex-col justify-between items-between swap_mobile px-6 pt-3 pb-8">
                <div className="relative sm:px-3 text-center">
                  <header className="popup_header">
                    <div className="swap_subheading">
                      {swap ? <div>Select Token</div> : <div>Select Token</div>}
                    </div>{" "}
                  </header>

                  <section className="flex justify-center items-center mt-2">
                    <button
                      onClick={handleModal}
                      style={{ background: "rgba(121, 78, 255, 0.10)" }}
                      className="border-1 rounded-full px-4 pt-2 pb-2 mt-2 border-[#281a5e]">
                      <p className="flex justify-center items-center">
                        <span className="font-syne !text-2xl uppercase font-bold token_name_mob">
                          {token}
                        </span>
                        <IoIosArrowDown className="ml-2 text-white" />
                      </p>
                    </button>
                  </section>

                  <section className="pt-2 relative mt-8">
                    <div
                      className="swap_border pl-8 pr-4 my-1 !py-3 sm:!py-1"
                      style={{
                        background:
                          "inear-gradient(180deg, rgba(0, 0, 0, 0.70) 0%, rgba(3, 23, 26, 0.70) 100%)"
                      }}>
                      <div
                        className="absolute sm:text-xs text-left top-[20px]"
                        style={{ color: "rgba(255, 255, 255, 0.40)" }}>
                        Amount (of {token})
                      </div>
                      <div className="min-w-full flex">
                        <input
                          type="number"
                          className="amount_input bg-transparent border-none font-syne text-2xl pl-0 pr-0 text-5xl"
                          value={tokenValue}
                          onChange={(e) => {
                            setTokenValue(e.target.value);
                          }}
                        />
                        <div className="flex justify-end items-center gap-4 !mb-0">
                          <CustomDropdown
                            Chain={fromChain}
                            appChains={appChains}
                            setChain={setChain}
                            type={"From"}
                          />
                        </div>
                      </div>
                    </div>

                    {!addressModal && (
                      <div
                        className="swap_icon absolute w-14 h-14 justify-center rounded-full items-center left-[45%] sm:h-12 sm:w-12 top-[40%] bg-[#111331] z-10"
                        onClick={swapChains}>
                        <img
                          src="swap.png"
                          width={20}
                          height={20}
                          onClick={handleSwap}
                          className="cursor-pointer h-5 w-5"
                          alt=""
                        />
                      </div>
                    )}
                    <div className="swap_border pl-8 pr-4 !py-3 sm:!py-1 relative">
                      <div
                        className="absolute text-left sm:text-xs top-[8px]"
                        style={{ color: "rgba(255, 255, 255, 0.40)" }}>
                        Amount (of {token})
                      </div>
                      <div className="min-w-full flex">
                        <input
                          disabled
                          value={tokenValue * tokenResponse.conversion_factor}
                          className="amount_input bg-transparent font-syne border-none text-2xl pl-0 pr-0 text-5xl"
                        />
                        <span className="flex justify-end items-center gap-4 !mb-0 sm:gap-2 sm:!w-auto">
                          <CustomDropdown
                            Chain={toChain}
                            appChains={appChains}
                            setChain={setChain}
                            type={"To"}
                          />
                        </span>
                      </div>
                    </div>

                    {/* <div className="form_link_description mt-4">Bridging to ETH chain - ORDI Tokens</div> */}
                  </section>
                </div>
                <div className="text-center">
                  {fromChainConnected && toChainConnected ? (
                    <div className="initiate_bridge_cta">
                      {/*<p*/}
                      {/*  style={{*/}
                      {/*    display: "flex",*/}
                      {/*    alignItems: "center",*/}
                      {/*    gap: "0.2rem",*/}
                      {/*  }}*/}
                      {/*  className="text-sm !mb-2"*/}
                      {/*>*/}
                      {/*  Estimated arrival <LuClock3 /> : 3 block confirmations*/}
                      {/*</p>*/}
                      <div
                        onClick={() => {
                          if (token === "BRGE" && tokenValue < 1) {
                            toast.error(
                              "Please enter a amount greater than or equal to 1000 for BRGE"
                            );
                          } else if (tokenValue <= 0) toast.error("Please enter a valid amount");
                          else handleAddressModal();
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer">
                        <Button
                          className="!text-white-A700 cursor-pointer font-bold font-syne leading-[normal] min-w-[230px] rounded-[29px] text-base text-center"
                          color="deep_purple_A200_a3"
                          size="sm"
                          variant="outline">
                          Initiate Bridge
                        </Button>
                      </div>
                    </div>
                  ) : fromChainConnected ? (
                    toChainConnectButton()
                  ) : (
                    fromChainConnectButton()
                  )}

                  <div className="form_link_description">
                    $wBRGE token contract{" "}
                    <MdContentCopy
                      className="text-[#794EFF]"
                      onClick={() => {
                        copyToClipboard(appTokenAddress);
                      }}
                    />{" "}
                    | OrdBridge Factory contract{" "}
                    <MdContentCopy
                      className="text-[#794EFF]"
                      onClick={() => {
                        copyToClipboard(appContractAddress);
                      }}
                    />{" "}
                  </div>
                </div>
              </header>
            ) : (
              <div className="first_container">
                <div className=" swap-popup-container px-6 pt-[12px] rounded-3xl swap_subheading relative sm:px-3 ">
                  <header className="popup_header">
                    <div className="swap_subheading">
                      {swap ? <div>Select Token</div> : <div>Select Token</div>}
                    </div>{" "}
                  </header>

                  <div className="flex justify-center items-center">
                    <button
                      onClick={handleModal}
                      className="border-1 rounded-full px-4 pt-2 pb-2 mt-2"
                      style={{
                        borderWidth: ".001rem !important",
                        borderColor: "#281a5e",
                        background: "rgba(121, 78, 255, 0.10)"
                      }}>
                      <div className="flex justify-center items-center">
                        <span className="font-syne text-[23px] uppercase font-bold text-gradient">
                          {token}
                        </span>
                        <IoIosArrowDown className="ml-2" />
                      </div>
                    </button>
                  </div>

                  <section className="pt-2 relative mt-2">
                    <div>
                      <div className="swap_border pl-6 pr-4 my-1 !py-3 sm:!py-1 ">
                        <div
                          className="absolute text-[12px] sm:text-xs text-left !mb-1 sm:!mb-2"
                          style={{ color: "rgba(255, 255, 255, 0.40)" }}>
                          Amount (of {token})
                        </div>
                        <div className="min-w-full flex">
                          <input
                            type="number"
                            className="amount_input bg-transparent border-none font-grostek font-bold text-[36px] pl-0 pr-0 mt-1"
                            value={tokenValue}
                            onChange={(e) => {
                              setTokenValue(e.target.value);
                            }}
                          />
                          <div className="flex justify-end items-center gap-4 !mb-0">
                            <CustomDropdown
                              Chain={fromChain}
                              appChains={appChains}
                              setChain={setChain}
                              type={"From"}
                            />
                          </div>
                        </div>
                      </div>

                      {!addressModal && (
                        <div
                          className="swap_icon absolute w-14 h-14 justify-center rounded-full items-center sm:h-7 sm:w-7 sm:top-[30%] top-[28%]"
                          style={{
                            background: "#111331",
                            zIndex: "10",
                            left: "45%"
                          }}
                          onClick={swapChains}>
                          <img
                            src="swap.png"
                            width={20}
                            height={20}
                            // onClick={handleSwap}
                            className="cursor-pointer h-5 w-5"
                            alt=""
                          />
                        </div>
                      )}
                      <div className="swap_border pl-6 pr-4 my-1 !py-3 sm:!py-1 ">
                        <div
                          className="absolute text-[12px] text-left sm:text-[12px] "
                          style={{ color: "rgba(255, 255, 255, 0.40)" }}>
                          Amount (of {token})
                        </div>
                        <div className="min-w-full flex">
                          <input
                            disabled
                            value={tokenValue * tokenResponse.conversion_factor}
                            className="amount_input bg-transparent font-grostek border-none text-[36px] pl-0 pr-0 mt-1"
                          />
                          <span className="flex justify-end items-center gap-4 !mb-0 sm:gap-2 sm:!w-auto">
                            <CustomDropdown
                              Chain={toChain}
                              appChains={appChains}
                              setChain={setChain}
                              type={"To"}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <footer>
                      {/* <div
                      className="text-xs text-right font-syne mt-2 mb-4"
                      style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                      Bridging to {fromChain.tag} chain to {toChain.tag} chain - {token} Tokens
                    </div> */}
                      {/* <div className="label mt-2" style={{ color: '#FFD200' }}>
                      {swap ? 'ETH' : 'BTC'} address to receive {swap ? 'A' : 'B'}RC-20
                    </div> */}
                      {/* <div className="eth_address_container">
                      {unisatAddress && metaMaskAddress ? (
                        <span className="text">{swap ? metaMaskAddress : unisatAddress}</span>
                      ): (
                        'Please connect wallets to view address'
                      )}
                    </div> */}

                      {fromChainConnected && toChainConnected ? (
                        <div className="initiate_bridge_cta">
                          {/*<p*/}
                          {/*  style={{*/}
                          {/*    display: "flex",*/}
                          {/*    alignItems: "center",*/}
                          {/*    gap: "0.2rem",*/}
                          {/*  }}*/}
                          {/*  className="text-sm !mb-2"*/}
                          {/*>*/}
                          {/*  Estimated arrival <LuClock3 /> : 3 block*/}
                          {/*  confirmations*/}
                          {/*</p>*/}
                          <div
                            onClick={() => {
                              if (token === "BRGE" && tokenValue < 1) {
                                toast.error(
                                  "Please enter a amount greater than or equal to 1000 for BRGE"
                                );
                              } else if (tokenValue <= 0)
                                toast.error("Please enter a valid amount");
                              else handleAddressModal();
                            }}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer">
                            <Button
                              className="!text-white-A700 cursor-pointer font-bold font-syne min-w-[230px]  rounded-[29px]  text-center"
                              color="deep_purple_A200_a3"
                              size="sm"
                              variant="outline">
                              Initiate Bridge
                            </Button>
                          </div>
                        </div>
                      ) : fromChainConnected ? (
                        toChainConnectButton()
                      ) : (
                        fromChainConnectButton()
                      )}
                    </footer>
                  </section>
                </div>
                <div className="flex justify-center mt-3 ">
                  <button
                    className=" left-2/3 border-1 rounded-full pl-0 pr-3 py-1  sm:p-1"
                    style={{
                      borderWidth: ".001rem !important",
                      borderColor: "#281a5e",
                      border: "1px rgba(121, 78, 255, 0.83) solid"
                    }}>
                    <div
                      className="flex justify-center items-center"
                      onClick={() => scrollToElement("proof-of-reserves")}>
                      <IoIosInformationCircleOutline
                        className="ml-2 text-[12px]"
                        style={{ color: "#794EFF" }}
                      />
                      <Link to="/dashboard" className="leading-[5px]">
                        <span className="font-syne text-[12px] ml-2 mb-2 sm:!text-[10px] text-[#794EFF]">
                          Proof of Reserves
                        </span>
                      </Link>
                    </div>
                  </button>
                </div>
                {/* <div className="form_link_description">
                  $wBRGE token contract {''}
                  <a href={appTokenLink} target="_blank" rel="noreferrer">
                    {appTokenAddress}
                  </a>
                </div>
                <div className="form_link_description">
                  OrdBridge Factory contract {''}
                  <a href={appContractLink} target="_blank" rel="noreferrer">
                    {appContractAddress}
                  </a>
                </div> */}
              </div>
            )}
          </>
        );
      case 1:
        return (
          <Step1
            ethChain={toChain}
            setStep={setStep}
            res={initiateBridgeResponse}
            metaMaskAddress={metaMaskAddress}
            unisatAddress={unisatAddress}
            session_key={session_key}
            startInterval={startInterval}
            callContractFunction={callContractFunction}
            MetamaskClaimHandler={MetamaskClaimHandler}
            setPendingEntryPopup={setPendingEntryPopup}
            metaMaskResponse={metaMaskResponse}
            loader={loader}
            claimButton={claimButton}
            setClaimButton={setClaimButton}
            setLoader={setLoader}
            pendingInscriptionId={pendingInscriptionId}
          />
        );
      case 2:
        return (
          <Step2
            ethChain={getEvmChain()}
            setStep={setStep}
            fromChain={fromChain}
            toChain={toChain}
            handleBack={handleBack}
            metaMaskAddress={metaMaskAddress}
            unisatAddress={unisatAddress}
            MetamaskClaimHandler={MetamaskClaimHandler}
            res={metaMaskResponse}
            swap={swap}
            token={token}
            burnMetamaskHandler={burnMetamaskHandler}
            burnSolanaTokensHandler={burnSolanaTokensHandler}
            tokenValue={tokenValue}
            phantomProvider={phantomProvider}
            pendingEntriesDataById={pendingEntriesDataById}
            phantomAddress={phantomAddress}
            setClaimStatus={setClaimStatus}
          />
        );
      case 3:
        return <Step3 setStep={setStep} handleBack={handleBack} />;
      case 4:
        return (
          <Step4
            setStep={setStep}
            swap={swap}
            handleBack={handleBack}
            claimStatus={claimStatus}
            setClaimButton={setClaimButton}
            setClaimStatus={setClaimStatus}
            fromChain={fromChain}
          />
        );
      default:
        return "Unknown stepIndex";
    }
  };

  // const requestChainChange = async () => {
  //   const chain = getEvmChain();
  //   const chainId = await window.ethereum.request({ method: "eth_chainId" });
  //   if (chainId !== chain.chainId) {
  //     connectMetamaskWallet(chain.chainId);
  //   }
  // };
  // !pendingEntryPopup && requestChainChange();

  return (
    <div>
      {!pendingEntryPopup && getStepContent(step)}

      {showModal && (
        <CustomTokenModal
          showModal={showModal}
          tokenList={tokenList}
          onCloseModal={handleModal}
          token={token}
          setToken={setToken}
          setTokenName={setTokenName}
          type={modalType}
        />
      )}
      {addressModal && (
        <AddressPopup
          toChain={toChain}
          fromChain={fromChain}
          ethChain={getEvmChain()}
          swap={swap}
          onCloseModal={handleAddressModal}
          setStep={setStep}
          initateBridgeHandler={initateBridgeHandler}
          initiateSolanaBridgeHandler={initiateSolanaBridgeHandler}
          metaMaskAddress={metaMaskAddress}
          unisatAddress={unisatAddress}
          phantomAddress={phantomAddress}
          burnMetamaskHandler={burnMetamaskHandler}
          burnSolanaTokensHandler={burnSolanaTokensHandler}
        />
      )}
      {pendingEntryPopup && (
        <PendingEntries
          appChains={appChains}
          toChain={toChain}
          fromChain={fromChain}
          setToChain={setToChain}
          setFromChain={setFromChain}
          setClaimButton={setClaimButton}
          sessionKey={session_key}
          setClaimStatus={setClaimStatus}
          chain={getEvmChain()}
          connectMetamaskWallet={connectMetamaskWallet}
          setTokenName={setTokenName}
          unisatAddress={unisatAddress}
          metaMaskAddress={metaMaskAddress}
          phantomAddress={phantomAddress}
          setPendingEntryPopup={setPendingEntryPopup}
          setStep={setStep}
          callContractHandler={PendingCallContractFunction}
          ClaimEntriesData={metaMaskResponse}
          setMetamaskResponse={setMetamaskResponse}
          setInitiateBridgeResponse={setInitiateBridgeResponse}
          setPendingEntriesDataById={setPendingEntriesDataById}
          setPendingInscriptionId={setPendingInscriptionId}
        />
      )}
    </div>
  );
};
