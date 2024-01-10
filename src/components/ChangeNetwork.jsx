import React from "react";
import processIcon from "../assets/Process.svg";
export const ChangeNetwork = ({ onCloseModal }) => {
  return (
    <div id="myModal" className="custom_modal address_modal">
      <div className="confirm_modal">
        <div className="custom_modal-header">
          <div className="modal_address p-4">
            <div className="confirm_modal_head">
              <img src={processIcon} alt="" />
              <span className="fs-4">
                Please change your Metamask to Ethereum Mainnet Network first.
              </span>
            </div>
            <div className="flex">
              <div className="connect_wallet_button">
                <button className="initiate_button" onClick={onCloseModal}>
                  {" "}
                  {`<Back`}
                </button>
              </div>
              <div className="connect_wallet_button">
                <button className="initiate_button" onClick={onCloseModal}>
                  {" "}
                  {`Change It`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeNetwork;
