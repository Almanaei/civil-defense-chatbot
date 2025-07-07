/**
 * Command-line tool to test the intent system with direct input
 * Usage: node cli-test.js "اريد ترخيص مخبز شعبي"
 */

const intentSystem = require('./intents');
const fs = require('fs');
const path = require('path');

// Get query from command line arguments
const query = process.argv[2] || 'اريد ترخيص مخبز شعبي';

console.log(`Testing query: "${query}"`);
console.log('-'.repeat(50));

// Unicode character code point info
console.log('Character codes:');
for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const code = char.charCodeAt(0);
    console.log(`${i}: '${char}' - ${code} - 0x${code.toString(16)}`);
}

// Arabic text detection
console.log('-'.repeat(50));
console.log('Arabic text detection:');
const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
console.log(`Has Arabic characters: ${arabicPattern.test(query)}`);

// Extract keywords
console.log('-'.repeat(50));
console.log('Keyword extraction:');
const keywords = query.replace(/[^\w\s\u0600-\u06FF]/g, ' ')
                 .split(/\s+/)
                 .filter(word => word.length > 2);
console.log(`Extracted ${keywords.length} keywords: ${keywords.join(', ')}`);

// Get intent categories for each keyword
console.log('-'.repeat(50));
console.log('Intent categories:');
keywords.forEach(keyword => {
    const category = intentSystem.getIntentCategoryForKeyword(keyword);
    console.log(`- "${keyword}": ${category ? JSON.stringify(category) : 'No category found'}`);
});

// Try direct service matching
console.log('-'.repeat(50));
console.log('Service matching:');
const serviceId = intentSystem.getServiceIdByKeywords(keywords);
console.log(`Direct service match: ${serviceId || 'None'}`);

// Load the knowledge base
const knowledgeBasePath = path.join(__dirname, 'data', 'knowledge_base.json');
try {
    const knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf8'));
    
    if (serviceId) {
        // Check if this maps to a real service
        const [groupName, serviceIndex] = serviceId.split('_');
        if (knowledgeBase[groupName] && knowledgeBase[groupName][parseInt(serviceIndex) - 1]) {
            const service = knowledgeBase[groupName][parseInt(serviceIndex) - 1];
            console.log(`Found matching service: "${service['اسم الخدمة']}"`);
            console.log(`Service details: ${JSON.stringify(service, null, 2)}`);
        } else {
            console.log(`WARNING: Service ID doesn't match any actual service in knowledge base!`);
        }
    }
} catch (error) {
    console.error('Error loading knowledge base:', error);
}

// Test entity extraction
console.log('-'.repeat(50));
console.log('Named entity extraction:');
const entities = intentSystem.extractEntities(query);
console.log(JSON.stringify(entities, null, 2));

// Test complex pattern matching
console.log('-'.repeat(50));
console.log('Complex pattern matching:');
const complexMatch = intentSystem.matchComplexPattern(query);
console.log(complexMatch ? JSON.stringify(complexMatch, null, 2) : 'No pattern match');

// Show enhanced service keywords that would be a good match
console.log('-'.repeat(50));
console.log('Suggested keyword matches:');
let foundMatches = false;

// Scan all service intent examples for partial matches
Object.entries(intentSystem.serviceIntentExamples).forEach(([key, service]) => {
    const matchingKeywords = keywords.filter(kw => 
        service.keywords.some(sk => sk.includes(kw) || kw.includes(sk))
    );
    
    if (matchingKeywords.length > 0) {
        foundMatches = true;
        console.log(`- ${key} (${service.service_id}): ${matchingKeywords.join(', ')}`);
        console.log(`  Relevant service keywords: ${service.keywords.join(', ')}`);
    }
});

if (!foundMatches) {
    console.log('No partial keyword matches found');
} 