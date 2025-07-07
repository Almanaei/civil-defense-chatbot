const intentSystem = require('./intents');

// Test Arabic text detection
const testArabicText = "اريد ترخيص مخبز شعبي";
console.log('Is Arabic text:', /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(testArabicText));
console.log('Arabic text:', testArabicText);

// Extract keywords
const keywords = testArabicText.replace(/[^\w\s\u0600-\u06FF]/g, ' ')
                     .split(/\s+/)
                     .filter(word => word.length > 2);
console.log('Extracted keywords:', keywords);

// Test intent matching
const serviceId = intentSystem.getServiceIdByKeywords(keywords);
console.log('Service ID from keywords:', serviceId);

// Test entity extraction
const entities = intentSystem.extractEntities(testArabicText);
console.log('Extracted entities:', entities);

// Test complex pattern matching
const patterns = intentSystem.matchComplexPattern(testArabicText);
console.log('Complex patterns:', patterns);

// Test full function
function testIntentSystem(text) {
    console.log('\n--- Testing with text:', text);
    const keywords = text.replace(/[^\w\s\u0600-\u06FF]/g, ' ')
                      .split(/\s+/)
                      .filter(word => word.length > 2);
    console.log('Keywords:', keywords);
    
    // Get general intent categories
    keywords.forEach(keyword => {
        const category = intentSystem.getIntentCategoryForKeyword(keyword);
        console.log(`Intent category for "${keyword}":`, category);
    });
    
    // Check for service-specific intents
    const serviceId = intentSystem.getServiceIdByKeywords(keywords);
    console.log('Service ID:', serviceId);
}

// Run tests with different examples
testIntentSystem("اريد ترخيص مخبز شعبي");
testIntentSystem("معلومات عن ترخيص المخابز الشعبية");
testIntentSystem("اصدار شهادة سلامة للمباني");
testIntentSystem("تقرير حوادث الحريق");
testIntentSystem("تركيب معدات الإطفاء"); 