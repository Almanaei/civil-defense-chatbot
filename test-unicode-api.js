/**
 * Test script to call the API with explicit Unicode encoding
 */

const https = require('http');

const arabicMessage = "اريد ترخيص مخبز شعبي";

// Log the Arabic message characters
console.log('Arabic message:', arabicMessage);
console.log('Character codes:');
for (let i = 0; i < arabicMessage.length; i++) {
    const char = arabicMessage[i];
    const code = char.charCodeAt(0);
    console.log(`${i}: '${char}' - ${code} - 0x${code.toString(16)}`);
}

// Create request data
const requestData = JSON.stringify({
    message: arabicMessage,
    sessionId: "test-unicode-123"
});

// Request options
const options = {
    hostname: 'localhost',
    port: 3050,
    path: '/api/chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
    }
};

// Make request
const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    
    res.on('end', () => {
        try {
            const response = JSON.parse(responseData);
            console.log('API Response:', JSON.stringify(response, null, 2));
        } catch (error) {
            console.error('Error parsing response:', error);
            console.log('Raw response:', responseData);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(requestData);
req.end();

console.log('Request sent with data:', requestData); 