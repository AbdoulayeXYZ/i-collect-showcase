/**
 * i-CHATBOT - Assistant virtuel de l'écosystème i
 * Intégration pour i-collect-showcase
 */

class iChatbot {
    constructor() {
        this.apiUrl = 'https://i-chatbot-4nw3qqq5u-abdoulaye-niasses-projects.vercel.app/api/chat-rag'; // URL de l'API i-chatbot avec RAG
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <!-- Bouton flottant -->
                <button class="chatbot-button" id="chatbotToggle">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                    </svg>
                    <span class="chatbot-badge">1</span>
                </button>

                <!-- Fenêtre de chat -->
                <div class="chatbot-window" id="chatbotWindow">
                    <!-- Header -->
                    <div class="chatbot-header">
                    <div class="chatbot-header-left">
                            <div class="chatbot-avatar">
                                <img src="images/logoecosystem i.png" alt="i-chatbot" />
                            </div>
                            <div class="chatbot-info">
                                <h3>i-chatbot</h3>
                                <div class="chatbot-status">
                                    <span class="status-dot"></span>
                                    En ligne
                                </div>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbotClose">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- Messages dynamiques -->
                    </div>

                    <!-- Suggestions rapides -->
                    <div class="quick-suggestions" id="quickSuggestions">
                        <div class="suggestion-chip" data-message="Qu'est-ce que i-collect ?">
                            Qu'est-ce que i-collect ?
                        </div>
                        <div class="suggestion-chip" data-message="Comment participer ?">
                            Comment participer ?
                        </div>
                        <div class="suggestion-chip" data-message="Quels sont les avantages ?">
                            Les avantages
                        </div>
                    </div>

                    <!-- Input -->
                    <div class="chatbot-input-container">
                        <input 
                            type="text" 
                            class="chatbot-input" 
                            id="chatbotInput"
                            placeholder="Posez votre question..."
                            autocomplete="off"
                        />
                        <button class="chatbot-send" id="chatbotSend">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbotToggle');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        const suggestions = document.querySelectorAll('.suggestion-chip');

        toggleBtn.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                const message = chip.getAttribute('data-message');
                input.value = message;
                this.sendMessage();
            });
        });
    }

    toggle() {
        const window = document.getElementById('chatbotWindow');
        const badge = document.querySelector('.chatbot-badge');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            window.classList.add('open');
            if (badge) badge.style.display = 'none';
        } else {
            window.classList.remove('open');
        }
    }

    close() {
        const window = document.getElementById('chatbotWindow');
        window.classList.remove('open');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeText = "Bonjour ! Je suis l'assistant virtuel de l'écosystème i. Je peux répondre à vos questions sur i-collect, i-ticket et tous nos services. Comment puis-je vous aider aujourd'hui ?";
        
        this.addMessage('bot', welcomeText);
    }

    // Formater le markdown simple
    formatMarkdown(text) {
        // Gras **texte**
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Listes avec tirets
        text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        
        // Listes numérotées
        text = text.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
        
        // Paragraphes (double saut de ligne)
        text = text.split('\n\n').map(para => {
            // Ne pas wrapper les listes
            if (para.trim().startsWith('<ul>') || para.trim().startsWith('<li>')) {
                return para;
            }
            return para.trim() ? `<p>${para.trim()}</p>` : '';
        }).join('');
        
        // Sauts de ligne simples en <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    addMessage(type, text, time = null) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageTime = time || this.getTime();
        
        const avatarHTML = type === 'bot' 
            ? '<img src="images/logoecosystem i.png" alt="i-chatbot" />'
            : '👤';
        
        // Formater le texte si c'est un message du bot
        const formattedText = type === 'bot' ? this.formatMarkdown(text) : text;
        
        const messageHTML = `
            <div class="message ${type}">
                <div class="message-avatar">${avatarHTML}</div>
                <div class="message-content">
                    <div class="message-bubble">${formattedText}</div>
                    <div class="message-time">${messageTime}</div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
        
        this.messages.push({ type, text, time: messageTime });
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingHTML = `
            <div class="message bot" id="typingIndicator">
                <div class="message-avatar">
                    <img src="images/logoecosystem i.png" alt="i-chatbot" />
                </div>
                <div class="message-content">
                    <div class="typing-indicator active">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
        this.isTyping = true;
    }

    hideTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
        this.isTyping = false;
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Ajouter le message de l'utilisateur
        this.addMessage('user', message);
        input.value = '';
        
        // Désactiver le bouton d'envoi
        sendBtn.disabled = true;

        // Afficher l'indicateur de frappe
        this.showTyping();

        try {
            // Appeler l'API i-chatbot
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    userId: this.getUserId()
                })
            });

            const data = await response.json();
            
            // Cacher l'indicateur de frappe
            this.hideTyping();

            // Ajouter la réponse du bot
            if (data.success && data.response) {
                this.addMessage('bot', data.response);
            } else {
                this.addMessage('bot', "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?");
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            this.hideTyping();
            this.addMessage('bot', "Désolé, une erreur s'est produite. Veuillez réessayer dans quelques instants.");
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getTime() {
        const now = new Date();
        return now.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getUserId() {
        // Générer ou récupérer un ID utilisateur unique
        let userId = localStorage.getItem('i-chatbot-user-id');
        if (!userId) {
            userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('i-chatbot-user-id', userId);
        }
        return userId;
    }
}

// Initialiser le chatbot quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.iChatbot = new iChatbot();
    });
} else {
    window.iChatbot = new iChatbot();
}
