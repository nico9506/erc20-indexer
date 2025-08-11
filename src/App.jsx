import { useState } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import TokenDisplay from "./components/TokenDisplay";
import NFTDisplay from "./components/NFTDisplay";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);

  const [results, setResults] = useState({});
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  const [resultsNFT, setResultsNFT] = useState({});
  const [hasQueriedNFT, setHasQueriedNFT] = useState(false);
  const [tokenDataObjectsNFT, setTokenDataObjectsNFT] = useState([]);

  async function getTokenBalance() {
    const config = {
      apiKey: ALCHEMY_API_KEY,
      // network: Network.ETH_SEPOLIA,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    // Balance workflow
    const balanceWei = await alchemy.core.getBalance(userAddress);
    const balanceETH = Utils.formatEther(balanceWei);
    const ethUsdtPrice = await alchemy.prices.getTokenPriceBySymbol(["ETH"]);
    setUserBalance(balanceETH);
    setUsdtBalance(balanceETH * Number(ethUsdtPrice.data[0].prices[0].value));

    // Token workflow
    const data = await alchemy.core.getTokenBalances(userAddress);
    setResults(data);

    const tokenDataPromises = data.tokenBalances.map((t) =>
      alchemy.core.getTokenMetadata(t.contractAddress),
    );
    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);

    // NFT workflow
    const dataNFT = await alchemy.nft.getNftsForOwner(userAddress);
    setResultsNFT(dataNFT);

    const nftDataPromises = dataNFT.ownedNfts.map((n) =>
      alchemy.nft.getNftMetadata(n.contract.address, n.tokenId),
    );
    setTokenDataObjectsNFT(await Promise.all(nftDataPromises));
    setHasQueriedNFT(true);
  }

  const bgColor = "gray.900";
  const cardBg = "gray.700";

  return (
    <Box minW="100vw" minH="100vh" bg={bgColor} py={10}>
      <Center>
        <VStack spacing={6} textAlign="center" maxW="800px" px={4}>
          <Heading color="blue.500" fontSize={["2xl", "3xl", "4xl"]}>
            Ethereum Asset Viewer
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Enter an Ethereum address to view all ERC-20 token balances and
            NFTs.
          </Text>

          <Box bg={cardBg} p={6} rounded="xl" shadow="md" w="100%" maxW="600px">
            <VStack spacing={4}>
              <Input
                placeholder="0x... Ethereum address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                color="black"
                bg="white"
                fontSize="md"
                textAlign="center"
                _placeholder={{ color: "gray.400" }}
              />
              <Button
                w="full"
                size="lg"
                backgroundColor="blue.400"
                colorScheme="blue"
                onClick={getTokenBalance}
                isDisabled={!userAddress}
                _hover={{
                  bg: "blue.600", // Darker blue on hover
                  transform: "scale(1.01)", // Slightly grow
                  boxShadow: "lg", // Add a shadow
                }}
              >
                Check Assets
              </Button>
            </VStack>
          </Box>

          {hasQueried && hasQueriedNFT ? (
            <VStack spacing={12} w="100%">
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="teal.300"
                bg="gray.800"
                px={4}
                py={2}
                borderRadius="md"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                User balance:{" "}
                <Box as="span" color="yellow.300">
                  {parseFloat(userBalance).toFixed(4)} ETH
                </Box>{" "}
                (
                <Box as="span" color="green.300">
                  {parseFloat(usdtBalance).toFixed(2)} USDT
                </Box>
                )
              </Text>
              <TokenDisplay
                results={results}
                hasQueried={hasQueried}
                tokenDataObjects={tokenDataObjects}
              />
              <NFTDisplay
                results={resultsNFT}
                hasQueried={hasQueriedNFT}
                tokenDataObjects={tokenDataObjectsNFT}
              />
            </VStack>
          ) : (
            <Text color="gray.400" mt={8}>
              Please enter an address and click "Check Assets" to begin.
            </Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
}

export default App;
