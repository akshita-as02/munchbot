import {
    Box,
    Text,
    Flex,
    Avatar,
    Badge,
    useColorModeValue,
    Spinner
  } from '@chakra-ui/react';
  import { motion } from 'framer-motion';
  
  const MotionBox = motion(Box);
  
  const ChatMessage = ({ message }) => {
    const { role, content, isLoading, sources } = message;
    const isUser = role === 'user';
    
    const userBg = useColorModeValue('purple.500', 'purple.400');
    const botBg = useColorModeValue('gray.100', 'gray.700');
    const userColor = 'white';
    const botColor = useColorModeValue('gray.800', 'white');
  
    return (
      <Flex justify={isUser ? 'flex-end' : 'flex-start'} mb={2}>
        {!isUser && (
          <Avatar
            size="sm"
            name="Akshita Bot"
            src="/avatar.png"
            mr={2}
          />
        )}
        
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          maxW="80%"
          bg={isUser ? userBg : botBg}
          color={isUser ? userColor : botColor}
          p={3}
          borderRadius="lg"
          boxShadow="sm"
          borderTopLeftRadius={!isUser ? '0' : undefined}
          borderTopRightRadius={isUser ? '0' : undefined}
        >
          {isLoading ? (
            <Flex align="center">
              <Spinner size="sm" mr={2} color={botColor} />
              <Text>{content}</Text>
            </Flex>
          ) : (
            <>
              <Text>{content}</Text>
              
              {sources && sources.length > 0 && (
                <Flex mt={2} wrap="wrap" gap={1}>
                  {sources.map((source, index) => (
                    <Badge 
                      key={index} 
                      colorScheme="gray" 
                      fontSize="xs"
                    >
                      {source}
                    </Badge>
                  ))}
                </Flex>
              )}
            </>
          )}
        </MotionBox>
        
        {isUser && (
          <Avatar
            size="sm"
            name="User"
            ml={2}
            bg="purple.500"
            color="white"
          />
        )}
      </Flex>
    );
  };
  
  export default ChatMessage;