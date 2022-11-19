import React, { useContext, useState, useEffect } from "react";
import { ContractContext } from "../context/ContractContext";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Link,
  CardMedia,
  Stack,
  CircularProgress,
} from "@mui/material";
import { shortenAddress } from "../utils/shortenAddress";
import { Buffer } from "buffer";

const CollectionCard = ({ tokenid, addresssender, uri64 }) => {
  const [uri, setUri] = useState({
    name: "Minting",
    description: "Interviewing",
    image: "Paiting",
  });

  useEffect(() => {
    const splitedURI = uri64?.split("data:application/json;base64,")[1];

    if (splitedURI !== undefined) {
      const decodeBase64Uri = JSON.parse(
        Buffer.from(splitedURI, "base64").toString("utf-8")
      );
      setUri(decodeBase64Uri);
    } else {
      setUri({
        name: "Framing",
        description: "Framing your paint",
        image:
          "https://media.istockphoto.com/id/917220700/vector/picture-frame-graphic-black-white-isolated-sketch-set-illustration-vector.jpg?s=612x612&w=0&k=20&c=LQLiD1y6nH_IIuM58L4fAi0G5s6_T3Y2X1Vr9hlolQc=",
      });
    }
  }, [uri64]);

  return (
    <Paper
      variant="outlined"
      sx={{
        width: { xs: "250px", md: "250px" },
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item>
          <Typography color="primary" variant="h6">
            {uri.name}
          </Typography>
        </Grid>
        <Grid item my={2}>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              border: 0,
              cursor: "pointer",
            }}
            src={uri.image}
            alt={uri.image}
          />
        </Grid>
        <Grid item>
          <Link
            href={`https://mumbai.polygonscan.com/address/${addresssender}`}
            underline="none"
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography color="primary" variant="body2">
              Owner: {shortenAddress(addresssender)}
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Paper>
  );
};
export const ShowCollection = () => {
  const { collections } = useContext(ContractContext);
  return (
    <Box>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item>
          {collections.length > 0 ? (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography align="center" variant="h4" color="primary">
                Latest Tokens minted
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                mt={10}
              >
                {collections
                  .slice(0, 12)
                  .reverse()
                  .map((collection, i) => (
                    <CollectionCard key={i} {...collection} />
                  ))}
              </Grid>
            </Stack>
          ) : (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography align="center" variant="h4" color="primary">
                Please wait, loading Latest tokens minted.
              </Typography>
              <CircularProgress />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
