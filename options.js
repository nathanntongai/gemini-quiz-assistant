// Load the saved key when the page opens
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["geminiApiKey"], (result) => {
        if (result.geminiApiKey) {
            document.getElementById("apiKey").value = result.geminiApiKey;
        }
    });
});

// Save the key when the button is clicked
document.getElementById("saveBtn").addEventListener("click", () => {
    const key = document.getElementById("apiKey").value.trim();
    const status = document.getElementById("status");
    
    // INPUT VALIDATION: Check if it looks like a real Google API key
    if (!key.startsWith("AIza") || key.length < 35) {
        status.style.color = "#dc3545"; 
        status.innerText = "❌ Invalid format. Gemini API keys start with 'AIza' and are longer.";
        status.style.display = "block";
        setTimeout(() => { status.style.display = "none"; }, 4000);
        return; 
    }
    
    // If it passes the test, save it securely!
    chrome.storage.local.set({ geminiApiKey: key }, () => {
        status.style.color = "#28a745"; 
        status.innerText = "✅ API Key Saved Securely!";
        status.style.display = "block";
        setTimeout(() => { status.style.display = "none"; }, 3000);
    });
});

// 🚨 NEW: The "Safe Wipe" Memory Logic
document.getElementById("clearMemoryBtn").addEventListener("click", () => {
    
    // 1. Grab the API key first so we don't accidentally delete it!
    chrome.storage.local.get(["geminiApiKey"], (result) => {
        const savedKey = result.geminiApiKey;
        
        // 2. Wipe the ENTIRE hard drive for this extension
        chrome.storage.local.clear(() => {
            
            // 3. Put the API key safely back into the clean database!
            if (savedKey) {
                chrome.storage.local.set({ geminiApiKey: savedKey });
            }
            
            // 4. Show a success message to the user
            const memStatus = document.getElementById("memoryStatus");
            memStatus.innerText = "✅ AI Memory Wiped Successfully!";
            memStatus.style.display = "block";
            
            setTimeout(() => { memStatus.style.display = "none"; }, 3000);
        });
    });
});