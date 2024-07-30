import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export const ConnectWallet = () => {
  const { connected } = useWallet();
  return (
    <>
      <div style={{ position: "fixed", right: 10, top: 10 }}>
        {!connected && <WalletMultiButton />}
        {connected && <WalletDisconnectButton />}
      </div>
    </>
  );
};
