// server/models/vectorModel.js - MongoDB schema for embeddings
const mongoose = require('mongoose');

const vectorSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  }
});

// Create index for vector search if using MongoDB Atlas
// Note: This will only work if MongoDB Atlas Vector Search is set up
// If you're using a different MongoDB provider, you may need to modify this
try {
  // Don't use await here as it's not inside an async function
  vectorSchema.index(
    { embedding: "vector", section: 1 }, 
    { 
      name: "vector_index",
      vectorOptions: { dimensions: 1536, similarity: "cosine" }
    }
  );
} catch (error) {
  console.log('Vector search not available, skipping index creation');
}

module.exports = mongoose.model('Vector', vectorSchema);