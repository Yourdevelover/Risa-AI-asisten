const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY || process.argv[2];
if (!API_KEY) {
    console.error("ERROR: GEMINI_API_KEY belum di-set.");
    console.error("Gunakan: GEMINI_API_KEY=yourkey node check-models.js");
    console.error("Atau:    node check-models.js yourkey");
    process.exit(1);
}

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        try {
            const result = JSON.parse(data);
            console.log("\n=== Model yang Tersedia ===\n");
            
            if (result.models) {
                result.models.forEach(model => {
                    if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
                        console.log(`Model: ${model.name.replace('models/', '')}`);
                        console.log(`  Display Name: ${model.displayName}`);
                        console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
                        console.log('');
                    }
                });
            }
        } catch (error) {
            console.error("Error parsing response:", error);
            console.log("Raw response:", data);
        }
    });
}).on('error', (error) => {
    console.error("Error fetching models:", error.message);
});
