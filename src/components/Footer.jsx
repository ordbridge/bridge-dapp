import React from "react";
import "../styles/footer.css";
import { Logo } from "./Logo";
import { useLocation } from "react-router-dom";
import LpFooter from "./LPFooter";

export const Footer = () => {
  const location = useLocation();
  console.log(location, "Location");
  return (
    <div>
      <LpFooter />
      {/*{location?.pathname == "/" ? (*/}
      {/*  <LpFooter />*/}
      {/*) : (*/}
      {/*  <div className="footer_container">*/}
      {/*    <div>*/}
      {/*      <Logo />*/}
      {/*      <div className="footer_content mt-2">*/}
      {/*        A crosschain bridge to move BRC-20 to any chain.*/}
      {/*      </div>*/}
      {/*      <div className="contactInfo">*/}
      {/*        <div className="footer_content">Contact:</div>*/}
      {/*        <a*/}
      {/*          className="footer_content link"*/}
      {/*          href="mailto:tech@ordbridge.io"*/}
      {/*        >*/}
      {/*          tech@ordbridge.io*/}
      {/*        </a>*/}
      {/*      </div>*/}
      {/*      <div className="footer_content socials">*/}
      {/*        {" "}*/}
      {/*        <a*/}
      {/*          href="https://twitter.com/OrdBridge"*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          <img src="Twitter.png" className="twitter_logo" alt="" />*/}
      {/*        </a>*/}
      {/*        |*/}
      {/*        <a*/}
      {/*          href="https://discord.com/invite/6netagdQTH"*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          <img src="discordLogo.png" className="twitter_logo" alt="" />*/}
      {/*        </a>*/}
      {/*        |*/}
      {/*        <a*/}
      {/*          href="https://t.me/ordbridgefi"*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          <img src="Logo.svg" className="twitter_logo me-2" alt="" />*/}
      {/*        </a>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="footer_right_section">*/}
      {/*      <div>*/}
      {/*        <a*/}
      {/*          className="footer_content"*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*          href="https://ordbridge-organization.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/"*/}
      {/*        >*/}
      {/*          Gitbook Docs*/}
      {/*        </a>*/}
      {/*        <a*/}
      {/*          className="footer_content"*/}
      {/*          target="_blank"*/}
      {/*          href="https://ordbridge.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/how-it-works/technical-overview/brc-20-and-ARC-20"*/}
      {/*          rel="noreferrer"*/}
      {/*        >*/}
      {/*          What is BRC-20*/}
      {/*        </a>*/}
      {/*      </div>*/}
      {/*      <div>*/}
      {/*        <a*/}
      {/*          className="footer_content"*/}
      {/*          target="_blank"*/}
      {/*          rel="noreferrer"*/}
      {/*          href="https://ordbridge.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/how-it-works/bridging-process"*/}
      {/*        >*/}
      {/*          How does bridge work?*/}
      {/*        </a>*/}
      {/*        <a className="footer_content" href="/">*/}
      {/*          {" "}*/}
      {/*          Bridge BRC-20 tokens*/}
      {/*        </a>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};
