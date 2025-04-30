// server/init-db.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function initializeKnowledgeBase() {
  try {
    console.log('Initializing knowledge base...');
    
    const response = await axios.post('http://localhost:5000/api/chat/init', {
      apiKey: process.env.ADMIN_API_KEY
    });
    
    console.log('Response:', response.data);
    console.log('Knowledge base initialized successfully!');
  } catch (error) {
    console.error('Error initializing knowledge base:', error.response?.data || error.message);
  }
}

// Run the initialization
initializeKnowledgeBase();