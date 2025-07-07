const fs = require('fs');
const path = require('path');
const intentSystem = require('./intents');
// Make intent system available throughout the chatbot

class CivilDefenseChatbot {
  constructor() {
        this.knowledgeBase = null;
        this.conversations = new Map();
        this.conversationMemory = new Map(); // Add memory storage
        this.memoryLimit = 10; // Store last 10 interactions per session
        this.loadKnowledgeBase();
    }

    /**
     * Load knowledge base from file
     */
    loadKnowledgeBase() {
        try {
            const knowledgeBasePath = path.join(__dirname, 'data', 'knowledge_base.json');
            const data = fs.readFileSync(knowledgeBasePath, 'utf8');
            const rawData = JSON.parse(data);
            
            // Use raw data directly instead of converting
            this.knowledgeBase = rawData;
            console.log('✅ Knowledge base loaded successfully');
        } catch (error) {
            console.error('Error loading knowledge base:', error);
            // Initialize with empty structure
            this.knowledgeBase = {
                services: {},
                greetings: {
                    arabic: ['مرحبا', 'السلام عليكم', 'أهلا وسهلا', 'صباح الخير', 'مساء الخير'],
                    english: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
                },
                fallback: {
                    arabic: 'عذراً، لم أفهم سؤالك. يمكنك إعادة صياغة السؤال أو الاستفسار عن خدمات الدفاع المدني.',
                    english: 'Sorry, I did not understand your question. You can rephrase or ask about Civil Defense services.'
                }
            };
        }
    }

    /**
     * Convert the new knowledge base structure to the expected format
     */
    convertKnowledgeBaseStructure(rawData) {
        const converted = {
            services: {},
            greetings: {
                arabic: ['مرحبا', 'السلام عليكم', 'أهلا وسهلا', 'صباح الخير', 'مساء الخير'],
                english: ['hello', 'hi', 'good morning', 'good afternoon', 'good evening']
            },
            fallback: {
                arabic: 'عذراً، لم أفهم سؤالك. هل يمكنك إعادة صياغة السؤال؟',
                english: 'Sorry, I did not understand your question. Could you please rephrase it?'
            }
        };

        // Process each group
        Object.keys(rawData).forEach(groupName => {
            if (Array.isArray(rawData[groupName])) {
                rawData[groupName].forEach((service, index) => {
                    const serviceId = `${groupName}_${index + 1}`;
                    
                    // Extract keywords from service name and description
                    const keywords = this.extractKeywordsFromArabicText(service['اسم الخدمة'] + ' ' + service['وصف الخدمة']);
                    
                    // Create specific terms for better matching
                    const specificTerms = [
                        service['اسم الخدمة'],
                        'ترخيص',
                        'شهادة',
                        'تقرير',
                        'فحص',
                        'تدريب',
                        'مكتب',
                        'مصنع',
                        'محطة',
                        'محل',
                        'مخبز',
                        'خيمة',
                        'مخطط',
                        'خرائط'
                    ];

                    converted.services[serviceId] = {
                        name: service['اسم الخدمة'],
                        description: service['وصف الخدمة'],
                        fees: service['رسوم الخدمة'],
                        requirements: service['شروط الخدمة'],
                        procedures: service['كيفية التقديم'],
                        documents: service['المستندات المطلوبة'],
                        duration: service['مدة إنجاز الخدمة'],
                        keywords: keywords,
                        specificTerms: specificTerms,
                        group: groupName
                    };
                });
            }
        });

        return converted;
    }

    /**
     * Extract keywords from Arabic text
     */
    extractKeywordsFromArabicText(text) {
        if (!text) return [];
        
        // Remove punctuation and split into words
        const words = text.replace(/[^\w\s\u0600-\u06FF]/g, ' ')
                         .split(/\s+/)
                         .filter(word => word.length > 2);
        
        // Filter out common words and keep meaningful ones
        const commonWords = ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي', 'الذي', 'التي', 'هو', 'هي', 'هم', 'هن', 'أنا', 'أنت', 'أنتِ', 'نحن', 'أنتم', 'أنتن'];
        return words.filter(word => !commonWords.includes(word));
    }

