const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  date: String,
  gpa: String,
  courses: [String]
});

const experienceSchema = new mongoose.Schema({
  company: String,
  location: String,
  position: String,
  duration: String,
  achievements: [String]
});

const projectSchema = new mongoose.Schema({
  name: String,
  technologies: String,
  duration: String,
  description: String
});

const skillsSchema = new mongoose.Schema({
  programming: [String],
  frameworks: [String],
  apis: [String],
  database: [String],
  tools: [String],
  expertise: [String]
});

const aboutSchema = new mongoose.Schema({
  interests: [String],
  activities: [String],
  personalInfo: String
});

const knowledgeSchema = new mongoose.Schema({
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: skillsSchema,
  about: aboutSchema
});

module.exports = mongoose.model('Knowledge', knowledgeSchema);