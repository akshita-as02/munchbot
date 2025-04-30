// client/src/components/Chatbot.jsx - Fixed layout version
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  IconButton,
  Heading,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';
import { FiSend, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import ChatMessage from './ChatMessage';
import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! I'm Akshita's personal AI assistant. Feel free to ask me anything about her skills, experience, education, or projects!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending request to /api/chat');
      
      const response = await axios.post('/api/chat', { 
        message: input 
      });
      
      console.log("API Response:", response.data);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.response,
        sources: response.data.sources || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w={{ base: '95%', md: '500px' }}
      h={{ base: 'auto', md: 'auto' }}
      maxH={{ base: '90vh', md: '80vh' }}
      display="flex"
      flexDirection="column"
      bg="white"
      borderRadius="lg"
      boxShadow="xl"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        p={4}
        bg="purple.500"
        color="white"
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={onToggle}
      >
        <HStack spacing={3}>
          <Avatar size="sm" name="Akshita Singh" />
          <Heading size="sm">Akshita's Portfolio Assistant</Heading>
        </HStack>
        <IconButton
          icon={isOpen ? <FiChevronDown /> : <FiChevronUp />}
          variant="ghost"
          color="white"
          _hover={{ bg: 'purple.600' }}
          aria-label="Toggle chat"
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Chat Messages */}
        <Box
          p={4}
          flex="1"
          overflowY="auto"
          borderBottomWidth="1px"
          borderColor="gray.200"
          maxH={{ base: '50vh', md: '60vh' }}
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <ChatMessage
                message={{
                  role: 'assistant',
                  content: 'typing...',
                  isLoading: true,
                }}
              />
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Input Area - Fixed at bottom */}
        <Box p={4} borderTop="1px solid" borderColor="gray.200">
          <form onSubmit={handleSubmit}>
            <Flex>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Akshita's skills, projects, or experience..."
                mr={2}
                disabled={isLoading}
              />
              <Button
                colorScheme="purple"
                type="submit"
                isLoading={isLoading}
                disabled={!input.trim() || isLoading}
              >
                <FiSend />
              </Button>
            </Flex>
          </form>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Chatbot;