    /**
     * Save knowledge base to JSON file
     */
    saveKnowledgeBase() {
        try {
            const kbPath = path.join(__dirname, 'data', 'knowledge_base.json');
            const dir = path.dirname(kbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(kbPath, JSON.stringify(this.knowledgeBase, null, 2), 'utf8');
            console.log('✅ Knowledge base saved successfully');
        } catch (error) {
            console.error('❌ Error saving knowledge base:', error.message);
        }
    }

    /**
     * Detect language of the input text
     */
    detectLanguage(text) {
        if (!text || typeof text !== 'string') {
            return 'english';
        }
        
        // More comprehensive Arabic character range with better detection
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const hasArabic = arabicPattern.test(text);
        
        // Log detection for debugging
        console.log('Language detection:', { text: text.substring(0, 30), isArabic: hasArabic });
        
        return hasArabic ? 'arabic' : 'english';
    }

    /**
     * Check if text contains any keywords from a list
     */
    containsAnyKeyword(text, keywords) {
        if (!text || !keywords || !Array.isArray(keywords)) return false;
        
        const normalizedText = text.toLowerCase().trim();
        const result = keywords.some(keyword => 
            normalizedText.includes(keyword.toLowerCase().trim())
        );
        
        // Debug logging
        console.log('containsAnyKeyword:', {
            text: text,
            keywords: keywords,
            normalizedText: normalizedText,
            result: result
        });
        
        return result;
    }

    /**
     * Extract keywords from text
     */
    extractKeywordsFromText(text) {
        if (!text) return [];
        
        // Remove punctuation and split into words
        const words = text.replace(/[^\w\s\u0600-\u06FF]/g, ' ')
                         .split(/\s+/)
                         .filter(word => word.length > 2);
        
        return words;
    }

    /**
     * Calculate similarity between two strings
     */
    calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        
        const s1 = str1.toLowerCase();
        const s2 = str2.toLowerCase();
        
        if (s1 === s2) return 1;
        
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        
        if (longer.length === 0) return 1;
        
        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance between two strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
          matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
          matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
          for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
              matrix[i][j] = matrix[i - 1][j - 1];
            } else {
              matrix[i][j] = Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1
              );
            }
          }
        }
        
        return matrix[str2.length][str1.length];
    }

    /**
     * Check if message is a greeting
     */
    isGreeting(message) {
        if (!message || !this.knowledgeBase.greetings) return false;
        
        const language = this.detectLanguage(message);
        const greetings = this.knowledgeBase.greetings[language] || [];
        
        // Check for exact matches first
        const normalizedMessage = message.toLowerCase().trim();
        const exactMatch = greetings.some(greeting => 
            normalizedMessage.includes(greeting.toLowerCase().trim())
        );
        
        if (exactMatch) return true;
        
        // Check for partial matches
        const partialMatch = this.containsAnyKeyword(message, greetings);
        
        // Debug logging
        console.log('Greeting check:', {
            message: message,
            language: language,
            greetings: greetings,
            exactMatch: exactMatch,
            partialMatch: partialMatch
        });
        
        return partialMatch;
    }

    /**
     * Get greeting response
     */
    getGreetingResponse(language) {
        // Default responses if knowledge base doesn't have them
        const defaultResponses = {
            arabic: [
                'أهلاً وسهلاً بك! كيف يمكنني مساعدتك في خدمات الدفاع المدني؟',
                'مرحباً! أنا هنا لمساعدتك في استفساراتك حول خدمات الدفاع المدني. ما الذي تريد معرفته؟',
                'أهلاً وسهلاً! كيف يمكنني خدمتك اليوم في مجال الدفاع المدني؟'
            ],
            english: [
                'Hello! How can I help you with Civil Defense services?',
                'Welcome! I\'m here to assist you with Civil Defense inquiries. What would you like to know?',
                'Hi there! How can I serve you today with Civil Defense services?'
            ]
        };
        
        // Use knowledge base greetings if available, otherwise fall back to defaults
        let greetingsSource = defaultResponses;
        if (this.knowledgeBase && this.knowledgeBase.greetings) {
            greetingsSource = this.knowledgeBase.greetings;
        }
        
        const langResponses = greetingsSource[language] || greetingsSource.english || defaultResponses.english;
        
        // If it's an array, pick randomly, otherwise return the string directly
        if (Array.isArray(langResponses)) {
            return langResponses[Math.floor(Math.random() * langResponses.length)];
        } else if (typeof langResponses === 'string') {
            return langResponses;
        } else {
            // Final fallback
            return language === 'arabic' ? 
                'أهلاً وسهلاً بك في خدمات الدفاع المدني. كيف يمكنني مساعدتك؟' : 
                'Welcome to Civil Defense services. How can I help you?';
        }
    }

    /**
     * Find the best matching service for the user's query
     */
    findBestService(userMessage) {
        console.log(`[Chatbot] Finding best service for: "${userMessage}"`);
        
        if (!userMessage || !this.knowledgeBase) {
            console.log(`[Chatbot] Invalid message or missing knowledge base`);
            return null;
        }

        const language = this.detectLanguage(userMessage);
        console.log(`[Chatbot] Service search - detected language: ${language}`);
        
        const userKeywords = this.extractKeywordsFromText(userMessage);
        console.log(`[Chatbot] Extracted keywords: ${userKeywords.join(', ')}`);
        
        let bestMatch = null;
        let bestScore = 0;
        
        // Use our new intent system - with enhanced logging
        console.log('[Chatbot] Processing message with intent system:', userMessage);
        
        const extractedEntities = intentSystem.extractEntities(userMessage);
        console.log('[Chatbot] Extracted entities:', extractedEntities);
        
        const complexPatternMatch = intentSystem.matchComplexPattern(userMessage);
        console.log('[Chatbot] Complex pattern match:', complexPatternMatch);
        
        // Direct service match from the intent system - with additional logging
        const directServiceId = intentSystem.getServiceIdByKeywords(userKeywords);
        console.log('[Chatbot] Direct service match:', directServiceId);
        
        // If we have a direct match from our intent system
        if (directServiceId && this.knowledgeBase) {
            // Parse the service ID to get group and index
            const [groupName, serviceIndex] = directServiceId.split('_');
            
            // Check if the group exists and has the service at the specified index
            if (this.knowledgeBase[groupName] && this.knowledgeBase[groupName][parseInt(serviceIndex) - 1]) {
                const service = this.knowledgeBase[groupName][parseInt(serviceIndex) - 1];
                console.log('[Chatbot] Found direct intent match:', { groupName, serviceIndex, service });
                return { 
                    serviceId: directServiceId, 
                    service, 
                    score: 15, 
                    matchedCategory: 'direct_intent_match' 
                };
            }
            
            console.log('[Chatbot] Service ID found but no matching service in knowledge base:', directServiceId);
        }
        
        // Get intent categories for each keyword for more sophisticated matching
        const intentMatches = userKeywords.map(keyword => 
            intentSystem.getIntentCategoryForKeyword(keyword)
        ).filter(match => match !== null);
        console.log('[Chatbot] Intent matches:', intentMatches);

        // Define specific service categories and their keywords
        const serviceCategories = {
            'ترخيص': intentSystem.generalIntents.license_intents,
            'شهادة': intentSystem.generalIntents.certificate_intents,
            'تقرير': intentSystem.generalIntents.report_intents,
            'فحص': intentSystem.generalIntents.inspection_intents,
            'تدريب': intentSystem.generalIntents.training_intents,
            'خرائط': intentSystem.generalIntents.blueprint_intents,
            'معدات': intentSystem.serviceSpecificIntents.fire_safety_intents,
            'مواد خطرة': intentSystem.serviceSpecificIntents.chemical_intents,
            'وقود': intentSystem.serviceSpecificIntents.gas_intents,
            'مكاتب': intentSystem.serviceSpecificIntents.technical_office_intents,
            'منشآت': intentSystem.serviceSpecificIntents.building_intents,
            'متفجرات': intentSystem.serviceSpecificIntents.explosives_intents,
            'نقل': intentSystem.serviceSpecificIntents.transportation_intents,
            'ترجمة': intentSystem.serviceSpecificIntents.translation_intents
        };

        // Process each service group in the knowledge base
        console.log('[Chatbot] Processing service groups in knowledge base');
        
        // In our structure, the top level keys are the service groups
        const serviceGroups = Object.keys(this.knowledgeBase).filter(key => key.startsWith('المجموعة'));
        console.log('[Chatbot] Found service groups:', serviceGroups);
        
        for (const groupKey of serviceGroups) {
            const serviceGroup = this.knowledgeBase[groupKey];
            
            // Process each service in this group
            serviceGroup.forEach((service, serviceIndex) => {
                const serviceId = `${groupKey}_${serviceIndex + 1}`;
                let score = 0;
                let matchedCategory = null;
                
                const serviceName = service['اسم الخدمة'] || '';
                const serviceDesc = service['وصف الخدمة'] || '';
                const serviceFees = service['رسوم الخدمة'] || '';
                const serviceReq = service['شروط الخدمة'] || '';
                const serviceProcedure = service['كيفية التقديم'] || '';
                const serviceDocs = service['المستندات المطلوبة'] || '';
                const serviceDuration = service['مدة إنجاز الخدمة'] || '';
                
                // Check for exact service name match (highest priority)
                const normalizedServiceName = serviceName.toLowerCase().trim();
                const normalizedMessage = userMessage.toLowerCase().trim();
                
                // Exact name match gets highest score
                if (normalizedMessage.includes(normalizedServiceName) || 
                    normalizedServiceName.includes(normalizedMessage)) {
                    score += 10;
                    console.log(`[Chatbot] Service name match for ${serviceId}: ${serviceName}`);
                }
                
                // Partial name match
                const nameWords = normalizedServiceName.split(/\s+/);
                const messageWords = normalizedMessage.split(/\s+/);
                const commonWords = nameWords.filter(word => 
                    messageWords.some(msgWord => 
                        this.calculateSimilarity(word, msgWord) > 0.8
                    )
                );
                score += commonWords.length * 3;
                
                if (commonWords.length > 0) {
                    console.log(`[Chatbot] Common words match for ${serviceId}: ${commonWords.join(', ')}`);
                }

                // Check service description for relevance
                const descSimilarity = this.calculateSimilarity(userMessage, serviceDesc);
                score += descSimilarity * 2;

                // Check for category-specific keywords
                for (const [category, keywords] of Object.entries(serviceCategories)) {
                    const categoryMatches = keywords.filter(keyword => 
                        this.containsAnyKeyword(userMessage, [keyword])
                    ).length;
                    
                    if (categoryMatches > 0) {
                        score += categoryMatches * 2;
                        matchedCategory = category;
                        console.log(`[Chatbot] Category match for ${serviceId}: ${category}, ${categoryMatches} matches`);
                    }
                }

                // Bonus for entity matches from our NER system
                if (extractedEntities.service_entities) {
                    const serviceEntityMatches = extractedEntities.service_entities.filter(entity =>
                        serviceName.includes(entity)
                    ).length;
                    score += serviceEntityMatches * 3;
                    
                    if (serviceEntityMatches > 0) {
                        console.log(`[Chatbot] Service entity match for ${serviceId}: ${extractedEntities.service_entities.join(', ')}`);
                    }
                }
                
                if (extractedEntities.facility_entities) {
                    const facilityEntityMatches = extractedEntities.facility_entities.filter(entity =>
                        serviceName.includes(entity)
                    ).length;
                    score += facilityEntityMatches * 2;
                    
                    if (facilityEntityMatches > 0) {
                        console.log(`[Chatbot] Facility entity match for ${serviceId}: ${extractedEntities.facility_entities.join(', ')}`);
                    }
                }
                
                if (extractedEntities.material_entities) {
                    const materialEntityMatches = extractedEntities.material_entities.filter(entity =>
                        serviceName.includes(entity) || serviceDesc.includes(entity)
                    ).length;
                    score += materialEntityMatches * 2;
                    
                    if (materialEntityMatches > 0) {
                        console.log(`[Chatbot] Material entity match for ${serviceId}: ${extractedEntities.material_entities.join(', ')}`);
                    }
                }
                
                // Bonus for intent matches
                intentMatches.forEach(match => {
                    if (match && match.type === 'service_example' && match.service_id === serviceId) {
                        // Direct service match - very high score
                        score += 10;
                        console.log(`[Chatbot] Direct service intent match for ${serviceId}`);
                    } else if (match && match.type === 'field') {
                        // User is asking about a specific field of a service
                        score += 2;
                    }
                });
                
                // Complex pattern matches
                if (complexPatternMatch) {
                    if (complexPatternMatch.intent === 'service_fees' && serviceFees) {
                        score += 3;
                    } else if (complexPatternMatch.intent === 'required_documents' && serviceDocs) {
                        score += 3;
                    } else if (complexPatternMatch.intent === 'service_duration' && serviceDuration) {
                        score += 3;
                    } else if (complexPatternMatch.intent === 'application_process' && serviceProcedure) {
                        score += 3;
                    }
                    
                    // Check if service type in pattern matches this service
                    if (complexPatternMatch.service_type &&
                        (serviceName.includes(complexPatternMatch.service_type) ||
                        serviceDesc.includes(complexPatternMatch.service_type))) {
                        score += 4;
                        console.log(`[Chatbot] Complex pattern service type match for ${serviceId}: ${complexPatternMatch.service_type}`);
                    }
                }

                // Debug logging for high-scoring matches
                if (score > 2) {
                    console.log(`[Chatbot] Service match candidate: ${serviceName} (${serviceId}) - Score: ${score}`);
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = { 
                        serviceId, 
                        service: {
                            name: serviceName,
                            description: serviceDesc,
                            fees: serviceFees,
                            requirements: serviceReq,
                            procedures: serviceProcedure,
                            documents: serviceDocs,
                            duration: serviceDuration,
                            group: groupKey
                        }, 
                        score, 
                        matchedCategory 
                    };
                    console.log(`[Chatbot] New best match: ${serviceId} with score ${score}`);
                }
            });
        }

        // Higher threshold for more precise matching
        const result = bestScore > 5 ? bestMatch : null;
        console.log('[Chatbot] Final result:', result);
        return result;
    }

    /**
     * Generate response for a service
     */
    generateServiceResponse(match, language) {
        console.log('[Chatbot] Generating service response:', match, language);
        
        // Handle different parameter formats
        let serviceId, service;
        
        if (typeof match === 'string' && arguments.length >= 2 && typeof arguments[1] === 'object') {
            // Called with (serviceId, service, language) format
            serviceId = match;
            service = arguments[1];
            language = arguments[2] || language;
        } else if (match && match.service) {
            // Called with (match, language) format
            serviceId = match.serviceId;
            service = match.service;
        } else {
            console.log('[Chatbot] Invalid match object for response generation');
            return language === 'arabic' ? 
                'عذراً، لم أتمكن من العثور على معلومات عن هذه الخدمة.' : 
                'Sorry, I could not find information about this service.';
        }
        
        if (!service) {
            console.log('[Chatbot] No service data for response generation');
            return language === 'arabic' ? 
                'عذراً، لم أتمكن من العثور على معلومات عن هذه الخدمة.' : 
                'Sorry, I could not find information about this service.';
        }
        
        let response = '';
        
        // Handle Arabic field names from the knowledge base
        const serviceName = service['اسم الخدمة'] || service.name || 'الخدمة';
        const serviceDesc = service['وصف الخدمة'] || service.description || '';
        const serviceFees = service['رسوم الخدمة'] || service.fees || '';
        const serviceReqs = service['شروط الخدمة'] || service.requirements || '';
        const serviceProcedures = service['كيفية التقديم'] || service.procedures || '';
        const serviceDocs = service['المستندات المطلوبة'] || service.documents || '';
        const serviceDuration = service['مدة إنجاز الخدمة'] || service.duration || '';
        const serviceGroup = service.group || (serviceId ? serviceId.split('_')[0] : '');
        
        if (language === 'arabic') {
            // Title of the service
            response += `**${serviceName}**\n\n`;
            
            // Format service details as a structured list
            if (serviceDesc) {
                response += `**الوصف:**\n• ${serviceDesc}\n\n`;
            }
            
            if (serviceFees) {
                response += `**الرسوم:**\n• ${serviceFees}\n\n`;
            }
            
            if (serviceReqs) {
                // Split by commas to make a list
                const reqsList = serviceReqs.split(/،|,/).filter(item => item.trim());
                if (reqsList.length > 1) {
                    response += `**الشروط:**\n${reqsList.map(req => `• ${req.trim()}`).join('\n')}\n\n`;
                } else {
                    response += `**الشروط:**\n• ${serviceReqs}\n\n`;
                }
            }
            
            if (serviceProcedures) {
                // Split by commas or periods to make a list
                const procList = serviceProcedures.split(/،|,|\.|\./).filter(item => item.trim());
                if (procList.length > 1) {
                    response += `**كيفية التقديم:**\n${procList.map(proc => `• ${proc.trim()}`).join('\n')}\n\n`;
                } else {
                    response += `**كيفية التقديم:**\n• ${serviceProcedures}\n\n`;
                }
            }
            
            if (serviceDocs) {
                // Split by commas to make a list
                const docsList = serviceDocs.split(/،|,/).filter(item => item.trim());
                if (docsList.length > 1) {
                    response += `**المستندات المطلوبة:**\n${docsList.map(doc => `• ${doc.trim()}`).join('\n')}\n\n`;
                } else {
                    response += `**المستندات المطلوبة:**\n• ${serviceDocs}\n\n`;
                }
            }
            
            if (serviceDuration) {
                response += `**مدة إنجاز الخدمة:**\n• ${serviceDuration}\n\n`;
            }
            
            if (serviceGroup) {
                response += `**المجموعة:**\n• ${serviceGroup}`;
            }
        } else {
            // English version with the same structured format
            response += `**${serviceName}**\n\n`;
            
            if (serviceDesc) {
                response += `**Description:**\n• ${serviceDesc}\n\n`;
            }
            
            if (serviceFees) {
                response += `**Fees:**\n• ${serviceFees}\n\n`;
            }
            
            if (serviceReqs) {
                const reqsList = serviceReqs.split(/،|,/).filter(item => item.trim());
                if (reqsList.length > 1) {
                    response += `**Requirements:**\n${reqsList.map(req => `• ${req.trim()}`).join('\n')}\n\n`;
                } else {
                    response += `**Requirements:**\n• ${serviceReqs}\n\n`;
                }
            }
            
            if (serviceProcedures) {
                const procList = serviceProcedures.split(/،|,|\.|\./).filter(item => item.trim());
                if (procList.length > 1) {
                    response += `**How to Apply:**\n${procList.map(proc => `• ${proc.trim()}`).join('\n')}\n\n`;
                } else {
                    response += `**How to Apply:**\n• ${serviceProcedures}\n\n`;
                }
            }
            
            if (serviceDocs) {
                const docsList = serviceDocs.split(/،|,/).filter(item => item.trim());
                if (docsList.length > 1) {
                    response += `**Required Documents:**\n${docsList.map(doc => `• ${doc.trim()}`).join('\n')}\n\n`;
                } else {
                    response += `**Required Documents:**\n• ${serviceDocs}\n\n`;
                }
            }
            
            if (serviceDuration) {
                response += `**Processing Time:**\n• ${serviceDuration}\n\n`;
            }
            
            if (serviceGroup) {
                response += `**Group:**\n• ${serviceGroup}`;
            }
        }
        
        console.log('[Chatbot] Generated response:', response.substring(0, 100) + '...');
        
        return response.trim();
    }

    /**
     * Get fallback response
     */
    getFallbackResponse(language) {
        // Default fallback responses if knowledge base doesn't have them
        const defaultFallback = {
            arabic: 'عذراً، لم أفهم استفسارك. يمكنك إعادة صياغة السؤال أو الاستفسار عن خدمات الدفاع المدني.',
            english: 'Sorry, I could not understand your question. Please rephrase or ask about our Civil Defense services.'
        };
        
        // Try to get fallback from knowledge base, otherwise use default
        if (this.knowledgeBase && this.knowledgeBase.fallback) {
            const kbFallback = this.knowledgeBase.fallback;
            return kbFallback[language] || kbFallback.english || defaultFallback[language] || defaultFallback.english;
        }
        
        return defaultFallback[language] || defaultFallback.english;
    }

    /**
     * Generate a formatted list of all services grouped by category
     */
    generateAllServicesResponse(language) {
        console.log('[Chatbot] Generating all services list response');
        
        // Check if knowledge base is loaded
        if (!this.knowledgeBase) {
            return language === 'arabic' ? 
                'عذراً، لا توجد خدمات متاحة حالياً.' : 
                'Sorry, there are no services available at the moment.';
        }
        
        // Get all service groups (المجموعة الأولى, المجموعة الثانية, etc.)
        const serviceGroups = Object.keys(this.knowledgeBase).filter(key => key.startsWith('المجموعة'));
        
        if (serviceGroups.length === 0) {
            return language === 'arabic' ? 
                'عذراً، لا توجد خدمات متاحة حالياً.' : 
                'Sorry, there are no services available at the moment.';
        }
        
        // Format the response
        let response = '';
        let totalServices = 0;
        
        if (language === 'arabic') {
            response += '**الخدمات المتاحة:**\n\n';
            
            // Process each service group
            serviceGroups.forEach(group => {
                const groupServices = this.knowledgeBase[group];
                if (Array.isArray(groupServices) && groupServices.length > 0) {
                    response += `**${group}:**\n`;
                    
                    groupServices.forEach(service => {
                        response += `• ${service['اسم الخدمة']}\n`;
                        totalServices++;
                    });
                    
                    response += '\n';
                }
            });
            
            response += `إجمالي الخدمات المتاحة: ${totalServices} خدمة\n`;
        
        } else {
            response += '**Available Services:**\n\n';
            
            // Process each service group
            serviceGroups.forEach(group => {
                const groupServices = this.knowledgeBase[group];
                if (Array.isArray(groupServices) && groupServices.length > 0) {
                    response += `**${group}:**\n`;
                    
                    groupServices.forEach(service => {
                        response += `• ${service['اسم الخدمة']}\n`;
                        totalServices++;
                    });
                    
                    response += '\n';
                }
            });
            
            response += `Total available services: ${totalServices}\n`;
            response += 'For more information about a specific service, please mention the service name.';
        }
        
        return response;
    }

    /**
     * Check if user is asking for all services
     */
    isAskingForAllServices(userMessage) {
        if (!userMessage) return false;
        
        const allServicesKeywords = {
            arabic: [
                'الخدمات المتاحة', 'جميع الخدمات', 'كل الخدمات', 'قائمة الخدمات', 
                'ما هي الخدمات', 'اعرض الخدمات', 'اظهر الخدمات', 'عرض الخدمات',
                'ايش الخدمات', 'شنو الخدمات', 'وش الخدمات', 'شو الخدمات المتوفرة',
                'خدمات الدفاع المدني', 'خدماتكم'
            ],
            english: [
                'available services', 'all services', 'list of services', 'service list',
                'what services', 'show services', 'display services', 'services available',
                'civil defense services', 'your services'
            ]
        };
        
        const normalizedMessage = userMessage.toLowerCase().trim();
        const language = this.detectLanguage(normalizedMessage);
        
        return allServicesKeywords[language].some(keyword => 
            normalizedMessage.includes(keyword.toLowerCase())
        );
    }

    /**
     * Add a message to the conversation memory
     * @param {string} sessionId - Session identifier
     * @param {object} interaction - The interaction object containing user message and bot response
     */
    addToMemory(sessionId, interaction) {
        if (!sessionId) return;
        
        if (!this.conversationMemory.has(sessionId)) {
            this.conversationMemory.set(sessionId, []);
        }
        
        const memory = this.conversationMemory.get(sessionId);
        memory.push({
            timestamp: new Date().toISOString(),
            userMessage: interaction.userMessage,
            botResponse: interaction.botResponse,
            serviceId: interaction.serviceId || null
        });
        
        // Keep only the last N interactions
        if (memory.length > this.memoryLimit) {
            this.conversationMemory.set(
                sessionId, 
                memory.slice(memory.length - this.memoryLimit)
            );
        }
    }
    
    /**
     * Get conversation memory for a session
     * @param {string} sessionId - Session identifier
     * @returns {Array} - Array of conversation memory objects
     */
    getMemory(sessionId) {
        if (!sessionId || !this.conversationMemory.has(sessionId)) {
            return [];
        }
        return this.conversationMemory.get(sessionId);
    }
    
    /**
     * Get the last interaction from memory
     * @param {string} sessionId - Session identifier
     * @returns {object|null} - Last interaction or null if no memory
     */
    getLastInteraction(sessionId) {
        const memory = this.getMemory(sessionId);
        if (memory.length === 0) return null;
        return memory[memory.length - 1];
    }
    
    /**
     * Check if user has asked about a specific service recently
     * @param {string} sessionId - Session identifier
     * @returns {string|null} - Service ID if found, null otherwise
     */
    getRecentServiceContext(sessionId) {
        const memory = this.getMemory(sessionId);
        // Look through recent interactions for service context
        for (let i = memory.length - 1; i >= 0; i--) {
            if (memory[i].serviceId) {
                return memory[i].serviceId;
            }
        }
        return null;
    }
    
    /**
     * Check if the current query might be a follow-up question
     * @param {string} userMessage - The user's message
     * @param {string} sessionId - Session identifier
     * @returns {boolean} - True if likely a follow-up question
     */
    isLikelyFollowUp(userMessage, sessionId) {
        // Common follow-up patterns
        const followUpPatterns = {
            arabic: [
                /^ما هي/i, /^كم/i, /^متى/i, /^أين/i, /^كيف/i, /^لماذا/i, 
                /^هل/i, /^ما/i, /^من/i, /^ماذا/i, /^وماذا/i, /^و /i
            ],
            english: [
                /^what/i, /^how/i, /^when/i, /^where/i, /^why/i, 
                /^who/i, /^which/i, /^can/i, /^do/i, /^is/i, /^are/i, 
                /^and /i, /^but /i
            ]
        };
        
        const lastInteraction = this.getLastInteraction(sessionId);
        if (!lastInteraction) return false;
        
        const language = this.detectLanguage(userMessage);
        const patterns = language === 'arabic' ? followUpPatterns.arabic : followUpPatterns.english;
        
        // Check if message starts with a follow-up pattern
        for (const pattern of patterns) {
            if (pattern.test(userMessage)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Process user message and generate response
     */
    processMessage(userMessage, sessionId = null) {
        try {
            // Enhanced debug logging
            console.log(`[Chatbot] Processing message:`, userMessage);
            
            if (!userMessage || typeof userMessage !== 'string') {
                console.log(`[Chatbot] Invalid message format`);
                return {
                    success: false,
                    message: 'Invalid message format',
                    response: 'Please provide a valid message.'
                };
            }

            const trimmedMessage = userMessage.trim();
            if (!trimmedMessage) {
                console.log(`[Chatbot] Empty message`);
                return {
                    success: false,
                    message: 'Empty message',
                    response: 'Please provide a message to get assistance.'
                };
            }
            
            // Log UTF-8 codes to check Arabic characters
            const charCodes = trimmedMessage.split('').map(c => c.charCodeAt(0));
            console.log(`[Chatbot] Message character codes:`, charCodes);

            const language = this.detectLanguage(trimmedMessage);
            console.log(`[Chatbot] Detected language: ${language}`);
            
            // Check if it's a greeting
            if (this.isGreeting(trimmedMessage)) {
                const response = this.getGreetingResponse(language);
                
                // Store in memory
                if (sessionId) {
                    this.addToMemory(sessionId, {
                        userMessage: trimmedMessage,
                        botResponse: response
                    });
                }
                
                return {
                    success: true,
                    message: 'Greeting detected',
                    response: response,
                    language: language
                };
            }

            // Check if user is asking for all services
            if (this.isAskingForAllServices(trimmedMessage)) {
                console.log(`[Chatbot] User is asking for all services`);
                console.log(`[Chatbot] Generating all services list response`);
                
                const response = this.generateAllServicesResponse(language);
                
                // Store in memory
                if (sessionId) {
                    this.addToMemory(sessionId, {
                        userMessage: trimmedMessage,
                        botResponse: response
                    });
                }
                
                return {
                    success: true,
                    response: response,
                    language: language
                };
            }

            // Check if this is a follow-up question about a previous service
            let contextServiceId = null;
            if (sessionId && this.isLikelyFollowUp(trimmedMessage, sessionId)) {
                contextServiceId = this.getRecentServiceContext(sessionId);
                console.log(`[Chatbot] Detected possible follow-up question with context: ${contextServiceId}`);
            }
            
            // If we have context from a previous service, use it
            if (contextServiceId) {
                const serviceDetails = this.getServiceById(contextServiceId);
                if (serviceDetails) {
                    console.log(`[Chatbot] Using context from previous service: ${contextServiceId}`);
                    const response = this.generateServiceResponse(contextServiceId, serviceDetails, language);
                    
                    // Store in memory
                    if (sessionId) {
                        this.addToMemory(sessionId, {
                            userMessage: trimmedMessage,
                            botResponse: response,
                            serviceId: contextServiceId
                        });
                    }
                    
                    return {
                        success: true,
                        confidence: 10, // Lower confidence for context-based responses
                        serviceId: contextServiceId,
                        response: response,
                        language: language
                    };
                }
            }

            // Find the best matching service
            const bestMatch = this.findBestService(trimmedMessage);
            
            if (bestMatch) {
                const { serviceId, service, score, matchedCategory } = bestMatch;
                console.log(`[Chatbot] Generating service response:`, bestMatch, language);
                
                const response = this.generateServiceResponse(serviceId, service, language);
                
                // Store in memory
                if (sessionId) {
                    this.addToMemory(sessionId, {
                        userMessage: trimmedMessage,
                        botResponse: response,
                        serviceId: serviceId
                    });
                }
                
                return {
                    success: true,
                    confidence: score,
                    serviceId: serviceId,
                    response: response,
                    language: language
                };
            }

            // No service found, generate fallback response
            const fallbackResponse = this.getFallbackResponse(language);
            
            // Store in memory
            if (sessionId) {
                this.addToMemory(sessionId, {
                    userMessage: trimmedMessage,
                    botResponse: fallbackResponse
                });
            }
            
            return {
                success: true,
                confidence: 0,
                response: fallbackResponse,
                language: language
            };
        } catch (error) {
            console.error('Error processing message:', error);
            return {
                success: false,
                message: 'Error processing message',
                response: 'Sorry, there was an error processing your message. Please try again.',
                error: error.message
            };
        }
    }

    /**
     * Get structured fallback response with service categories
     */
    getStructuredFallbackResponse(userMessage, language) {
        if (language === 'arabic') {
            return `عذراً، لم أجد خدمة محددة تطابق استفسارك. 

يمكنني مساعدتك في الخدمات التالية:

🔹 **التراخيص:**
• ترخيص معدات الحريق والسلامة
• ترخيص المخابز
• ترخيص محطات الوقود
• ترخيص محلات بيع الغاز

🔹 **الشهادات:**
• شهادات فحص المنشآت
• شهادات السلامة
• شهادات التفتيش

🔹 **التقارير:**
• تقارير الحوادث
• تقارير بلاغات متأخرة

🔹 **الترجمة:**
• ترجمة الشهادات والتراخيص والتقارير

يرجى تحديد الخدمة المطلوبة بشكل أكثر تفصيلاً.`;
        } else {
            return `Sorry, I couldn't find a specific service matching your inquiry.

I can help you with the following services:

🔹 **Licenses:**
• Fire and safety equipment licenses
• Bakery licenses
• Fuel station licenses
• Gas shop licenses

🔹 **Certificates:**
• Facility inspection certificates
• Safety certificates
• Inspection certificates

🔹 **Reports:**
• Accident reports
• Late notification reports

🔹 **Translation:**
• Translation of certificates, licenses, and reports

Please specify the service you need in more detail.`;
        }
    }

    /**
     * Add or update a service in the knowledge base
     */
    addService(serviceId, serviceData) {
        if (!serviceId || !serviceData) {
            throw new Error('Service ID and data are required');
        }

        // Extract keywords from Arabic text
        const keywords = this.extractKeywordsFromArabicText(
            (serviceData.name || '') + ' ' + (serviceData.description || '')
        );

        this.knowledgeBase.services[serviceId] = {
            name: serviceData.name || '',
            description: serviceData.description || '',
            fees: serviceData.fees || '',
            requirements: serviceData.requirements || '',
            procedures: serviceData.procedures || '',
            documents: serviceData.documents || '',
            duration: serviceData.duration || '',
            keywords: keywords,
            specificTerms: serviceData.specificTerms || [],
            group: serviceData.group || 'المجموعة العامة'
        };

        this.saveKnowledgeBase();
        return true;
    }

    /**
     * Remove a service from the knowledge base
     */
    removeService(serviceId) {
        if (!serviceId) {
            throw new Error('Service ID is required');
        }

        if (this.knowledgeBase.services[serviceId]) {
            delete this.knowledgeBase.services[serviceId];
            this.saveKnowledgeBase();
            return true;
        }

        return false;
    }

    /**
     * Get all services from knowledge base
     */
    getAllServices() {
        if (!this.knowledgeBase) {
            return {};
        }
        
        const allServices = {};
        
        // Get all service groups (المجموعة الأولى, المجموعة الثانية, etc.)
        const serviceGroups = Object.keys(this.knowledgeBase).filter(key => key.startsWith('المجموعة'));
        
        // Process each service group
        serviceGroups.forEach(group => {
            const groupServices = this.knowledgeBase[group];
            if (Array.isArray(groupServices)) {
                groupServices.forEach((service, index) => {
                    const serviceId = `${group}_${index + 1}`;
                    allServices[serviceId] = {
                        name: service['اسم الخدمة'] || '',
                        description: service['وصف الخدمة'] || '',
                        fees: service['رسوم الخدمة'] || '',
                        requirements: service['شروط الخدمة'] || '',
                        procedures: service['كيفية التقديم'] || '',
                        documents: service['المستندات المطلوبة'] || '',
                        duration: service['مدة إنجاز الخدمة'] || '',
                        group: group
                    };
                });
            }
        });
        
        return allServices;
    }

    /**
     * Get a specific service by ID
     */
    getService(serviceId) {
        return this.knowledgeBase.services[serviceId] || null;
    }

    /**
     * Get a specific service by ID from the group structure
     * @param {string} serviceId - Service ID in format "groupName_index"
     * @returns {Object|null} - Service object or null if not found
     */
    getServiceById(serviceId) {
        if (!serviceId || !this.knowledgeBase) {
            return null;
        }
        
        try {
            // Parse the service ID to get group and index
            const [groupName, serviceIndex] = serviceId.split('_');
            
            // Check if the group exists and has the service at the specified index
            if (this.knowledgeBase[groupName] && 
                this.knowledgeBase[groupName][parseInt(serviceIndex) - 1]) {
                
                const service = this.knowledgeBase[groupName][parseInt(serviceIndex) - 1];
                return {
                    serviceId: serviceId,
                    service: {
                        name: service['اسم الخدمة'] || '',
                        description: service['وصف الخدمة'] || '',
                        fees: service['رسوم الخدمة'] || '',
                        requirements: service['شروط الخدمة'] || '',
                        procedures: service['كيفية التقديم'] || '',
                        documents: service['المستندات المطلوبة'] || '',
                        duration: service['مدة إنجاز الخدمة'] || '',
                        group: groupName
                    },
                    score: 10,
                    matchedCategory: 'direct_lookup'
                };
            }
        } catch (error) {
            console.error(`[Chatbot] Error getting service by ID ${serviceId}:`, error);
        }
        
        return null;
    }

    /**
     * Get knowledge base statistics
     */
    getStats() {
        const services = this.knowledgeBase.services || {};
        return {
            totalServices: Object.keys(services).length,
            totalKeywords: Object.values(services).reduce((sum, service) => 
                sum + (service.keywords ? service.keywords.length : 0), 0
            ),
            languages: ['arabic', 'english'],
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Export knowledge base
     */
    exportKnowledgeBase() {
        return JSON.stringify(this.knowledgeBase, null, 2);
    }

    /**
     * Import knowledge base
     */
    importKnowledgeBase(data) {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            this.knowledgeBase = parsed;
            this.saveKnowledgeBase();
            return true;
        } catch (error) {
            console.error('Error importing knowledge base:', error);
            return false;
        }
    }
}

module.exports = CivilDefenseChatbot; 