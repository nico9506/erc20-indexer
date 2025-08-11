import { Utils } from "alchemy-sdk";
import { Box, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";

function TokenDisplay({ results, hasQueried, tokenDataObjects }) {
  return (
    <Box w="100vw">
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading my={10}>ERC-20 Token Balances</Heading>

        {hasQueried && results?.tokenBalances?.length > 0 ? (
          <SimpleGrid w="90vw" columns={[1, 2, 3, 4]} spacing={8} mt={8}>
            {results.tokenBalances.map((token, i) => {
              const meta = tokenDataObjects?.[i];

              return (
                <Flex
                  key={token.contractAddress}
                  flexDir="column"
                  color="white"
                  bg="blue.500"
                  borderRadius="xl"
                  p={4}
                  boxShadow="md"
                >
                  <Box fontWeight="bold" mb={2}>
                    Symbol: {meta?.symbol || "N/A"}
                  </Box>
                  <Box mb={2}>
                    Balance:{" "}
                    {meta
                      ? Utils.formatUnits(token.tokenBalance, meta.decimals)
                      : "Loading..."}
                  </Box>
                  {meta?.logo && (
                    <Image
                      src={meta.logo}
                      alt={`${meta.symbol} logo`}
                      boxSize="40px"
                      objectFit="contain"
                    />
                  )}
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : hasQueried ? (
          <Text>No tokens found for this address.</Text>
        ) : (
          <Text>Please make a query! This may take a few seconds...</Text>
        )}
      </Flex>
    </Box>
  );
}

export default TokenDisplay;
