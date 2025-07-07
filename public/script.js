// Chat Application Class
class ChatApp {
    constructor() {
        this.isLoading = false;
        this.isRTL = false;
        this.sessionId = this.getOrCreateSessionId();
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.detectLanguage();
            this.autoResizeTextarea();
            this.toggleSendButton();
            this.addWelcomeMessage();
        });
    }

    getOrCreateSessionId() {
        // Try to get existing session ID from localStorage
        let sessionId = localStorage.getItem('civilDefenseChatSessionId');
        
        // If no session ID exists, create a new one
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
            localStorage.setItem('civilDefenseChatSessionId', sessionId);
        }
        
        return sessionId;
    }

    setupEventListeners() {
        // Send message when the send button is clicked
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Get message input element
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            // Send message when Enter key is pressed (without Shift)
            messageInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    this.sendMessage();
                }
            });

            // Update character count and resize textarea as user types
            messageInput.addEventListener('input', () => {
                this.updateCharCount(messageInput);
                this.toggleSendButton();
                this.autoResizeTextarea();
            });
        }
        
        // Clear chat history when clear button is clicked
        const clearChatBtn = document.getElementById('clearChatBtn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من رغبتك في مسح سجل المحادثة؟\nAre you sure you want to clear the chat history?')) {
                    this.clearChatHistory();
                }
            });
        }
    }

    setupAdminEventListeners() {
        // Export/Import knowledge base
        const exportKB = document.getElementById('exportKB');
        const importKB = document.getElementById('importKB');
        const kbFileInput = document.getElementById('kbFileInput');

        if (exportKB) {
            exportKB.addEventListener('click', () => this.exportKnowledgeBase());
        }

        if (importKB) {
            importKB.addEventListener('click', () => kbFileInput.click());
        }

        if (kbFileInput) {
            kbFileInput.addEventListener('change', (e) => this.importKnowledgeBase(e));
        }

        // Admin navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showAdminSection(section);
            });
        });

        // Add service modal
        const addServiceBtn = document.getElementById('addServiceBtn');
        const addServiceModal = document.getElementById('addServiceModal');
        const closeAddService = document.getElementById('closeAddService');
        const cancelAddService = document.getElementById('cancelAddService');
        const addServiceForm = document.getElementById('addServiceForm');

        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', () => this.showAddServiceModal());
        }

        if (closeAddService) {
            closeAddService.addEventListener('click', () => this.closeAddServiceModal());
        }

        if (cancelAddService) {
            cancelAddService.addEventListener('click', () => this.closeAddServiceModal());
        }

        if (addServiceForm) {
            addServiceForm.addEventListener('submit', (e) => this.handleAddService(e));
        }

        // Settings
        const saveSettings = document.getElementById('saveSettings');
        const resetSettings = document.getElementById('resetSettings');
        const confidenceThreshold = document.getElementById('confidenceThreshold');
        const confidenceValue = document.getElementById('confidenceValue');

        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveSettings());
        }

        if (resetSettings) {
            resetSettings.addEventListener('click', () => this.resetSettings());
        }

        if (confidenceThreshold && confidenceValue) {
            confidenceThreshold.addEventListener('input', (e) => {
                confidenceValue.textContent = e.target.value + '%';
            });
        }
    }

    setWelcomeTime() {
        const welcomeTime = document.getElementById('welcomeTime');
        if (welcomeTime) {
            welcomeTime.textContent = this.formatTime(new Date());
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    updateCharCount(textarea) {
        const charCount = document.getElementById('charCount');
        if (charCount && textarea) {
            const count = textarea.value.length;
            charCount.textContent = `${count}/500`;
            
            if (count > 450) {
                charCount.style.color = '#dc3545';
            } else if (count > 400) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = '#6c757d';
            }
        }
    }

    toggleSendButton() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        
        if (messageInput && sendButton) {
            const hasText = messageInput.value.trim().length > 0;
            sendButton.disabled = !hasText || this.isLoading;
        }
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        if (!messageInput || this.isLoading) return;

        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        messageInput.value = '';
        this.updateCharCount(messageInput);
        this.toggleSendButton();
        this.autoResizeTextarea();

        // Show loading indicator
        this.showLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update session ID if the server generated a new one
                if (data.sessionId && data.sessionId !== this.sessionId) {
                    this.sessionId = data.sessionId;
                    localStorage.setItem('civilDefenseChatSessionId', this.sessionId);
                }
                
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage('عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.', 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'bot');
        } finally {
            this.showLoading(false);
        }
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const icon = document.createElement('i');
        icon.className = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        avatar.appendChild(icon);

        const content = document.createElement('div');
        content.className = 'message-content';

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        if (sender === 'bot') {
            // Process markdown formatting for bot messages
            const formattedText = this.formatServiceContent(text);
            messageText.innerHTML = formattedText;
        } else {
            // Regular text for user messages
            messageText.textContent = text;
        }

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(new Date());

        content.appendChild(messageText);
        content.appendChild(messageTime);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatServiceContent(text) {
        if (!text) return '';
        
        // Process service content with better formatting
        let formattedText = text;
        
        // Check if this is the list of all services
        const isServiceList = formattedText.includes('**الخدمات المتاحة:**') || formattedText.includes('**Available Services:**');
        
        // Check if this is a single service detail view (has service title but not the services list title)
        const isSingleService = !isServiceList && 
            (formattedText.match(/^\*\*(.*?)\*\*/m) && 
            !formattedText.includes('**الخدمات المتاحة:**') && 
            !formattedText.includes('**Available Services:**'));
        
        // Handle service title (first bold text)
        formattedText = formattedText.replace(/^\*\*(.*?)\*\*/m, (match, content) => {
            if (isSingleService) {
                // Add a back button when viewing a single service
                const backButtonArabic = '<button class="back-to-services" onclick="chatApp.showAllServices()"><i class="fas fa-arrow-right"></i> العودة إلى قائمة الخدمات</button>';
                const backButtonEnglish = '<button class="back-to-services" onclick="chatApp.showAllServices()"><i class="fas fa-arrow-left"></i> Back to Services List</button>';
                const backButton = this.currentLanguage === 'arabic' ? backButtonArabic : backButtonEnglish;
                return `<div class="service-header">${backButton}<div class="service-title">${content}</div></div>`;
            } else {
                return `<div class="service-title">${content}</div>`;
            }
        });
        
        // Handle field headers (bold text followed by colon)
        formattedText = formattedText.replace(/\*\*(.*?):\*\*/g, (match, content) => {
            return `<div class="service-field-name">${content}:</div>`;
        });
        
        // Handle bullet points for lists - make service names clickable if this is the service list
        if (isServiceList) {
            formattedText = formattedText.replace(/^• (.*?)$/gm, (match, content) => {
                return `<li class="service-list-item"><span class="clickable-service" onclick="chatApp.askAboutService('${content.replace(/'/g, "\\'")}')">${content}</span></li>`;
            });
        } else {
            formattedText = formattedText.replace(/^• (.*?)$/gm, (match, content) => {
                return `<li class="service-list-item">${content}</li>`;
            });
        }
        
        // Convert newlines to proper HTML
        // First replace double newlines (paragraph breaks)
        formattedText = formattedText.replace(/\n\n/g, '</div><div class="service-field-value">');
        
        // Then handle single newlines within content (mainly for list items)
        formattedText = formattedText.replace(/\n(?!<\/div>)/g, '');
        
        // Wrap lists in ul elements
        formattedText = formattedText.replace(/<li class="service-list-item">/g, '<ul class="service-list"><li class="service-list-item">');
        formattedText = formattedText.replace(/<\/li>(?!<li)/g, '</li></ul>');
        
        // Wrap everything in a service-content container
        formattedText = `<div class="service-content"><div class="service-field-value">${formattedText}</div></div>`;
        
        return formattedText;
    }
    
    // Method to handle clicking on a service name
    askAboutService(serviceName) {
        console.log(`Asking about service: ${serviceName}`);
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = serviceName;
            this.sendMessage();
        }
    }
    
    // Method to show all services
    showAllServices() {
        console.log('Showing all services');
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = this.currentLanguage === 'arabic' ? 'الخدمات المتاحة' : 'available services';
            this.sendMessage();
        }
    }

    showLoading(show) {
        this.isLoading = show;
        const loadingIndicator = document.getElementById('loadingIndicator');
        const sendButton = document.getElementById('sendButton');
        
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
        
        this.toggleSendButton();
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'arabic' ? 'english' : 'arabic';
        
        const languageToggle = document.getElementById('languageToggle');
        const body = document.body;
        
        if (languageToggle) {
            const span = languageToggle.querySelector('span');
            if (span) {
                span.textContent = this.currentLanguage === 'arabic' ? 'English' : 'العربية';
            }
        }
        
        if (body) {
            if (this.currentLanguage === 'english') {
                body.classList.add('language-english');
            } else {
                body.classList.remove('language-english');
            }
        }
    }

    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            // Keep only the welcome message
            const welcomeMessage = chatMessages.querySelector('.bot-message');
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
        }
        
        this.sessionId = this.generateSessionId();
    }

    handleQuickAction(action) {
        const actions = {
            services: 'ما هي الخدمات المتاحة في الدفاع المدني؟',
            licenses: 'كيف أحصل على ترخيص من الدفاع المدني؟',
            safety: 'ما هي متطلبات السلامة المطلوبة؟',
            contact: 'كيف يمكنني التواصل مع الدفاع المدني؟'
        };

        const message = actions[action];
        if (message) {
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.value = message;
                this.sendMessage();
            }
        }
    }

    toggleAdminModal() {
        const adminModal = document.getElementById('adminModal');
        if (adminModal) {
            adminModal.classList.add('active');
            this.loadSystemStats();
        }
    }

    closeAdminModal() {
        const adminModal = document.getElementById('adminModal');
        if (adminModal) {
            adminModal.classList.remove('active');
        }
    }

    showAdminSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));

        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    async loadSystemStats() {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();

            if (data.success) {
                this.updateStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    updateStats(stats) {
        const elements = {
            totalConversations: stats.totalConversations || 0,
            totalServices: stats.totalServices || 0,
            systemStatus: stats.systemStatus || 'مستقر'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'services':
                this.loadServices();
                break;
            case 'conversations':
                this.loadConversations();
                break;
            case 'knowledge':
                this.loadKnowledgeStats();
                break;
        }
    }

    async loadServices() {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();

            if (data.success) {
                this.displayServices(data.services);
            }
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    displayServices(services) {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) return;

        servicesGrid.innerHTML = '';

        Object.entries(services).forEach(([id, service]) => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.innerHTML = `
                <div class="service-header">
                    <div>
                        <div class="service-name">${service.name || 'خدمة بدون اسم'}</div>
                    </div>
                    <div class="service-actions">
                        <button class="service-action-btn" onclick="chatApp.editService('${id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="service-action-btn" onclick="chatApp.deleteService('${id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="service-description">${service.description || 'لا يوجد وصف'}</div>
                <div class="service-keywords">
                    ${(service.keywords || []).map(keyword => 
                        `<span class="keyword-tag">${keyword}</span>`
                    ).join('')}
                </div>
            `;
            servicesGrid.appendChild(serviceCard);
        });
    }

    async loadConversations() {
        try {
            const response = await fetch('/api/conversations-log');
            const data = await response.json();

            if (data.success) {
                this.displayConversations(data.conversations);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }

    displayConversations(conversations) {
        const conversationsList = document.getElementById('conversationsList');
        if (!conversationsList) return;

        conversationsList.innerHTML = '<p>لا توجد محادثات مسجلة</p>';
    }

    async loadKnowledgeStats() {
        try {
            const response = await fetch('/api/kb-stats');
            const data = await response.json();

            if (data.success) {
                this.updateKnowledgeStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading knowledge stats:', error);
        }
    }

    updateKnowledgeStats(stats) {
        const elements = {
            kbTotalServices: stats.totalServices || 0,
            kbTotalKeywords: stats.totalKeywords || 0,
            kbLastUpdate: stats.lastUpdated || '-'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    showAddServiceModal() {
        const modal = document.getElementById('addServiceModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeAddServiceModal() {
        const modal = document.getElementById('addServiceModal');
        if (modal) {
            modal.classList.remove('active');
            // Reset form
            const form = document.getElementById('addServiceForm');
            if (form) {
                form.reset();
            }
        }
    }

    async handleAddService(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const serviceData = {
            name: formData.get('serviceName') || document.getElementById('serviceName')?.value,
            description: formData.get('serviceDescription') || document.getElementById('serviceDescription')?.value,
            keywords: (formData.get('serviceKeywords') || document.getElementById('serviceKeywords')?.value).split(',').map(k => k.trim()),
            requirements: (formData.get('serviceRequirements') || document.getElementById('serviceRequirements')?.value).split('\n').filter(r => r.trim()),
            procedures: (formData.get('serviceProcedures') || document.getElementById('serviceProcedures')?.value).split('\n').filter(p => p.trim()),
            fees: formData.get('serviceFees') || document.getElementById('serviceFees')?.value,
            contact: formData.get('serviceContact') || document.getElementById('serviceContact')?.value
        };

        try {
            const response = await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData)
            });

            const data = await response.json();

            if (data.success) {
                this.closeAddServiceModal();
                this.loadServices();
                alert('تم إضافة الخدمة بنجاح');
            } else {
                alert('حدث خطأ في إضافة الخدمة');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert('حدث خطأ في الاتصال');
        }
    }

    async exportKnowledgeBase() {
        try {
            const response = await fetch('/api/export-kb');
            const data = await response.json();

            if (data.success) {
                const blob = new Blob([JSON.stringify(data.knowledgeBase, null, 2)], {
                    type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'knowledge_base.json';
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error exporting knowledge base:', error);
            alert('حدث خطأ في تصدير قاعدة المعرفة');
        }
    }

    async importKnowledgeBase(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const knowledgeBase = JSON.parse(text);

            const response = await fetch('/api/import-kb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ knowledgeBase })
            });

            const data = await response.json();

            if (data.success) {
                alert('تم استيراد قاعدة المعرفة بنجاح');
                this.loadKnowledgeStats();
            } else {
                alert('حدث خطأ في استيراد قاعدة المعرفة');
            }
        } catch (error) {
            console.error('Error importing knowledge base:', error);
            alert('حدث خطأ في قراءة الملف');
        }

        // Reset file input
        event.target.value = '';
    }

    async saveSettings() {
        const settings = {
            autoBackup: document.getElementById('autoBackup')?.checked || false,
            maxConversations: document.getElementById('maxConversations')?.value || 1000,
            sessionTimeout: document.getElementById('sessionTimeout')?.value || 30,
            defaultLanguage: document.getElementById('defaultLanguage')?.value || 'arabic',
            confidenceThreshold: document.getElementById('confidenceThreshold')?.value || 50
        };

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            const data = await response.json();

            if (data.success) {
                alert('تم حفظ الإعدادات بنجاح');
            } else {
                alert('حدث خطأ في حفظ الإعدادات');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('حدث خطأ في الاتصال');
        }
    }

    resetSettings() {
        if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات؟')) {
            // Reset form values to defaults
            const elements = {
                autoBackup: false,
                maxConversations: 1000,
                sessionTimeout: 30,
                defaultLanguage: 'arabic',
                confidenceThreshold: 50
            };

            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                }
            });

            // Update confidence display
            const confidenceValue = document.getElementById('confidenceValue');
            if (confidenceValue) {
                confidenceValue.textContent = '50%';
            }
        }
    }

    async editService(serviceId) {
        // Implementation for editing service
        console.log('Edit service:', serviceId);
    }

    async deleteService(serviceId) {
        if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            try {
                const response = await fetch(`/api/services/${serviceId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    this.loadServices();
                    alert('تم حذف الخدمة بنجاح');
                } else {
                    alert('حدث خطأ في حذف الخدمة');
                }
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('حدث خطأ في الاتصال');
            }
        }
    }

    // Add a new method to clear the chat history and session
    clearChatHistory() {
        // Clear the chat messages from the UI
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        // Generate a new session ID
        this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
        localStorage.setItem('civilDefenseChatSessionId', this.sessionId);
        
        // Add welcome message
        this.addWelcomeMessage();
    }

    // Add a welcome message method
    addWelcomeMessage() {
        const welcomeMessage = this.isRTL ? 
            'مرحباً بك في نظام الدفاع المدني. كيف يمكنني مساعدتك اليوم؟' : 
            'Welcome to the Civil Defense system. How can I help you today?';
        
        this.addMessage(welcomeMessage, 'bot');
    }
}

// Initialize the chat app
const chatApp = new ChatApp(); 