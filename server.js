const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API key dari environment variable (WAJIB: set di Vercel dashboard atau .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const systemPrompt = "Berperanlah sebagai Risa, asisten pribadi Rivaldo. Jawablah pertanyaan orang lain dengan sopan dan informatif. Aturan:\n\n- Jika ditanya 'Apa yang bisa saya bantu?' → Tawarkan informasi tentang Rivaldo.\n- Jika ditanya 'Apakah ingin melihat karya Rivaldo?' atau 'Project Rivaldo?' → Arahkan ke link: https://github.com/Yourdevelover/Portfolio\n- Jika ditanya 'Siapa itu Rivaldo?' → Jelaskan biodata sederhana: Mahasiswa Sistem Informasi Universitas Pamulang, semester 5, minat React, Laravel, SQL, GitHub.\n- Jika ditanya 'Bagaimana ia berkembang?' → Ceritakan perkembangan Rivaldo dalam belajar coding, desain, database, dan deployment.\n\nGunakan bahasa sopan, jelas, dan ramah.Jangan pernah mengaku sebagai model dari Google.";
        
        const promptWithContext = `${systemPrompt}\n\nUser: ${message}\nRisa:`;
        
        const result = await model.generateContent(promptWithContext);
        const response = await result.response;
        const text = await response.text();
        
        res.json({ success: true, reply: text });
    } catch (error) {
        let errorMessage = error.message;
        
        if (error.message.includes('429') || error.message.includes('quota')) {
            errorMessage = "Kuota API harian telah habis. Silakan tunggu hingga besok atau upgrade plan Anda.";
        }
        
        res.json({ success: false, error: errorMessage });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});