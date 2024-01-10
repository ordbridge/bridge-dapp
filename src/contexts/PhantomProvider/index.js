import { createContext, useCallback, useEffect, useState } from "react";

export const Context = createContext({});

function PhantomProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
      });

      provider.on("disconnect", () => {
        setConnected(false);
        setAccount(null);
      });

      provider.on("accountChanged", (publicKey) => {
        if (publicKey) {
          // Set new public key and continue as usual
          setAccount(publicKey.toBase58());
        } else {
          provider.connect().catch((error) => {
            console.log(error);
          });
        }
      });

      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

  const handleConnect = useCallback(async () => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        setProvider(provider);

        const resp = await provider.connect();

        setAccount(resp.publicKey.toString());
      }
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    if (provider) {
      provider.disconnect();
    }
  }, [provider]);

  return (
    <Context.Provider
      value={{
        provider,
        connected,
        connect: handleConnect,
        disconnect: handleDisconnect,
        account,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default PhantomProvider;
