const express = require('express');
const path = require('path');
const fs = require('fs');
const CivilDefenseChatbot = require('./chatbot');

const app = express();

// Parse command line arguments for port
const args = process.argv.slice(2);
let customPort;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i+1]) {
        customPort = parseInt(args[i+1]);
        break;
    }
}

const PORT = customPort || process.env.PORT || 3030;

// Initialize chatbot
const chatbot = new CivilDefenseChatbot();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Root route - redirect to chat interface
app.get('/', (req, res) => {
    res.redirect('/modern-chat.html');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    try {
        const stats = chatbot.getStats();
        res.json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            stats: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Message is required and must be a string'
            });
        }
        
        // Debug logging for message
        console.log(`Received message: "${message}"`);
        console.log(`UTF-8 codes:`, message.split('').map(c => c.charCodeAt(0).toString(16)));
        
        // Direct language detection on received message
        const detectedLang = detectLanguage(message);
        console.log(`Detected language directly: ${detectedLang}`);

        // Process message with chatbot
        const result = chatbot.processMessage(message, sessionId);
        console.log(`Chatbot result:`, {
            success: result.success,
            confidence: result.confidence,
            serviceId: result.serviceId,
            language: result.language
        });

        // Log conversation
        await logConversation(sessionId, message, result.response, result.success);

        res.json({
            success: true,
            response: result.response,
            confidence: result.confidence || 0,
            serviceId: result.serviceId || null,
            language: result.language || detectedLang
        });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get conversations for a session
app.get('/api/conversations/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const conversations = await getConversationsBySession(sessionId);
        
        res.json({
            success: true,
            conversations: conversations
        });
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving conversations',
            error: error.message
        });
    }
});

// Get all conversations log
app.get('/api/conversations-log', async (req, res) => {
    try {
        const conversations = await getAllConversations();
        
        res.json({
            success: true,
            conversations: conversations
        });
    } catch (error) {
        console.error('Error getting conversations log:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving conversations log',
            error: error.message
        });
    }
});

// System statistics endpoint
app.get('/api/stats', (req, res) => {
    try {
        const stats = chatbot.getStats();
        const conversationCount = getConversationCount();
        
        res.json({
            success: true,
            stats: {
                ...stats,
                totalConversations: conversationCount,
                activeUsers: getActiveUsersCount(),
                successRate: calculateSuccessRate()
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics',
            error: error.message
        });
    }
});

// Knowledge base statistics
app.get('/api/kb-stats', (req, res) => {
    try {
        const stats = chatbot.getStats();
        
        res.json({
            success: true,
            stats: {
                totalServices: stats.totalServices,
                totalKeywords: stats.totalKeywords,
                lastUpdated: stats.lastUpdated
            }
        });
    } catch (error) {
        console.error('Error getting KB stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving knowledge base statistics',
            error: error.message
        });
    }
});

// Get all services
app.get('/api/services', (req, res) => {
    try {
        const services = chatbot.getAllServices();
        
        res.json({
            success: true,
            services: services
        });
    } catch (error) {
        console.error('Error getting services:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving services',
            error: error.message
        });
    }
});

// Add new service
app.post('/api/services', (req, res) => {
    try {
        const serviceData = req.body;
        const serviceId = generateServiceId();
        
        const success = chatbot.addService(serviceId, serviceData);
        
        if (success) {
            res.json({
                success: true,
                message: 'Service added successfully',
                serviceId: serviceId
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to add service'
            });
        }
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding service',
            error: error.message
        });
    }
});

// Update service
app.put('/api/services/:serviceId', (req, res) => {
    try {
        const { serviceId } = req.params;
        const serviceData = req.body;
        
        // Remove existing service and add updated one
        chatbot.removeService(serviceId);
        const success = chatbot.addService(serviceId, serviceData);
        
        if (success) {
            res.json({
                success: true,
                message: 'Service updated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to update service'
            });
        }
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating service',
            error: error.message
        });
    }
});

// Delete service
app.delete('/api/services/:serviceId', (req, res) => {
    try {
        const { serviceId } = req.params;
        
        const success = chatbot.removeService(serviceId);
        
        if (success) {
            res.json({
                success: true,
                message: 'Service deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting service',
            error: error.message
        });
    }
});

// Export knowledge base
app.get('/api/export-kb', (req, res) => {
    try {
        const knowledgeBase = chatbot.exportKnowledgeBase();
        
        res.json({
            success: true,
            knowledgeBase: JSON.parse(knowledgeBase)
        });
    } catch (error) {
        console.error('Error exporting knowledge base:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting knowledge base',
            error: error.message
        });
    }
});

// Import knowledge base
app.post('/api/import-kb', (req, res) => {
    try {
        const { knowledgeBase } = req.body;
        
        const success = chatbot.importKnowledgeBase(knowledgeBase);
        
        if (success) {
            res.json({
                success: true,
                message: 'Knowledge base imported successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to import knowledge base'
            });
        }
    } catch (error) {
        console.error('Error importing knowledge base:', error);
        res.status(500).json({
            success: false,
            message: 'Error importing knowledge base',
            error: error.message
        });
    }
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
    try {
        const settings = loadSettings();
        res.json({
            success: true,
            settings: settings
        });
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving settings',
            error: error.message
        });
    }
});

