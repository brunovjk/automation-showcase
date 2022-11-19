import React, { useContext } from "react";
import { ContractContext } from "./context/ContractContext";

import { Grid } from "@mui/material";
import { ConnectButton, ShowCollection } from "./components";
import { MintingModal } from "./components";

function App() {
  const { openMintModal, setOpenMintModal } = useContext(ContractContext);
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh" }}
      spacing={5}
    >
      <Grid item>
        <ConnectButton />
      </Grid>

      <Grid item>
        <ShowCollection />
      </Grid>
      <MintingModal
        openMintModal={openMintModal}
        setOpenMintModal={setOpenMintModal}
      />
    </Grid>
  );
}

export default App;
