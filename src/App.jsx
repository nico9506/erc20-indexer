import { useState } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import TokenDisplay from "./components/TokenDisplay";
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState({});
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  async function getTokenBalance() {
    const config = {
      apiKey: ALCHEMY_API_KEY,
      network: Network.ETH_SEPOLIA,
      // network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress,
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
  }

  return (
    <>
      <Box w="100vw">
        <Center>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Heading mb={0} fontSize={36}>
              ERC-20 Token Indexer
            </Heading>
            <Text>
              Plug in an address and this website will return all of its ERC-20
              token balances!
            </Text>
          </Flex>
        </Center>
        <Flex
          w="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent={"center"}
        >
          <Heading mt={42}>
            Get all the ERC-20 token balances of this address:
          </Heading>
          <Input
            onChange={(e) => setUserAddress(e.target.value)}
            color="black"
            w="600px"
            textAlign="center"
            p={4}
            bgColor="white"
            fontSize={24}
          />
          <Button
            fontSize={20}
            onClick={async () => await getTokenBalance()}
            mt={36}
            bgColor="blue"
          >
            Check ERC-20 Token Balances
          </Button>

          {hasQueried ? (
            <TokenDisplay
              results={results}
              hasQueried={hasQueried}
              tokenDataObjects={tokenDataObjects}
            ></TokenDisplay>
          ) : (
            "Please make a query! This may take a few seconds..."
          )}
        </Flex>
      </Box>
    </>
  );
}

export default App;
