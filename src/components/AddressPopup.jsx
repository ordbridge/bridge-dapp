import React from "react";
import { toast } from "react-toastify";
import processIcon from "../assets/Process.svg";

export const AddressPopup = ({
  fromChain,
  toChain,
  ethChain,
  onCloseModal,
  initateBridgeHandler,
  initiateSolanaBridgeHandler,
  unisatAddress,
  metaMaskAddress,
  phantomAddress,
  swap,
  burnMetamaskHandler,
  burnSolanaTokensHandler,
}) => {
  const checkNetworkAndBurn = async () => {
    const appChainId = ethChain.chainId;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId === appChainId) {
      burnMetamaskHandler();
    } else {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: appChainId }],
        });

        burnMetamaskHandler();
      } catch (error) {
        onCloseModal();
        toast.error(error.message);
      }
    }
    // setStep(2);
    onCloseModal();
  };

  const handleBRC2SOL = async () => {
    onCloseModal();
  };

  const handleSOL2BRC = async () => {
    await burnSolanaTokensHandler();
    onCloseModal();
  };

  const toChainIsEvm = toChain.isEvm;

  const handleBridgeInitiation = async () => {
    // SOL -> any
    if (fromChain.tag === "SOL") {
      handleSOL2BRC();
    }
    // EVM  ->  SOL
    else if (toChain.tag === "SOL" && fromChain.tag === "BRC") {
      initiateSolanaBridgeHandler();
    }
    // BRC -> any
    else if (fromChain.tag === "BRC") {
      initateBridgeHandler();
    }
    // EVM -> EVM
    else {
      checkNetworkAndBurn();
    }
  };

  return (
    <>
      <div id="myModal" className="custom_modal address_modal">
        <div className="confirm_modal rounded-3xl background_popup !z-40 pb-4">
          <div className="custom_modal-header">
            <div className="modal_address">
              <div className="confirm_modal_head font-syne font-bold text-4xl">
                <img style={{ width: "6rem" }} src={processIcon} alt="" />
                <div className="modal_head_gradient_text">
                  Please Verify your
                </div>
                <div className="modal_head_gradient_text">
                  {toChain.name}
                  <span> address</span>
                </div>
              </div>
              <div
                className="address_modal_label rounded-full border-none px-4 py-3"
                style={{ background: "#794EFF33" }}
              >
                {toChain.tag === "BRC"
                  ? unisatAddress
                  : toChain.tag === "SOL"
                    ? phantomAddress
                    : metaMaskAddress}
              </div>
              {/* <div className="address_modal_description"> You can not edit or change it later.</div> */}
              <div className="address_modal_description">
                This is where you will receive {toChain.tokenTag} tokens.
              </div>
              <div className="flex justify-around gap-3">
                <div
                  className="connect_wallet_button border-1 rounded-full flex justify-center items-center border-[#FF4E4E]"
                  onClick={onCloseModal}
                >
                  <button className="initiate_button text-red-500 font-syne text-xl ">
                    Cancel
                  </button>
                </div>
                <div
                  className="connect_wallet_button bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl py-1 cursor-pointer"
                  style={{ width: "100%" }}
                  onClick={handleBridgeInitiation}
                  // onClick={() => {
                  //   toChainIsEvm ? initateBridgeHandler() : checkNetwork();
                  // }}
                >
                  <button className="initiate_button">
                    <span className="text-white font-syne text-xl">
                      Proceed
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
