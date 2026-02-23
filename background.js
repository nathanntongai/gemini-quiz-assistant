chrome.commands.onCommand.addListener((command) => {
    if (command === "solve_quiz") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id, allFrames: true },
                    files: ["content.js"]
                }).catch(() => {});
            }
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "ASK_GEMINI") {
        
        chrome.storage.local.get(["geminiApiKey"], (settings) => {
            const apiKey = settings.geminiApiKey;
            
            // 🚨 THE ONBOARDING REDIRECT: If there's no key, open Settings automatically!
            if (!apiKey) {
                chrome.runtime.openOptionsPage(); 
                sendResponse({ answer: "API Key missing! Opening Settings page..." });
                return;
            }

            const memoryKey = request.memoryKey;

            chrome.storage.local.get([memoryKey], (result) => {
                if (result[memoryKey]) {
                    sendResponse({ answer: result[memoryKey] });
                    return; 
                }

                fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: request.prompt }] }]
                    })
                })
                .then(async response => {
                    const data = await response.json();
                    if (data.error) throw new Error(data.error.message);
                    return data;
                })
                .then(data => {
                    if (data.candidates && data.candidates.length > 0) {
                        const answer = data.candidates[0].content.parts[0].text;
                        chrome.storage.local.set({ [memoryKey]: answer });
                        sendResponse({ answer: answer });
                    } else {
                        sendResponse({ answer: "API Error: No answer returned by AI." });
                    }
                })
                .catch(error => {
                    // Check if the error is specifically about an INVALID key, and redirect them!
                    if (error.message.includes("API key not valid")) {
                        chrome.runtime.openOptionsPage();
                        sendResponse({ answer: "Invalid API Key! Opening Settings..." });
                    } else {
                        sendResponse({ answer: "API Error: " + error.message });
                    }
                });
            });
        });

        return true; 
    }
});