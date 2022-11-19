import React, { useContext } from "react";
import { ContractContext } from "../context/ContractContext";

import { Stack, Link, Button } from "@mui/material";
export function ConnectButton() {
  const { currentAccount, chainId, connectWallet, setOpenMintModal } =
    useContext(ContractContext);
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Link href="https://blog.polysynth.com/how-to-connect-polygon-testnet-to-metamask-wallet-472bca410d64">
        How add Mumbai
      </Link>
      <Button
        variant="contained"
        onClick={
          currentAccount && chainId === 80001
            ? () => {
                setOpenMintModal(true);
              }
            : () => {
                connectWallet();
              }
        }
      >
        {currentAccount
          ? chainId === 80001
            ? "Mint Token"
            : "Connect to Mumbai"
          : "Connect wallet"}
      </Button>
      <Link href="https://blog.polysynth.com/how-to-connect-polygon-testnet-to-metamask-wallet-472bca410d64">
        Mumbai faucet
      </Link>
    </Stack>
  );
}
