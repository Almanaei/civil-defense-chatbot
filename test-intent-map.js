const intentSystem = require('./intents');
const fs = require('fs');
const path = require('path');

// Load the knowledge base to check structure
const knowledgeBasePath = path.join(__dirname, 'data', 'knowledge_base.json');
const knowledgeBaseData = fs.readFileSync(knowledgeBasePath, 'utf8');
const knowledgeBase = JSON.parse(knowledgeBaseData);

// Test queries for different services
const testQueries = [
    "أريد ترخيص مخبز شعبي",
    "كيف أحصل على ترخيص تركيب أجهزة إنذار",
    "معلومات عن شهادة فحص للمنشآت الكبيرة",
    "أريد تقرير حوادث لمنزلي",
    "كيفية الحصول على ترخيص محطة وقود",
    "كم رسوم إصدار ترخيص محلات الذهب"
];

console.log('===== KNOWLEDGE BASE STRUCTURE =====');
// Display the structure of the knowledge base
if (knowledgeBase) {
    // The KB structure is directly using group names as top-level keys
    const groups = Object.keys(knowledgeBase).filter(key => key.startsWith('المجموعة'));
    console.log(`Knowledge base has ${groups.length} service groups:`);
    groups.forEach(group => {
        const services = knowledgeBase[group];
        console.log(`- ${group}: ${services.length} services`);
        
        // Print first service name as example
        if (services.length > 0) {
            console.log(`  Example: "${services[0]['اسم الخدمة']}"`);
        }
    });
} else {
    console.error('ERROR: Knowledge base structure is not as expected');
    console.log('Knowledge base content:', knowledgeBase);
}

console.log('\n===== INTENT EXAMPLES STRUCTURE =====');
// Check if our intent service IDs match the knowledge base structure
const serviceIntents = Object.values(intentSystem.serviceIntentExamples);
console.log(`Intent system has ${serviceIntents.length} service mappings`);

// Verify service ID format
const serviceIdPattern = /^المجموعة .+_\d+$/;
const validServiceIds = serviceIntents.filter(service => serviceIdPattern.test(service.service_id)).length;
console.log(`- Valid service ID format: ${validServiceIds} out of ${serviceIntents.length}`);

// Check if service IDs map to actual services in the knowledge base
let matchingServices = 0;
if (knowledgeBase) {
    serviceIntents.forEach(serviceIntent => {
        const [groupName, serviceIndex] = serviceIntent.service_id.split('_');
        if (knowledgeBase[groupName] && knowledgeBase[groupName][parseInt(serviceIndex) - 1]) {
            matchingServices++;
        }
    });
    console.log(`- Service IDs matching knowledge base: ${matchingServices} out of ${serviceIntents.length}`);
} else {
    console.log('- Cannot check service ID mapping - knowledge base structure issue');
}

console.log('\n===== TESTING QUERIES =====');
// Test processing queries
testQueries.forEach(query => {
    console.log(`\nTesting query: "${query}"`);
    
    // Extract keywords
    const keywords = query.replace(/[^\w\s\u0600-\u06FF]/g, ' ')
                     .split(/\s+/)
                     .filter(word => word.length > 2);
    console.log(`- Keywords: ${keywords.join(', ')}`);
    
    // Get intent categories for each keyword
    keywords.forEach(keyword => {
        const category = intentSystem.getIntentCategoryForKeyword(keyword);
        if (category) {
            console.log(`- Intent category for "${keyword}": ${JSON.stringify(category)}`);
        }
    });
    
    // Try direct service matching
    const serviceId = intentSystem.getServiceIdByKeywords(keywords);
    console.log(`- Direct service match: ${serviceId || 'None'}`);
    
    if (serviceId && knowledgeBase) {
        // Check if this maps to a real service
        const [groupName, serviceIndex] = serviceId.split('_');
        if (knowledgeBase[groupName] && knowledgeBase[groupName][parseInt(serviceIndex) - 1]) {
            const service = knowledgeBase[groupName][parseInt(serviceIndex) - 1];
            console.log(`- Found matching service: "${service['اسم الخدمة']}"`);
        } else {
            console.log(`- WARNING: Service ID doesn't match any actual service in knowledge base!`);
        }
    }
    
    // Test entity extraction
    const entities = intentSystem.extractEntities(query);
    console.log(`- Extracted entities: ${JSON.stringify(entities)}`);
    
    // Test complex pattern matching
    const complexMatch = intentSystem.matchComplexPattern(query);
    console.log(`- Complex pattern match: ${JSON.stringify(complexMatch)}`);
}); 