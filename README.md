# Personal Portfolio Chatbot

An AI-powered chatbot for my portfolio website that answers questions about my background, skills, and projects.

## Features

- MongoDB for storing personal data
- Google Gemini API for natural language understanding
- React frontend with Chakra UI
- Express.js backend

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     GEMINI_API_KEY=your-gemini-api-key
     ADMIN_API_KEY=your-admin-key
     MONGODB_URI=your-mongodb-connection-string
     ```

4. Initialize the knowledge base:
   ```
   cd server
   node init-db.js
   ```

5. Start the application:
   ```
   # Start the backend
   cd server
   npm run dev
   
   # Start the frontend (in a new terminal)
   cd client
   npm run dev
   ```

## Project Structure

- `/client`: React frontend
- `/server`: Express backend
- `/server/models`: MongoDB schemas

## License

MIT
