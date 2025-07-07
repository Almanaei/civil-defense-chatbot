/**
 * Command-line tool to directly test the chatbot
 * Usage: node cli-chat-test.js "اريد ترخيص مخبز شعبي"
 */

const CivilDefenseChatbot = require('./chatbot');

// Create chatbot instance
console.log('Initializing chatbot...');
const chatbot = new CivilDefenseChatbot();

// Get query from command line arguments
const query = process.argv[2] || 'اريد ترخيص مخبز شعبي';

console.log('-'.repeat(50));
console.log(`Testing query: "${query}"`);
console.log('-'.repeat(50));

// Detect language
const language = chatbot.detectLanguage(query);
console.log(`Detected language: ${language}`);

// Extract keywords
const keywords = chatbot.extractKeywordsFromText(query);
console.log(`Extracted keywords: ${keywords.join(', ')}`);

// Process the message
console.log('-'.repeat(50));
console.log('Processing message with chatbot:');
const result = chatbot.processMessage(query, 'test-cli-session');

// Display the result
console.log('-'.repeat(50));
console.log('Chatbot response:');
console.log(`Success: ${result.success}`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Service ID: ${result.serviceId || 'None'}`);
console.log(`Language: ${result.language}`);
console.log('-'.repeat(50));
console.log('Response:');
console.log(result.response); 