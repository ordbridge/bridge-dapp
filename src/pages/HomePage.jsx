import "../styles/home.page.css";
import React, { useEffect, useState } from "react";
import { SwapPopup } from "../components/SwapPopup";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa";
import { UnisatAlertModal } from "../components/UnisatAlertModal";

const HomePage = ({
  step,
  setStep,
  toChain,
  setToChain,
  fromChain,
  setFromChain,
  appChains,
  unisatAddress,
  connectUnisatWallet,
  setType,
  type,
  metaMaskAddress,
  connectMetamaskWallet,
  phantomAddress,
  connectPhantomWallet,
  session_key,
  pendingEntryPopup,
  setPendingEntryPopup,
  isMobile,
  setIsMobile
}) => {
  // const [tokenList, setTokenList] = useState([]);

  const [tokenList, setTokenList] = useState([]);
  const [token, setToken] = useState("");
  // const [isScrolledToTop, setIsScrolledToTop] = useState(true);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrolledToTop = window.scrollY === 0;
  //     setIsScrolledToTop(scrolledToTop);
  //   };

  //   // Attach the event listener when the component mounts
  //   window.addEventListener('scroll', handleScroll);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []); // Empty dependency array ensures that the effect runs only once when the component mounts

  // async function copyToClipboard(text) {
  //   try {
  //     const toCopy = text.slice(0, text.length);
  //     await navigator.clipboard.writeText(toCopy);
  //     toast.success('Copied Value to Clipboard');
  //   } catch (err) {}
  // }

  useEffect(() => {
    (async () => {
      const res = await axios.get("https://api.ordbridge.io/bapi/bridge/tickers_controlled");
      setTokenList(res.data);
      setToken(res.data?.[0]);
    })();
  }, []);
  return (
    <>
      <div className="">
        <div className="pt-32 min-h-screen swap_mobile_container sm:pt-0">
          <SwapPopup
            step={step}
            setStep={setStep}
            token={token}
            setToken={setToken}
            toChain={toChain}
            setToChain={setToChain}
            fromChain={fromChain}
            setFromChain={setFromChain}
            appChains={appChains}
            tokenList={tokenList}
            setType={setType}
            type={type}
            unisatAddress={unisatAddress}
            metaMaskAddress={metaMaskAddress}
            phantomAddress={phantomAddress}
            connectUnisatWallet={connectUnisatWallet}
            connectMetamaskWallet={connectMetamaskWallet}
            connectPhantomWallet={connectPhantomWallet}
            session_key={session_key}
            pendingEntryPopup={pendingEntryPopup}
            setPendingEntryPopup={setPendingEntryPopup}
          />
        </div>

        {/* {!isScrolledToTop && (
          <button
            className="border-1 rounded-full px-4 pt-2 pb-2 mt-2 fixed bottom-8 right-4"
            style={{
              borderWidth: '.001rem !important',
              borderColor: '#281a5e',
              background:
                'linear-gradient(0deg, rgba(150,112,255,1) 0%, rgba(26,20,67,1) 1%, rgba(22,20,63,1) 100%)',
              zIndex: '10000'
            }}>
            <div
              className="flex justify-center items-center cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
              }}>
              <span className="font-syne !text-base uppercase font-normal text-white">
                Go to top
              </span>
              <FaArrowUp className="ml-2 text-[#794EFF]" />
            </div>
          </button>
        )} */}

        {isMobile && <UnisatAlertModal setIsMobile={setIsMobile} />}
      </div>
    </>
  );
};

export default HomePage;
