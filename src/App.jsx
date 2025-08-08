import { Button, HStack } from "@chakra-ui/react";
import "./App.css";
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

function App() {
  return (
    <>
      <HStack>
        <Button>Hello world</Button>
        <Button>Test</Button>
      </HStack>
    </>
  );
}

export default App;