app.post('/api/settings', (req, res) => {
    try {
        const settings = req.body;
        saveSettings(settings);
        
        res.json({
            success: true,
            message: 'Settings saved successfully'
        });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving settings',
            error: error.message
        });
    }
});

// Utility functions
function generateServiceId() {
    return 'service_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function logConversation(sessionId, userMessage, botResponse, success) {
    try {
        const logEntry = {
            sessionId: sessionId || 'anonymous',
            userMessage: userMessage,
            botResponse: botResponse,
            success: success,
            timestamp: new Date().toISOString(),
            language: detectLanguage(userMessage)
        };

        const logFile = path.join(__dirname, 'data', 'conversations_log.json');
        const dir = path.dirname(logFile);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let conversations = [];
        if (fs.existsSync(logFile)) {
            const data = fs.readFileSync(logFile, 'utf8');
            conversations = JSON.parse(data);
        }

        conversations.push(logEntry);

        // Keep only last 1000 conversations
        if (conversations.length > 1000) {
            conversations = conversations.slice(-1000);
        }

        fs.writeFileSync(logFile, JSON.stringify(conversations, null, 2));
    } catch (error) {
        console.error('Error logging conversation:', error);
    }
}

async function getConversationsBySession(sessionId) {
    try {
        const logFile = path.join(__dirname, 'data', 'conversations_log.json');
        
        if (!fs.existsSync(logFile)) {
            return [];
        }

        const data = fs.readFileSync(logFile, 'utf8');
        const conversations = JSON.parse(data);
        
        return conversations.filter(conv => conv.sessionId === sessionId);
    } catch (error) {
        console.error('Error getting conversations by session:', error);
        return [];
    }
}

async function getAllConversations() {
    try {
        const logFile = path.join(__dirname, 'data', 'conversations_log.json');
        
        if (!fs.existsSync(logFile)) {
            return [];
        }

        const data = fs.readFileSync(logFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error getting all conversations:', error);
        return [];
    }
}

function getConversationCount() {
    try {
        const logFile = path.join(__dirname, 'data', 'conversations_log.json');
        
        if (!fs.existsSync(logFile)) {
            return 0;
        }

        const data = fs.readFileSync(logFile, 'utf8');
        const conversations = JSON.parse(data);
        
        return conversations.length;
    } catch (error) {
        console.error('Error getting conversation count:', error);
        return 0;
    }
}

function getActiveUsersCount() {
    try {
        const logFile = path.join(__dirname, 'data', 'conversations_log.json');
        
        if (!fs.existsSync(logFile)) {
            return 0;
        }

        const data = fs.readFileSync(logFile, 'utf8');
        const conversations = JSON.parse(data);
        
        // Count unique session IDs in last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentConversations = conversations.filter(conv => 
            new Date(conv.timestamp) > oneDayAgo
        );
        
        const uniqueSessions = new Set(recentConversations.map(conv => conv.sessionId));
        return uniqueSessions.size;
    } catch (error) {
        console.error('Error getting active users count:', error);
        return 0;
    }
}

function calculateSuccessRate() {
    try {
        const logFile = path.join(__dirname, 'data', 'conversations_log.json');
        
        if (!fs.existsSync(logFile)) {
            return 0;
        }

        const data = fs.readFileSync(logFile, 'utf8');
        const conversations = JSON.parse(data);
        
        if (conversations.length === 0) {
            return 0;
        }

        const successfulConversations = conversations.filter(conv => conv.success).length;
        return Math.round((successfulConversations / conversations.length) * 100);
    } catch (error) {
        console.error('Error calculating success rate:', error);
        return 0;
    }
}

function detectLanguage(text) {
    if (!text || typeof text !== 'string') {
        return 'english';
    }
    
    // Better Arabic detection
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const hasArabic = arabicPattern.test(text);
    
    // Log for debugging
    console.log(`Language detection in server: "${text.substring(0, 20)}..." - Arabic: ${hasArabic}`);
    
    return hasArabic ? 'arabic' : 'english';
}

function loadSettings() {
    try {
        const settingsFile = path.join(__dirname, 'data', 'settings.json');
        
        if (fs.existsSync(settingsFile)) {
            const data = fs.readFileSync(settingsFile, 'utf8');
            return JSON.parse(data);
        }
        
        // Return default settings
        return {
            autoBackup: false,
            maxConversations: 1000,
            sessionTimeout: 30,
            defaultLanguage: 'arabic',
            confidenceThreshold: 50
        };
    } catch (error) {
        console.error('Error loading settings:', error);
        return {
            autoBackup: false,
            maxConversations: 1000,
            sessionTimeout: 30,
            defaultLanguage: 'arabic',
            confidenceThreshold: 50
        };
    }
}

function saveSettings(settings) {
    try {
        const settingsFile = path.join(__dirname, 'data', 'settings.json');
        const dir = path.dirname(settingsFile);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Civil Defense Chatbot Server running on port ${PORT}`);
    console.log(`📱 Chat Interface: http://localhost:${PORT}/modern-chat.html`);
    console.log(`⚙️  Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 System Stats: http://localhost:${PORT}/api/stats`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

module.exports = app; 