// server/index.js - Updated for @google/generative-ai package
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:5173', 'https://munchbot.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Initialize the Gemini API client with the @google/generative-ai package
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const Knowledge = require('./models/knowledgeModel');
const Vector = require('./models/vectorModel');

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    console.log('Received message:', message);
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Try to find relevant information using MongoDB
    try {
      const knowledgeDoc = await Knowledge.findOne({});
      
      if (!knowledgeDoc) {
        return res.status(500).json({ 
          error: 'Knowledge base not initialized. Please run the initialization endpoint first.' 
        });
      }
      
      // Create a simple context from the knowledge base
      const contextText = `
        About: ${knowledgeDoc.about.personalInfo}
        
        Education:
        - ${knowledgeDoc.education[0].school}, ${knowledgeDoc.education[0].degree} (${knowledgeDoc.education[0].date})
        - ${knowledgeDoc.education[1].school}, ${knowledgeDoc.education[1].degree} (${knowledgeDoc.education[1].date})
        
        Experience:
        - ${knowledgeDoc.experience[0].company}, ${knowledgeDoc.experience[0].position} (${knowledgeDoc.experience[0].duration})
        - ${knowledgeDoc.experience[1].company}, ${knowledgeDoc.experience[1].position} (${knowledgeDoc.experience[1].duration})
        
        Projects:
        - ${knowledgeDoc.projects[0].name}: ${knowledgeDoc.projects[0].description}
        - ${knowledgeDoc.projects[1].name}: ${knowledgeDoc.projects[1].description}
        - ${knowledgeDoc.projects[2].name}: ${knowledgeDoc.projects[2].description}
        
        Skills:
        - Programming: ${knowledgeDoc.skills.programming.join(', ')}
        - Frameworks: ${knowledgeDoc.skills.frameworks.join(', ')}
        - APIs: ${knowledgeDoc.skills.apis.join(', ')}
        - Database: ${knowledgeDoc.skills.database.join(', ')}
      `;
      
      console.log('Getting Gemini model...');
      
      // Get a Gemini model with the correct method
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      console.log('Model obtained, generating content...');
      
      // Generate content using the correct method
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are Akshita's personal chatbot assistant. Answer this question using only the context provided.\n\nContext: ${contextText}\n\nQuestion: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        }
      });
      
      console.log('Content generated successfully');
      
      // Return the response with the correct method
      res.json({ 
        response: result.response.text(),
        sources: ['about', 'education', 'experience', 'projects', 'skills']
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({ error: 'Error retrieving data from database', details: dbError.message });
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'An error occurred processing your message', details: error.message });
  }
});

// Database health check endpoint
app.get('/api/db-health', async (req, res) => {
  try {
    // Attempt to run a simple query
    const result = await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'connected',
      dbName: mongoose.connection.db.databaseName,
      ping: result.ok === 1 ? 'successful' : 'failed'
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'disconnected',
      error: error.message
    });
  }
});

// Initialize knowledge base
app.post('/api/chat/init', async (req, res) => {
  try {
    // Check for API key in request
    const { apiKey } = req.body;
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
    
    console.log('Initializing knowledge base...');
    
    // Clear existing knowledge
    await Knowledge.deleteMany({});
    await Vector.deleteMany({});
    
    // Insert your resume data
    const resumeData = {
      education: [
        {
          school: "Northeastern University, Boston, MA",
          degree: "Master of Science in Computer Science",
          date: "Expected: May 2026",
          gpa: "3.83/4",
          courses: ["Programming Design Paradigm", "Algorithms", "Web Development", "HCI"]
        },
        {
          school: "SRM Institute of Science and Technology, Kattankulathur, India",
          degree: "Bachelor of Technology in Computer Science and Engineering with Distinction",
          date: "Sept 2020 - June 2024",
          gpa: "9.63/10",
          courses: ["Operating Systems", "DBMS", "Artificial Intelligence", "Algorithms", "Advanced Calculus"]
        }
      ],
      experience: [
        {
          company: "Dell Technologies",
          location: "Bengaluru, India",
          position: "Software Testing Intern – Drives and Networking Engineering",
          duration: "Aug 2023 - Aug 2024",
          achievements: [
            "Validated drive firmware across multiple Dell platforms using iDRAC and Qtest",
            "Automated testcases using Python, Pytest, Redfish API, Django, and Selenium",
            "Developed an Automation Test Suite for BIOS functionalities",
            "Enhanced storage testing by integrating SAS, SATA, NVMe technologies"
          ]
        },
        {
          company: "Bharat Heavy Electricals Limited",
          location: "Haridwar, India",
          position: "Vocational Trainee - Computer Centre",
          duration: "June 2023 - July 2023",
          achievements: [
            "Implemented Facial Expression Recognition project",
            "Attended seminars on Computer Networks in Large Scale Enterprises"
          ]
        }
      ],
      projects: [
        {
          name: "Markova - AI Assistant for Branding",
          technologies: "MERN, OpenAI, Gemini",
          duration: "Jan 2025 - Present",
          description: "AI branding automation tool with Next.js 14, TypeScript, MongoDB, integrating OpenAI & Gemini APIs for logo, tagline, and content generation."
        },
        {
          name: "NU Marketplace",
          technologies: "MongoDB, NodeJS, ExpressJS, ReactJS",
          duration: "Sept 2024 - Dec 2024",
          description: "Built marketplace using Next.js 14, TypeScript, MongoDB, with Clerk authentication and Stripe APIs."
        },
        {
          name: "Imogen - Image Editor",
          technologies: "Java, Swing",
          duration: "Sept 2024 - Nov 2024",
          description: "Java Image Editor with color correction, compression, histogram creation, achieving 98% color accuracy."
        }
      ],
      skills: {
        programming: ["Python", "Shell Script", "C", "C++", "Java", "HTML", "CSS", "JavaScript"],
        frameworks: ["MERN Stack", "Bootstrap", "Tailwind CSS", "ThreeJS", "NextJS", "Django", "Selenium"],
        apis: ["OpenAI API", "Google Gemini API", "Stripe API", "MongoDB Atlas API", "Redfish API"],
        database: ["SQL", "SQLite", "GraphQL", "MongoDB"],
        tools: ["Figma", "Adobe Illustrator", "Adobe XD", "Adobe Photoshop", "Canva", "AutoCAD", "Blender"],
        expertise: ["Software Testing", "Full-Stack Development", "Python Automation", "UI/UX", "Human-centered Design"]
      },
      about: {
        interests: ["AI and Machine Learning", "Web Development", "UI/UX Design", "Blockchain Technology"],
        activities: [
          "Head of Editorial, SRMKZILLA (2021-2023)",
          "Co-founder & Editorial Head, Blockchain Club (2023)",
          "Content Writer, Packman Bespoke Gifting (2021)"
        ],
        personalInfo: "I'm a Computer Science graduate student at Northeastern University with a passion for creating meaningful applications that solve real problems. I enjoy combining technical skills with design thinking."
      }
    };
    
    // Save to MongoDB
    const knowledge = new Knowledge(resumeData);
    await knowledge.save();
    console.log('Knowledge base saved successfully');
    
    res.json({ success: true, message: 'Knowledge base initialized successfully' });
    
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
    res.status(500).json({ error: 'An error occurred initializing the knowledge base', details: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
    adminKey: process.env.ADMIN_API_KEY ? 'configured' : 'missing',
    dbUri: process.env.MONGODB_URI ? 'configured' : 'missing'
  });
});

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/dist'));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
//   });
// }

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
