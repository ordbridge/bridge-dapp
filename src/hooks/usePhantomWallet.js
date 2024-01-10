import { Context } from "../contexts/PhantomProvider";
import { useContext } from "react";

const usePhantomWallet = () => {
  const { provider, connected, connect, disconnect, account } =
    useContext(Context);
  return { provider, connected, connect, disconnect, account };
};

export default usePhantomWallet;
