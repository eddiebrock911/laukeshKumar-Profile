// ========== AI Chatbot for Laukesh Kumar ==========
class AIChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.createChatInterface();
  }
  
  createChatInterface() {
    const chatHTML = `
      <!-- Chat Toggle Button -->
      <button id="chat-toggle" class="chat-toggle" aria-label="Open Chat">
        <i class="fas fa-comments"></i>
        <span class="chat-badge">AI</span>
      </button>
      
      <!-- Chat Window -->
      <div id="chat-window" class="chat-window">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🤖</div>
            <div>
              <h4>Laukesh's Assistant</h4>
              <span class="chat-status">
                <span class="status-dot"></span> Online
              </span>
            </div>
          </div>
          <button id="chat-close" class="chat-close" aria-label="Close Chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div id="chat-messages" class="chat-messages"></div>
        
        <div class="chat-suggestions" id="chat-suggestions">
          <button class="suggestion-btn" data-message="Show me your photo edits">
            📸 Photo Edits
          </button>
          <button class="suggestion-btn" data-message="What are your editing prices?">
            ₹ Price List
          </button>
          <button class="suggestion-btn" data-message="Do you play BGMI?">
            🎮 Gaming (BGMI)
          </button>
          <button class="suggestion-btn" data-message="How can I contact you?">
            📞 Hire Me
          </button>
        </div>
        
        <div class="chat-input-container">
          <input 
            id="chat-input" 
            type="text" 
            placeholder="Ask anything about edits & gaming..." 
            autocomplete="off"
            maxlength="500"
          >
          <button id="chat-send" class="chat-send" aria-label="Send Message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <div class="chat-footer">
          <small>Laukesh's Assistant • Made with ❤️</small>
        </div>
      </div>
    `;
    
    const container = document.createElement('div');
    container.innerHTML = chatHTML;
    document.body.appendChild(container);
    
    this.attachEventListeners();
    this.addWelcomeMessage();
    this.loadChatHistory();
  }
  
  attachEventListeners() {
    const toggle = document.getElementById('chat-toggle');
    const close = document.getElementById('chat-close');
    const send = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const suggestions = document.querySelectorAll('.suggestion-btn');
    
    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.toggleChat());
    send.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.message;
        this.sendMessage();
      });
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggleChat();
      }
    });
  }
  
  toggleChat() {
    const window = document.getElementById('chat-window');
    const toggle = document.getElementById('chat-toggle');
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      window.classList.add('open');
      toggle.classList.add('active');
      document.getElementById('chat-input').focus();
    } else {
      window.classList.remove('open');
      toggle.classList.remove('active');
    }
  }
  
  addWelcomeMessage() {
    const welcomeMsg = `नमस्ते! 👋 मैं Laukesh का AI सहायक हूँ। मैं आपको उनके शानदार Photo Edits, BGMI gameplay highlights और editing rates के बारे में बता सकता हूँ। आप क्या जानना चाहेंगे?`;
    this.addMessage('bot', welcomeMsg);
  }
  
  sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Hide suggestions after first message
    document.getElementById('chat-suggestions').style.display = 'none';
    
    this.addMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate AI thinking time
    setTimeout(() => {
      this.removeTypingIndicator();
      const response = this.generateResponse(message);
      this.addMessage('bot', response);
      this.saveChatHistory();
    }, 700 + Math.random() * 800);
  }
  
  addMessage(type, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    const time = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (type === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="message-text">${this.formatMessage(text)}</div>
          <div class="message-time">${time}</div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <div class="message-text">${this.escapeHtml(text)}</div>
          <div class="message-time">${time}</div>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    // Store message
    this.messages.push({ type, text, time });
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot-message typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }
  
  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }
  
  generateResponse(message) {
    const msg = message.toLowerCase();
    
    // Photo Edits / Portfolio
    if (msg.includes('photo') || msg.includes('edit') || msg.includes('portfolio') || msg.includes('manipulation') || msg.includes('work') || msg.includes('design')) {
      return `Laukesh **Professional Photo Manipulations, Color Grading, Retouching और Gaming Thumbnails** बनाने में माहिर हैं!
      <br><br>
      📸 **Highlights:**
      <br>
      • **Cinematic Portraits:** High-end Retouching & Color Match
      <br>
      • **BGMI Thumbnails:** Dynamic action-shots with bold titles
      <br>
      • **Landscape Manipulation:** Complex composites that look hyper-realistic!
      <br><br>
      आप ऊपर **Portfolio** सेक्शन में इनका काम देख सकते हैं और interactive Before/After slider से तुलना कर सकते हैं!`;
    }
    
    // Prices / Pricing / Rates
    else if (msg.includes('price') || msg.includes('rate') || msg.includes('cost') || msg.includes('pricing') || msg.includes('charging') || msg.includes('charges') || msg.includes('charge')) {
      return `लौकेश के सर्विसेज की प्राइज लिस्ट इस प्रकार है (Transparent & Affordable rates):
      <br><br>
      🖼️ **Photo Edit — Basic (₹150 / image):**
      <br>
      • Color correction, crop, minor retouch. 24-48 hours delivery.
      <br><br>
      ✨ **Photo Edit — Pro (₹350 / image):**
      <br>
      • Advanced retouch, cinematic color grading, background change, source files. 12-24 hours delivery.
      <br><br>
      🎬 **Gameplay Edit (₹500 / clip):**
      <br>
      • Montage editing with transitions, sound mix, and 3D thumbnail. 2-3 days delivery.
      <br><br>
      *नोट: Bulk orders पर डिस्काउंट संभव है। बात करने के लिए **Contact section** में फॉर्म भरें या सीधे व्हाट्सएप करें!*`;
    }
    
    // Gaming / BGMI
    else if (msg.includes('game') || msg.includes('gaming') || msg.includes('bgmi') || msg.includes('pubg') || msg.includes('clutch') || msg.includes('snipe')) {
      return `लौकेश एक **Competitive BGMI Player & Content Creator** भी हैं! 🎮
      <br><br>
      🏆 **Gaming Highlights:**
      <br>
      • Competitive Tournaments played: **50+**
      <br>
      • Playstyle: **Assaulter / Sniper** (High reflex clutching)
      <br>
      • Gaming hours logged: **200+ hours**
      <br><br>
      इनके **Montages** और streams देखने के लिए Instagram (**@__next___ff**) या YouTube (**@ankitkumar-mf2my**) चेक करें!`;
    }
    
    // Contact / Reach / Hire / Email / WhatsApp
    else if (msg.includes('contact') || msg.includes('hire') || msg.includes('reach') || msg.includes('email') || msg.includes('whatsapp') || msg.includes('number') || msg.includes('social')) {
      return `आप Laukesh से इन माध्यमों से संपर्क कर सकते हैं:
      <br><br>
      💬 **WhatsApp:** [WhatsApp Directly](https://wa.me/919279934623?text=Hi%20Laukesh%20I%20want%20to%20hire%20you) (+91 9279934623)
      <br>
      📸 **Instagram:** [@__next___ff](https://www.instagram.com/__next___ff/)
      <br>
      📧 **Email:** aishukumari9508212254@gmail.com
      <br><br>
      आप **Contact Form** भरकर भी अपनी डिटेल्स भेज सकते हैं। 24 घंटे के अंदर आपको जवाब मिल जाएगा!`;
    }
    
    // Location / Where do you live
    else if (msg.includes('location') || msg.includes('live') || msg.includes('from') || msg.includes('bihar') || msg.includes('sheikhpura')) {
      return `Laukesh **Sheikhpura, Bihar (India)** 🇮🇳 के रहने वाले हैं। 
      <br><br>
      वे अपनी होमटाउन से ही पूरे भारत के क्रिएटर्स और गेमर्स के लिए रिमोटली (remotely) काम करते हैं!`;
    }
    
    // Education / School
    else if (msg.includes('education') || msg.includes('study') || msg.includes('school') || msg.includes('class') || msg.includes('college')) {
      return `लौकेश अभी **Class 12** के छात्र हैं, और पढ़ाई के साथ-साथ अपने एडिटिंग और गेमिंग पैशन को फॉलो कर रहे हैं! 📚🚀`;
    }
    
    // Developer Credit
    else if (msg.includes('developer') || msg.includes('build') || msg.includes('website') || msg.includes('creator') || msg.includes('code')) {
      return `यह वेबसाइट **Ankit Kumar** द्वारा विकसित (developed) की गई है! 💻
      <br>
      आप उनसे Instagram पर संपर्क कर सकते हैं: [@__ankit._.op_](https://www.instagram.com/__ankit._.op_/)`;
    }
    
    // Thanks / Appreciation
    else if (msg.includes('thank') || msg.includes('thanks') || msg.includes('shukriya') || msg.includes('nice') || msg.includes('cool') || msg.includes('awesome')) {
      return `आपका बहुत-बहुत धन्यवाद! 😊 मुझे खुशी हुई कि मैं आपकी मदद कर सका। अगर कुछ और पूछना है, तो बेझिझक पूछें!`;
    }
    
    // Greetings / Hi / Hello
    else if (msg.match(/^(hi|hello|hey|greetings|नमस्कार|हे|हैलो)/i)) {
      return `हेलो! 👋 Laukesh के AI सहायक में आपका स्वागत है। मैं आपकी क्या मदद कर सकता हूँ? 
      <br><br>
      आप पूछ सकते हैं:
      <br>• Photo Edits के सैंपल्स
      <br>• Editing Rates (प्राइज लिस्ट)
      <br>• Gaming & BGMI हाइलाइट्स
      <br>• Laukesh से संपर्क कैसे करें?`;
    }
    
    // Default
    else {
      return `मुझे इसके बारे में थोड़ी कम जानकारी है, पर मैं लगातार सीख रहा हूँ! 🤖 
      <br><br>
      आप ये जानने की कोशिश कर सकते हैं:
      <br>• **Photo Edits** (पोर्टफोलियो)
      <br>• **Pricing** (रेट कार्ड)
      <br>• **Gaming** (BGMI डिटेल्स)
      <br>• **Contact** (हायर करने के लिए)`;
    }
  }
  
  formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  saveChatHistory() {
    try {
      const history = this.messages.slice(-20); // Keep last 20 messages
      localStorage.setItem('laukeshChatHistory', JSON.stringify(history));
    } catch (e) {
      console.warn('Could not save chat history');
    }
  }
  
  loadChatHistory() {
    try {
      const history = localStorage.getItem('laukeshChatHistory');
      if (history) {
        const messages = JSON.parse(history);
        if (messages.length > 0) {
          document.getElementById('chat-messages').innerHTML = '';
          messages.forEach(msg => {
            this.addMessage(msg.type, msg.text);
          });
        }
      }
    } catch (e) {
      console.warn('Could not load chat history');
    }
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new AIChatbot();
  });
} else {
  window.chatbot = new AIChatbot();
}

