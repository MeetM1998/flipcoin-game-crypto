import React, { useEffect, useState } from "react";
import { Box, Center, Heading } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import CoinFlip from "../components/CoinFlip";

const Home = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Center height="100vh" bg="gray.100">
      <Box
        p={6}
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        width="full"
        maxWidth="500px"
      >
        <Heading mb={6} textAlign="center">
          Solana Coinflip Game
        </Heading>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WalletMultiButton mb={6} />
        </div>
        <CoinFlip />
      </Box>
    </Center>
  );
};

export default Home;
