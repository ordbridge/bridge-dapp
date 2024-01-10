import SolanaIcon from "../assets/solana_with_icon.png";
import Text from "./Text";
import { MdOutlineClose } from "react-icons/md";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

export const Banner = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const isBannerClosed = localStorage.getItem("bannerClosed");

    if (isBannerClosed === "true") {
      setShowBanner(false);
    }
  }, []);

  const closeBanner = () => {
    setShowBanner(false);

    localStorage.setItem("bannerClosed", "true");
  };

  return showBanner ? (
    <div>
      <Confetti height={60} opacity={0.5} gravity={0.02} numberOfPieces={150} />
      <div className="bg-[#271F3A] h-[60px] flex items-center justify-center text-syne text-white">
        <Text
          className="sm:hidden text-white-A700 text-base cursor-pointer ml-6 mr-2 !mb-0 block sm:text-md text-xl"
          size="txtSyneBold20"
        >
          We are live on{"  "}
        </Text>
        <Text
          className="sm:block hidden text-white-A700 text-base cursor-pointer ml-6 mr-2 !mb-0 block text-xl"
          size="txtSyneBold20"
        >
          Live on{"  "}
        </Text>
        <img src={SolanaIcon} alt="Solana" />

        <MdOutlineClose
          className="absolute right-4 cursor-pointer"
          onClick={closeBanner}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
