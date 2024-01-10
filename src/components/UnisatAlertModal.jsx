import React from "react";

export const UnisatAlertModal = ({ setIsMobile }) => {
  return (
    <div id="myModal" className="custom_modal address_modal z-[10000000000]">
      <div className="confirm_modal rounded-3xl background_popup !z-40 p-4">
        <div className="font-syne font-medium text-xl">
          <div className="text-white text-base text-center">
            <span className="text-xl font-bold">Uh-oh!</span>
            <br />
            <br />
            Looks like your device does not have a Unisat wallet. Ordbridge
            works best with Unisat wallet. <br />
            <br />
            Extending support to other wallets shortly. Stay tuned 🚀
          </div>
        </div>
        <div className="connect_wallet_button flex justify-center items-center">
          <button
            className="initiate_button border-1 rounded-xl w-max text-[#FF4E4E] font-semibold px-5 mt-2 text-lg"
            style={{ borderColor: "#FF4E4E" }}
            onClick={() => {
              setIsMobile((prev) => !prev);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