// Add CSS styles inline to keep it self-contained and clean
const chatStyles = `
<style>
.chat-toggle {
  position: fixed;
  bottom: 10px;
  right: 20px; /* Shifted left to avoid overlapping Back to Top button */
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary, #7c5cff), var(--primary-2, #3cc8ff));
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4);
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: pulse-chat 2s infinite;
}

.chat-toggle:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 12px 30px rgba(124, 92, 255, 0.6);
}

.chat-toggle.active {
  background: linear-gradient(135deg, var(--accent, #ff7aa2), var(--primary, #7c5cff));
  transform: rotate(90deg);
}

.chat-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--accent, #ff7aa2);
  color: white;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 122, 162, 0.4);
}

@keyframes pulse-chat {
  0%, 100% { box-shadow: 0 8px 24px rgba(124, 92, 255, 0.4); }
  50% { box-shadow: 0 8px 32px rgba(124, 92, 255, 0.6); }
}

.chat-window {
  position: fixed;
  bottom: 86px;
  right: 20px;
  width: 480px;
  max-width: calc(100vw - 40px);
  height: 620px;
  max-height: calc(100vh - 120px);
  background: rgba(23, 25, 35, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-md, 16px);
  box-shadow: var(--shadow, 0 10px 30px rgba(0,0,0,0.35));
  z-index: 997;
  display: none;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

body[data-theme="light"] .chat-window {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.chat-window.open {
  display: flex;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chat-header {
  background: linear-gradient(135deg, var(--primary, #7c5cff), var(--primary-2, #3cc8ff));
  padding: 16px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.chat-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.chat-status {
  font-size: 11px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 1px;
}

.status-dot {
  width: 7px;
  height: 7px;
  background: var(--success, #3bd671);
  border-radius: 50%;
  animation: blink 2s infinite;
  box-shadow: 0 0 6px var(--success, #3bd671);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.chat-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s ease;
  display: grid;
  place-items: center;
  opacity: 0.8;
}

.chat-close:hover {
  transform: rotate(90deg);
  opacity: 1;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chat-message {
  display: flex;
  gap: 10px;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-message {
  justify-content: flex-end;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(124, 92, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid rgba(124, 92, 255, 0.2);
}

.message-content {
  max-width: 78%;
}

.message-text {
  padding: 10px 14px;
  border-radius: 14px;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 13.5px;
}

.bot-message .message-text {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text, #e6e9ef);
  border-bottom-left-radius: 4px;
  border: 1px solid rgba(255,255,255,0.03);
}

body[data-theme="light"] .bot-message .message-text {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text, #1a1d24);
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.user-message .message-text {
  background: linear-gradient(135deg, var(--primary, #7c5cff), var(--primary-2, #3cc8ff));
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(124, 92, 255, 0.2);
}

.message-time {
  font-size: 10px;
  color: var(--muted, #a5adba);
  margin-top: 4px;
  padding: 0 4px;
}

.user-message .message-time {
  text-align: right;
}

.typing-indicator .typing-dots {
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 14px;
  border-radius: 14px;
  border-bottom-left-radius: 4px;
  display: flex;
  gap: 5px;
  align-items: center;
}

body[data-theme="light"] .typing-indicator .typing-dots {
  background: rgba(0, 0, 0, 0.04);
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: var(--primary, #7c5cff);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

.chat-suggestions {
  padding: 10px 16px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-top: 1px solid var(--border, rgba(255,255,255,0.08));
}

.suggestion-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  border-radius: 20px;
  color: var(--text, #e6e9ef);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
}

body[data-theme="light"] .suggestion-btn {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--text, #1a1d24);
}

.suggestion-btn:hover {
  background: linear-gradient(135deg, var(--primary, #7c5cff), var(--primary-2, #3cc8ff));
  color: white;
  border-color: transparent;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 10px rgba(124, 92, 255, 0.25);
}

.chat-input-container {
  padding: 12px 16px;
  border-top: 1px solid var(--border, rgba(255,255,255,0.08));
  display: flex;
  gap: 10px;
  align-items: center;
}

#chat-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text, #e6e9ef);
  outline: none;
  font-size: 13px;
  transition: all 0.3s ease;
}

body[data-theme="light"] #chat-input {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--text, #1a1d24);
}

#chat-input:focus {
  border-color: var(--primary, #7c5cff);
  box-shadow: 0 0 0 3px rgba(124, 92, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

body[data-theme="light"] #chat-input:focus {
  background: white;
}

.chat-send {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--primary, #7c5cff), var(--primary-2, #3cc8ff));
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(124, 92, 255, 0.2);
}

.chat-send:hover {
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 6px 14px rgba(124, 92, 255, 0.35);
}

.chat-footer {
  padding: 8px;
  text-align: center;
  border-top: 1px solid var(--border, rgba(255,255,255,0.08));
  font-size: 10px;
  color: var(--muted, #a5adba);
  opacity: 0.8;
}

/* Custom scrollbar for chat window */
.chat-messages::-webkit-scrollbar {
  width: 5px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
}

body[data-theme="light"] .chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}

/* Links inside chat bubbles */
.message-text a {
  color: var(--primary-2, #3cc8ff);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px dashed var(--primary-2, #3cc8ff);
  transition: border-bottom-style 0.2s ease;
}

.message-text a:hover {
  border-bottom-style: solid;
}

.user-message .message-text a {
  color: white;
  border-bottom-color: white;
}

/* Responsiveness */
@media (max-width: 520px) {
  .chat-window {
    right: 12px;
    bottom: 74px;
    width: calc(100vw - 24px);
    height: calc(100vh - 90px);
    border-radius: 12px;
  }
  
  .chat-toggle {
    right: 70px;
    bottom: 14px;
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', chatStyles);