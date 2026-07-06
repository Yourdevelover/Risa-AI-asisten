async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();
    if (!message) return;

    // Remove empty state if present
    const emptyState = chatBox.querySelector('.msg-empty');
    if (emptyState) emptyState.remove();

    // Append user message
    const userMsg = document.createElement("div");
    userMsg.className = "msg msg-user";
    userMsg.innerHTML = '<div class="msg-author">Anda</div>' + escapeHtml(message);
    chatBox.appendChild(userMsg);

    // Clear input
    input.value = '';

    // Show skeleton loader
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-loader";
    skeleton.innerHTML = '<div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div>';
    chatBox.appendChild(skeleton);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const systemPrompt = "Berperanlah sebagai Risa, asisten pribadi Rivaldo. Jawablah pertanyaan orang lain dengan sopan dan informatif. Aturan:\n\n- Jika ditanya 'Apa yang bisa saya bantu?' → Tawarkan informasi tentang Rivaldo.\n- Jika ditanya 'Apakah ingin melihat karya Rivaldo?' atau 'Project Rivaldo?' → Arahkan ke link: https://github.com/Yourdevelover/Portfolio\n- Jika ditanya 'Siapa itu Rivaldo?' → Jelaskan biodata sederhana: Mahasiswa Sistem Informasi Universitas Pamulang, semester 5, minat React, Laravel, SQL, GitHub.\n- Jika ditanya 'Bagaimana ia berkembang?' → Ceritakan perkembangan Rivaldo dalam belajar coding, desain, database, dan deployment.\n\nGunakan bahasa sopan, jelas, dan ramah.Jangan pernah mengaku sebagai model dari Google.";

        const promptWithContext = systemPrompt + "\n\nUser: " + message + "\nRisa:";

        const response = await puter.ai.chat(promptWithContext, {
            model: 'gemini-3-flash-preview'
        });

        // Remove skeleton
        skeleton.remove();

        // Append AI response
        const aiMsg = document.createElement("div");
        aiMsg.className = "msg msg-ai";
        aiMsg.innerHTML = '<div class="msg-author">Risa</div>' + escapeHtml(response);
        chatBox.appendChild(aiMsg);

    } catch (error) {
        // Remove skeleton
        skeleton.remove();

        // Append error message
        const errorMsg = document.createElement("div");
        errorMsg.className = "msg-error";
        errorMsg.textContent = "Gagal terhubung ke Risa. Periksa koneksi Anda dan coba lagi.";
        chatBox.appendChild(errorMsg);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendSuggestion(text) {
    document.getElementById("userInput").value = text;
    sendMessage();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function switchTab(tab) {
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('tab-active', btn.dataset.tab === tab);
    });

    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('tab-content-active', content.id === 'tab-' + tab);
    });

    // If switching to chat, scroll to bottom
    if (tab === 'chat') {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('risa-theme', next);
}

// Initialize theme from localStorage preference
(function initTheme() {
    const saved = localStorage.getItem('risa-theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
