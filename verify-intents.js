/**
 * Script to verify that all services in the knowledge base have corresponding intent keywords
 */

const fs = require('fs');
const intents = require('./intents.js');
const kb = JSON.parse(fs.readFileSync('./data/knowledge_base.json', 'utf8'));

// Get all service IDs from the knowledge base
const kbServiceIds = [];
const kbServiceMap = {}; // Map to store service data by ID

Object.keys(kb).forEach(group => {
  if (typeof kb[group] === 'object') {
    Object.keys(kb[group]).forEach(serviceId => {
      // KB uses 0-9, intents use 1-10
      const kbId = serviceId;
      const intentId = (parseInt(serviceId) + 1).toString();
      const fullKbId = group + '_' + kbId;
      const fullIntentId = group + '_' + intentId;
      
      kbServiceIds.push(fullKbId);
      kbServiceMap[fullIntentId] = {
        kbId: fullKbId,
        data: kb[group][serviceId]
      };
    });
  }
});

// Get all service IDs from the intents file
const intentServiceIds = [];
const intentKeywords = {};

Object.entries(intents.serviceIntentExamples).forEach(([key, value]) => {
  intentServiceIds.push(value.service_id);
  intentKeywords[value.service_id] = value.keywords;
});

// Check if all knowledge base services have intent keywords (after conversion)
const missingInIntents = [];
kbServiceIds.forEach(kbId => {
  const parts = kbId.split('_');
  const group = parts[0];
  const id = parseInt(parts[1]);
  const intentId = group + '_' + (id + 1);
  
  if (!intentServiceIds.includes(intentId)) {
    missingInIntents.push({
      kbId,
      intentId,
      serviceName: kb[group][id]['اسم الخدمة'] || kb[group][id].name || 'Unknown'
    });
  }
});

// Check if all intent services exist in the knowledge base (after conversion)
const missingInKb = [];
intentServiceIds.forEach(intentId => {
  const parts = intentId.split('_');
  const group = parts[0];
  const id = parseInt(parts[1]);
  const kbId = group + '_' + (id - 1);
  
  if (!kbServiceIds.includes(kbId)) {
    missingInKb.push({
      intentId,
      kbId,
      keywords: intentKeywords[intentId] || []
    });
  }
});

// Print results
console.log('=== Intent Coverage Analysis ===');
console.log(`Total services in knowledge base: ${kbServiceIds.length}`);
console.log(`Total services with intent keywords: ${intentServiceIds.length}`);

if (missingInIntents.length > 0) {
  console.log('\n⚠️ Services in knowledge base but missing in intents:');
  missingInIntents.forEach(item => {
    console.log(`- ${item.kbId} (should be ${item.intentId}): ${item.serviceName}`);
  });
} else {
  console.log('\n✅ All services in knowledge base have intent keywords!');
}

if (missingInKb.length > 0) {
  console.log('\n⚠️ Services in intents but missing in knowledge base:');
  missingInKb.forEach(item => {
    console.log(`- ${item.intentId} (should be ${item.kbId}): ${item.keywords.length} keywords`);
  });
} else {
  console.log('\n✅ All services in intents exist in knowledge base!');
}

// Print keyword counts for each service
console.log('\n=== Keyword Counts for Each Service ===');
Object.entries(intentKeywords).sort((a, b) => a[0].localeCompare(b[0])).forEach(([serviceId, keywords]) => {
  const count = keywords.length;
  const status = count < 5 ? '⚠️' : '✅';
  console.log(`${status} ${serviceId}: ${count} keywords`);
});

// Print services with fewer than 5 keywords
const lowKeywordServices = Object.entries(intentKeywords)
  .filter(([_, keywords]) => keywords.length < 5)
  .map(([serviceId]) => serviceId);

if (lowKeywordServices.length > 0) {
  console.log('\n⚠️ Services with fewer than 5 keywords:');
  lowKeywordServices.forEach(id => console.log(`- ${id}`));
} else {
  console.log('\n✅ All services have at least 5 keywords!');
}

// Print statistics
const totalKeywords = Object.values(intentKeywords).reduce((sum, keywords) => sum + keywords.length, 0);
const avgKeywords = totalKeywords / intentServiceIds.length;
console.log(`\nTotal keywords across all services: ${totalKeywords}`);
console.log(`Average keywords per service: ${avgKeywords.toFixed(2)}`); 