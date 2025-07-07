const fs = require('fs');
const path = require('path');

try {
    console.log('Working directory:', process.cwd());
    
    // Check if file exists
    const kbPath = path.join(__dirname, 'data', 'knowledge_base.json');
    console.log('KB path:', kbPath);
    console.log('File exists:', fs.existsSync(kbPath));
    
    // Read file content
    const rawData = fs.readFileSync(kbPath, 'utf8');
    console.log('File size:', rawData.length, 'bytes');
    console.log('First 100 chars:', rawData.substring(0, 100));
    
    // Try to parse JSON
    try {
        const kb = JSON.parse(rawData);
        console.log('JSON parsed successfully');
        console.log('KB structure:', Object.keys(kb));
        
        if (kb.services) {
            console.log('Service groups:', Object.keys(kb.services));
            
            // Check the first group
            const firstGroup = Object.keys(kb.services)[0];
            if (firstGroup) {
                console.log(`First group (${firstGroup}) has:`, kb.services[firstGroup].length, 'services');
                console.log('First service:', kb.services[firstGroup][0]);
            }
        } else {
            console.log('No services property found in KB');
        }
    } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError.message);
    }
} catch (error) {
    console.error('Error reading knowledge base:', error);
} 