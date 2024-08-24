import React, { useState, useEffect } from 'react';
import { Button, Box, Text, VStack, useToast } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const CoinFlip = () => {
  const { publicKey, sendTransaction, connected, disconnect } = useWallet();
  const [result, setResult] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const flipCoin = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to play.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const balance = await connection.getBalance(publicKey);
    if (balance < 1) {
      toast({
        title: "Insufficient Funds",
        description: "You need more SOL to play.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const side = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: keypair.generate().publicKey,
        lamports: 1, 
      })
    );

    try {
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      setResult(`You got ${side}!`);
      toast({
        title: "Success!",
        description: `You got ${side}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setResult('Transaction failed!');
      toast({
        title: "Transaction Failed",
        description: "Something went wrong with the transaction.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <VStack spacing={4} align="center" justify="center" p={4} maxW="container.md">
      {connected ? (
        <Box textAlign="center" maxW="full">
          <Text fontSize="xl" fontWeight="bold" color="teal.500" mb={4} overflowWrap="break-word">
            Wallet Connected: {publicKey.toBase58()}
          </Text>
          <Box display="flex" justifyContent="center" alignItems="center" columnGap="10px" mb={4}>
            <Button 
              colorScheme="teal" 
              onClick={flipCoin} 
              size="md" 
              borderRadius="md"
              boxShadow="md"
              _hover={{ boxShadow: 'lg' }}
            >
              Flip Coin
            </Button>
            <Button 
              colorScheme="red" 
              onClick={() => disconnect()} 
              size="md" 
              borderRadius="md"
              boxShadow="md"
              _hover={{ boxShadow: 'lg' }}
            >
              Disconnect
            </Button>
          </Box>
          {result && <Text fontSize="lg" fontWeight="semibold">{result}</Text>}
        </Box>
      ) : (
        <Box textAlign="center" maxW="full">
          <Text fontSize="xl" color="red.500">Wallet Not Connected</Text>
          <Button 
            colorScheme="teal" 
            size="lg" 
            borderRadius="md"
            boxShadow="md"
            _hover={{ boxShadow: 'lg' }}
            onClick={() => window.location.reload()}
            mt={4}
          >
            Refresh to Connect Wallet
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default CoinFlip;
