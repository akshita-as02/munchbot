// server/debug-server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for all origins during debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Debug server is working!',
    env: {
      geminiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
      adminKey: process.env.ADMIN_API_KEY ? 'configured' : 'missing',
      mongodb: process.env.MONGODB_URI ? 'configured' : 'missing'
    }
  });
});

// Simplified chat endpoint
app.post('/api/chat', (req, res) => {
  try {
    console.log('Received message:', req.body);
    
    // Just return a static response for testing
    res.json({
      response: "This is a test response from the debug server. Your frontend is successfully connecting to the backend!",
      sources: ['debug']
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'An error occurred',
      message: error.message,
      stack: error.stack
    });
  }
});

// Start server
const PORT = 5001; // Use a different port to avoid conflict
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
  console.log(`Test your connection at: http://localhost:${PORT}/api/test`);
});