import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
const Context = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  //   const wallets = useMemo(
  //     () => [
  //       new PhantomWalletAdapter(),
  //       new SolflareWalletAdapter(),
  //       new LedgerWalletAdapter(),
  //       new WalletConnectWalletAdapter(),
  //       new SolletWalletAdapter(),
  //       new TorusWalletAdapter(),
  //       new MathWalletAdapter(),
  //       new BackpackWalletAdapter(),
  //       new BraveWalletAdapter(),
  //       new GlowWalletAdapter(),
  //       new ExodusWalletAdapter(),
  //       new SlopeWalletAdapter()
  //     ],
  //     []
  //   );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
export default Context;
