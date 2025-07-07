/**
 * Debug script to analyze the knowledge base structure
 */
const fs = require('fs');
const path = require('path');

// Load the knowledge base
const knowledgeBasePath = path.join(__dirname, 'data', 'knowledge_base.json');
const knowledgeBaseData = fs.readFileSync(knowledgeBasePath, 'utf8');
const knowledgeBase = JSON.parse(knowledgeBaseData);

console.log('Knowledge Base Structure Analysis:');
console.log('-'.repeat(50));

// Check top-level structure
console.log('Top level keys:');
Object.keys(knowledgeBase).forEach(key => {
    console.log(`- ${key}: ${typeof knowledgeBase[key]}`);
    if (Array.isArray(knowledgeBase[key])) {
        console.log(`  Array with ${knowledgeBase[key].length} items`);
    } else if (typeof knowledgeBase[key] === 'object') {
        console.log(`  Object with ${Object.keys(knowledgeBase[key]).length} keys`);
    }
});

console.log('-'.repeat(50));

// Check if the المجموعة الثانية group exists and has at least 7 services
if (knowledgeBase['المجموعة الثانية']) {
    console.log(`المجموعة الثانية exists with ${knowledgeBase['المجموعة الثانية'].length} services`);
    
    // Check the 7th service specifically
    if (knowledgeBase['المجموعة الثانية'].length >= 7) {
        const bakeryService = knowledgeBase['المجموعة الثانية'][6]; // 7th item (index 6)
        console.log('Service at المجموعة الثانية_7:');
        console.log(JSON.stringify(bakeryService, null, 2));
        
        // Check for the Arabic word for bakery (مخابز) instead of (مخبز)
        const serviceName = bakeryService['اسم الخدمة'] || '';
        console.log('\nChecking Arabic terms in service name:');
        console.log(`- Contains "مخبز": ${serviceName.includes('مخبز')}`);
        console.log(`- Contains "مخابز": ${serviceName.includes('مخابز')}`);
        console.log(`- Contains "المخابز": ${serviceName.includes('المخابز')}`);
    } else {
        console.log('المجموعة الثانية does not have at least 7 services');
    }
} else {
    console.log('المجموعة الثانية does not exist in the knowledge base');
}

// Check the internal structure of our targetted service
console.log('-'.repeat(50));
console.log('Looking for service with name containing bakery terms:');

let foundBakeryService = false;
for (const groupKey of Object.keys(knowledgeBase).filter(k => k.startsWith('المجموعة'))) {
    const group = knowledgeBase[groupKey];
    if (Array.isArray(group)) {
        group.forEach((service, index) => {
            const serviceName = service['اسم الخدمة'] || '';
            if (serviceName.includes('مخابز') || serviceName.includes('المخابز') || serviceName.includes('مخبز')) {
                console.log(`Found service at ${groupKey}_${index + 1}:`);
                console.log(`- Service name: "${serviceName}"`);
                console.log(`- Contains "مخبز": ${serviceName.includes('مخبز')}`);
                console.log(`- Contains "مخابز": ${serviceName.includes('مخابز')}`);
                console.log(`- Contains "المخابز": ${serviceName.includes('المخابز')}`);
                console.log(JSON.stringify(service, null, 2));
                foundBakeryService = true;
            }
        });
    }
}

if (!foundBakeryService) {
    console.log('No service with name containing bakery terms found in the knowledge base');
} 