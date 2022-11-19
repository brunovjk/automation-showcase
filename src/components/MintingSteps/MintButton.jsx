import React, { useContext } from "react";
import { Stack, Link, Button, Typography } from "@mui/material";
import { ethers } from "ethers";

import { ContractContext } from "../../context/ContractContext";

export default function MintButton() {
  const { createNFT, gasToMint, priceToMint } = useContext(ContractContext);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h6">Mint your Token</Typography>
      <Typography variant="body2" textAlign="center">
        Mint price: {priceToMint}
        <br />
        Min gas used: {ethers.utils.formatUnits(gasToMint, 9)}
      </Typography>
      <Link
        href={`https://mumbaifaucet.com/`}
        underline="none"
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Typography variant="body1">Please grab some Faucet</Typography>
      </Link>

      <Button onClick={createNFT}>_mint</Button>
    </Stack>
  );
}
