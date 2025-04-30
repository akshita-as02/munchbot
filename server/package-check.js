// server/package-check.js
const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('======= PACKAGE INFO =======');
console.log('All dependencies:');
console.log(packageJson.dependencies);

console.log('\nChecking for Gemini-related packages:');
if (packageJson.dependencies['@google/generative-ai']) {
    console.log('- @google/generative-ai is installed:', packageJson.dependencies['@google/generative-ai']);
} else {
    console.log('- @google/generative-ai is NOT installed');
}

if (packageJson.dependencies['@google/genai']) {
    console.log('- @google/genai is installed:', packageJson.dependencies['@google/genai']);
} else {
    console.log('- @google/genai is NOT installed');
}

console.log('\nFor the server to work correctly, you need @google/generative-ai package');
console.log('==============================');

// Try to require each package to see if it's actually accessible
console.log('\nTesting package access:');
try {
    const generativeAi = require('@google/generative-ai');
    console.log('- @google/generative-ai can be accessed', generativeAi ? 'successfully' : 'but returns undefined');
} catch (error) {
    console.log('- Error accessing @google/generative-ai:', error.message);
}

try {
    const genai = require('@google/genai');
    console.log('- @google/genai can be accessed', genai ? 'successfully' : 'but returns undefined');
} catch (error) {
    console.log('- Error accessing @google/genai:', error.message);
}