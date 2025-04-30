import { Box, VStack } from '@chakra-ui/react'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <Box minH="100vh" bg="gray.50" py={10}>
      <VStack spacing={8}>
        <Chatbot />
      </VStack>
    </Box>
  )
}

export default App