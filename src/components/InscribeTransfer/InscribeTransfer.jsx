import React from "react";
import back from "../../assets/Back.svg";
import processIcon from "../../assets/Process.svg";
import "../../styles/FormStep.css";
import "../../styles/inscribe-transfer.css";

const InscribeTransfer = () => {
  return (
    <div className="inscribe_container">
      <div className="inscribe_main">
        <div className="inscribe_header">
          <img src={back} alt="" />
          <div>
            <img src={processIcon} alt="" />
            <span className="title"> Inscribe & transfer </span>
          </div>
        </div>

        <div className="inscribe_content">
          1. Inscribe this below json
          <div className="inscribe_json"></div>
        </div>
        <button className="active_button">Inscribe</button>
        <button className="inactive_button">Inscribe</button>
      </div>
    </div>
  );
};

export default InscribeTransfer;
