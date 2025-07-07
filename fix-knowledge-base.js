/**
 * Script to debug the knowledge base loading
 */
const CivilDefenseChatbot = require('./chatbot');
const fs = require('fs');
const path = require('path');

// Create chatbot instance
console.log('Creating chatbot instance...');
const chatbot = new CivilDefenseChatbot();
console.log('Chatbot created.');

// Direct check of knowledge base
const knowledgeBasePath = path.join(__dirname, 'data', 'knowledge_base.json');
console.log(`Loading knowledge base from: ${knowledgeBasePath}`);
const knowledgeBaseData = fs.readFileSync(knowledgeBasePath, 'utf8');
const knowledgeBaseJson = JSON.parse(knowledgeBaseData);

// Check the structure of both knowledge bases
console.log('\n=== Knowledge Base Structure ===');
console.log('Direct loaded KB structure:');
Object.keys(knowledgeBaseJson).forEach(key => {
    console.log(`- ${key}: ${Array.isArray(knowledgeBaseJson[key]) ? 'Array' : typeof knowledgeBaseJson[key]}`);
    if (Array.isArray(knowledgeBaseJson[key])) {
        console.log(`  Length: ${knowledgeBaseJson[key].length}`);
    }
});

console.log('\nChatbot KB structure:');
Object.keys(chatbot.knowledgeBase).forEach(key => {
    console.log(`- ${key}: ${Array.isArray(chatbot.knowledgeBase[key]) ? 'Array' : typeof chatbot.knowledgeBase[key]}`);
    if (Array.isArray(chatbot.knowledgeBase[key])) {
        console.log(`  Length: ${chatbot.knowledgeBase[key].length}`);
    }
});

// Check if المجموعة الثانية exists and has services
console.log('\n=== Bakery Service Check ===');
const groupName = 'المجموعة الثانية';
const serviceIndex = 7;

console.log(`Direct KB - Group exists: ${!!knowledgeBaseJson[groupName]}`);
if (knowledgeBaseJson[groupName]) {
    console.log(`Direct KB - Group has ${knowledgeBaseJson[groupName].length} services`);
    console.log(`Direct KB - Service at index ${serviceIndex - 1} exists: ${!!knowledgeBaseJson[groupName][serviceIndex - 1]}`);
    if (knowledgeBaseJson[groupName][serviceIndex - 1]) {
        console.log(`Direct KB - Service name: ${knowledgeBaseJson[groupName][serviceIndex - 1]['اسم الخدمة']}`);
    }
}

console.log(`\nChatbot KB - Group exists: ${!!chatbot.knowledgeBase[groupName]}`);
if (chatbot.knowledgeBase[groupName]) {
    console.log(`Chatbot KB - Group has ${chatbot.knowledgeBase[groupName].length} services`);
    console.log(`Chatbot KB - Service at index ${serviceIndex - 1} exists: ${!!chatbot.knowledgeBase[groupName][serviceIndex - 1]}`);
    if (chatbot.knowledgeBase[groupName][serviceIndex - 1]) {
        console.log(`Chatbot KB - Service name: ${chatbot.knowledgeBase[groupName][serviceIndex - 1]['اسم الخدمة']}`);
    }
}

// Test findBestService with bakery query
console.log('\n=== Test findBestService ===');
const query = "اريد ترخيص مخبز شعبي";
console.log(`Testing query: "${query}"`);
const bestService = chatbot.findBestService(query);
console.log('Best service result:', bestService);

// Test direct service ID lookup
console.log('\n=== Test Direct Service Access ===');
const directServiceId = 'المجموعة الثانية_7';
console.log(`Testing direct service ID: ${directServiceId}`);
const [group, idx] = directServiceId.split('_');
console.log(`Group: ${group}, Index: ${idx}`);

if (chatbot.knowledgeBase[group]) {
    console.log(`Group exists in chatbot KB`);
    if (chatbot.knowledgeBase[group][parseInt(idx) - 1]) {
        console.log(`Service exists at index ${parseInt(idx) - 1}`);
        console.log('Service data:', chatbot.knowledgeBase[group][parseInt(idx) - 1]);
    } else {
        console.log(`Service does NOT exist at index ${parseInt(idx) - 1}`);
        console.log(`Group length: ${chatbot.knowledgeBase[group].length}`);
    }
} else {
    console.log(`Group does NOT exist in chatbot KB`);
    console.log('Available groups:', Object.keys(chatbot.knowledgeBase));
} 