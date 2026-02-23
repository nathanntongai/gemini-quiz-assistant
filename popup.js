let quizSearchTimer;

document.getElementById("runBtn").addEventListener("click", () => {
    document.getElementById("status").style.display = "block";
    document.getElementById("status").innerText = "🔍 Searching for quiz...";
    document.getElementById("runBtn").disabled = true;
    document.getElementById("runBtn").innerText = "Working...";

    quizSearchTimer = setTimeout(() => {
        document.getElementById("status").innerText = "❌ No quiz found on page.";
        document.getElementById("runBtn").disabled = false;
        document.getElementById("runBtn").innerText = "Solve Quiz";
    }, 2000);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            files: ["content.js"]
        }).catch(() => {});
    });
});

document.getElementById("clearBtn").addEventListener("click", () => {
    document.getElementById("status").style.display = "none";
    document.getElementById("runBtn").disabled = false;
    document.getElementById("runBtn").innerText = "Solve Quiz";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            func: () => {
                const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                inputs.forEach(input => {
                    input.checked = false;
                    const container = input.closest('label') || input.parentElement;
                    if (container) {
                        // Clear the stealth styles
                        container.style.backgroundColor = "";
                        container.style.outline = ""; 
                        container.style.borderRadius = "";
                    }
                });
            }
        }).catch(() => {});
    });
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.type === "QUIZ_FOUND" || request.type === "AI_FINISHED") {
        clearTimeout(quizSearchTimer);
    }

    if (request.type === "QUIZ_FOUND") {
        document.getElementById("status").innerText = "🤖 AI is thinking...";
    } 
    else if (request.type === "AI_FINISHED") {
        if (request.status === "success") {
            document.getElementById("status").innerText = "✅ Answer Selected!";
        } else if (request.status === "no_match") {
            document.getElementById("status").innerText = "⚠️ AI guessed: " + request.aiText;
        } else {
            document.getElementById("status").innerText = "❌ " + request.answer;
        }
        document.getElementById("runBtn").disabled = false;
        document.getElementById("runBtn").innerText = "Done";
    }
});