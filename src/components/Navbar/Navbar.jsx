import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/navbar.css";
import SideMenu from "../SideMenu";
import Text from "../Text";
import ConnectMetaMaskWallet from "./ConnectMetaMaskWallet";
import ConnectPhantomWallet from "./ConnectPhantomWallet";
import ConnectUnisatWallet from "./ConnectUnisatWallet";
import HamburderIcon from "../../assets/hamburger.png";
import { appChains, getWalletStringForType } from "../../utils/chains";

const Navbar = ({
  connectUnisatWallet,
  unisatAddress,
  type,
  connectMetamaskWallet,
  metaMaskAddress,
  connectPhantomWallet,
  phantomAddress,
  sessionKey,
  pendingEntryPopup,
  setPendingEntryPopup,
  setStep,
  fromChain,
  setFromChain,
  setToChain
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSideMenu = () => {
    const side_menu = document.getElementById("side_menu");
    if (side_menu.classList.contains("closed")) {
      side_menu.classList.remove("closed");
    } else {
      side_menu.classList.add("closed");
    }
  };
  const [walletsSet, setWalletsSet] = useState(false);

  useEffect(() => {
    const from = getWalletStringForType(type[0]);
    const to = getWalletStringForType(type[3]);

    const walletConfig = [from, to];

    if (walletConfig.includes("unisat") && !(unisatAddress && unisatAddress !== "")) {
      setWalletsSet(false);
      return;
    }

    if (walletConfig.includes("phantom") && !(phantomAddress && phantomAddress !== "")) {
      setWalletsSet(false);
      return;
    }
    if (walletConfig.includes("metamask") && !(metaMaskAddress && metaMaskAddress !== "")) {
      setWalletsSet(false);
      return;
    }

    setWalletsSet(true);
  }, [unisatAddress, metaMaskAddress, phantomAddress, type]);

  const executeVeryBadLogicForNavigatingToHome = () => {
    setStep(0);
    if (pendingEntryPopup) {
      setPendingEntryPopup((prev) => !prev);
    } else {
      navigate("/");
    }
  };

  const getWalletForType = (chainType) => {
    if (chainType === "b") {
      return <ConnectUnisatWallet onConnectClick={connectUnisatWallet} address={unisatAddress} />;
    }
    if (chainType === "e") {
      return (
        <ConnectMetaMaskWallet onConnectClick={connectMetamaskWallet} address={metaMaskAddress} />
      );
    }
    if (chainType === "s") {
      return (
        <ConnectPhantomWallet onConnectClick={connectPhantomWallet} address={phantomAddress} />
      );
    }
  };

  return (
    <>
      <SideMenu
        handleSideMenu={handleSideMenu}
        type={type}
        setPendingEntryPopup={setPendingEntryPopup}
        connectMetamaskWallet={connectMetamaskWallet}
        metaMaskAddress={metaMaskAddress}
        unisatAddress={unisatAddress}
        connectUnisatWallet={connectUnisatWallet}
        phantomAddress={phantomAddress}
        connectPhantomWallet={connectPhantomWallet}
        setStep={setStep}
        navToHome={executeVeryBadLogicForNavigatingToHome}
        fromChain={fromChain}
        setFromChain={setFromChain}
        setToChain={setToChain}
      />
      <div className="flex py-3 pl-10 md:flex-col flex-row md:gap-5 items-center justify-between pr-6 z-[10000] border-none border-r-0 border-l-0  border-b navbar-container">
        <section className="flex gap-2 font-syne items-center justify-start w-auto">
          <Link to="/">
            <Text
              className="text-3xl text-blue-200 pr-12 cursor-pointer !mb-0"
              size="txtPlusJakartaSansRomanBold36">
              <span className="text-purple-700 font-syne text-left font-bold">Ord</span>
              <span className="text-white-A700 font-syne text-left font-normal">Bridge</span>
            </Text>
          </Link>

          <section className="font-grostek flex">
            <p
              className="text-white-A700 text-base cursor-pointer ml-6 mt-1 !mb-0 block sm:hidden font-grostek"
              onClick={() => {
                navigate("/bridge");
                setStep(0);
                setPendingEntryPopup(false);
              }}>
              Bridge
            </p>

            <Link to="">
              <p className="text-white-A700 text-base cursor-pointer ml-6 mt-1 !mb-0 block sm:hidden font-grostek relative">
                Staking{" "}
                <span className="font-thin font-syne text-nowrap  text-[10px] text-gradient absolute -bottom-[10px] left-0">
                  coming soon
                </span>
              </p>
            </Link>
            <p
              className="text-white-A700 text-base cursor-pointer ml-6 mt-1 !mb-0 block sm:hidden font-grostek"
              onClick={() => {
                window.open(
                  "https://ordbridge-organization.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/",
                  "_blank"
                );
              }}>
              Docs
            </p>
            <Link to="/dashboard">
              <p className="text-white-A700 text-base cursor-pointer ml-6 mt-1 !mb-0 block sm:hidden font-grostek">
                Dashboard
              </p>
            </Link>
            {location.pathname === "/bridge" && (
              <>
                <p
                  className="text-white-A700 text-base whitespace-nowrap cursor-pointer ml-6 mt-1 !mb-0 block sm:hidden font-grostek"
                  onClick={() => {
                    if (!walletsSet) {
                      toast.error("Please connect wallets first");
                    } else {
                      navigate("/bridge");
                      if (fromChain.tag === "BRC") {
                        setFromChain(appChains?.filter((ele) => ele.tag === "ETH")[0]);
                        setToChain(appChains?.filter((ele) => ele.tag === "BRC")[0]);
                      }
                      setPendingEntryPopup(true);
                    }
                  }}>
                  Pending Entries
                </p>
              </>
            )}
          </section>
        </section>

        {location.pathname === "/bridge" || location.pathname === "/pending-entries" ? (
          <section className="flex items-start gap-2  block md:hidden justify-end">
            {getWalletForType(type[0])}
            <AiOutlineArrowRight color="#FFFFFF" className="mt-[14px]" />
            {getWalletForType(type[3])}
          </section>
        ) : (
          <section className="md:hidden">
            <button
              className="landing-page-hero-content--button font-semibold"
              onClick={() => {
                window.open("/bridge");
              }}>
              Launch Bridge
            </button>
          </section>
        )}

        <img
          src={HamburderIcon}
          className="hamburger hidden md:block text-white text-xl"
          onClick={handleSideMenu}
          id="menu-btn"
          alt=""
        />
      </div>
    </>
  );
};

export default Navbar;
