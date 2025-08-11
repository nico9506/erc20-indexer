import { Box, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";

function NFTDisplay({ results, hasQueried }) {
  const ipfsToHttp = (url) => {
    if (!url) return null;
    if (url.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${url.split("ipfs://")[1]}`;
    }
    return url;
  };

  return (
    <Box
      w="100vw"
      maxW="1200px"
      boxShadow="md"
      mb="4"
      mt="16"
      backgroundColor="black"
    >
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading my={10}>NFTs Owned</Heading>

        {hasQueried && results?.ownedNfts?.length > 0 ? (
          <SimpleGrid
            w="95%"
            columns={[1, 2, 3, 4]}
            spacing={8}
            padding={4}
            pb={12}
            gap={8}
          >
            {results.ownedNfts.map((nft) => {
              const name =
                nft.name ||
                nft.title ||
                nft.contract.name ||
                nft.metadata?.name ||
                nft.rawMetadata?.name ||
                "No Name";

              const symbol = nft.symbol || nft.contract.symbol || "No symbol";
              const nftId = nft.tokenId || "No ID";
              const nftType =
                nft.tokenType || nft.contract.tokenType || "Unknown type";

              const imageUrl =
                nft.contract.openSeaMetadata.imageUrl ||
                nft.image ||
                nft.collection.bannerImageUrl ||
                ipfsToHttp(nft.rawMetadata?.image) ||
                ipfsToHttp(nft.metadata?.image) ||
                "https://via.placeholder.com/200?text=No+Image";

              return (
                <Flex
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  flexDir="column"
                  color="gray.950"
                  bg="deepskyblue"
                  borderRadius="xl"
                  p={4}
                  boxShadow="md"
                >
                  <Box
                    fontWeight="bold"
                    mb={2}
                    p={2}
                    borderRadius="md"
                    w="100%"
                  >
                    <Text
                      isTruncated
                      maxW="100%"
                      fontSize="lg"
                      title={name} // shows full value on hover
                    >
                      {name || "No Name"}
                    </Text>
                    <Text
                      isTruncated
                      maxW="100%"
                      color="gray.700"
                      fontSize="sm"
                      title={symbol}
                    >
                      {symbol || "No Symbol"}
                    </Text>
                    <Text
                      isTruncated
                      maxW="100%"
                      fontSize="sm"
                      color="gray.700"
                      title={nftId}
                    >
                      ID: {nftId || "N/A"}
                    </Text>
                    <Text
                      isTruncated
                      maxW="100%"
                      fontSize="sm"
                      color="gray.700"
                      title={nftType}
                    >
                      {nftType || "Unknown"}
                    </Text>
                  </Box>

                  <Image
                    src={imageUrl}
                    alt={name + " logo"}
                    borderRadius="md"
                    objectFit="cover"
                    maxH="200px"
                  />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : hasQueried ? (
          <Text>No NFTs found for this address.</Text>
        ) : (
          <Text>Please make a query! This may take a few seconds...</Text>
        )}
      </Flex>
    </Box>
  );
}

export default NFTDisplay;
