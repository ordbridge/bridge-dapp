import React from "react";
import Text from "./Text";
import Telegram from "../assets/Telegram.png";
import Twitter from "../assets/Twitter.png";
import Discord from "../assets/Discord.png";
import { appChains } from "../utils/chains";

const LpFooter = () => {
  const TokenItem = ({ name, token, link }) => {
    return (
      <div className=" leading-loose  text-[12px] text-[#E4DCFF] font-grostek  text-center "  >
        <span className=" " >{name}:&nbsp;</span>
        <span className="col-span-3" >
          <a href={link} target="_blank" rel="noreferrer" className="hover:underline">
            {token}
          </a>
        </span>
      </div>
    );
  };

  const tokensData = appChains.filter((item) => item.name !== "Bitcoin");
  return (
    <div className="flex flex-col justify-center items-center text-white gap-4 pt-20 pb-10 md:px-5">
      <Text
        className="text-5xl text-blue-200 md:pr-0 pr-12 cursor-pointer !mb-0"
        size="txtPlusJakartaSansRomanBold36"
      >
        <span className="text-purple-700 font-syne text-left font-bold">
          Ord
        </span>
        <span className="text-white-A700 font-syne text-left font-normal">
          Bridge
        </span>
      </Text>
      <p className="text-center text-[#E4DCFF] font-grostek ">
        A crosschain bridge to move BRC-20 to any chain.
      </p>

      <div className="flex  gap-10 font-grostek flex-wrap ">
        <a href="https://ordbridge.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/" className="text-[#E4DCFF] text-[16px] text-nowrap">
          Gitbook Docs
        </a>
        <a href="https://ordbridge.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/how-it-works/bridging-process" className="text-[#E4DCFF] text-[16px] text-nowrap">
          How does bridge work?
        </a>
        <a href="https://ordbridge.gitbook.io/ordbridge-a-2-way-bridge-between-brc20-and-erc20/how-it-works/technical-overview/brc-20-and-erc-20" className="text-[#E4DCFF] text-[16px] text-nowrap">
          What is BRC-20
        </a>
        <a href="" className="text-[#E4DCFF] text-[16px] text-nowrap">
          Bridge BRC-20 tokens
        </a>
      </div>

      <div className="lp-footer-break" />
      <div>
        {tokensData.map((item) => (
          <TokenItem
            name={item.name}
            link={item.tokenLink}
            token={item.tokenAddress}
          />
        ))}
      </div>
      <p className="text-[24px] font-syne md:text-center">
        Contact at <a href="mailto:tech@ordibridge.io">tech@ordibridge.io</a>
      </p>
      <div className="flex gap-10 ">
        <a href="https://t.me/ordbridgefi">
          <img src={Telegram} alt="" />
        </a>
        <a href="https://twitter.com/OrdBridge">
          <img src={Twitter} alt="" />
        </a>
        <a href="https://t.me/ordbridgefi">
          <img src={Discord} alt="" />
        </a>
      </div>
    </div>
  );
};

export default LpFooter;
