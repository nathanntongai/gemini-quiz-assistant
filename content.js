(function() {
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (allInputs.length === 0) return; 

    const visiblePageText = document.body.innerText;
    let options = [];
    let validInputs = [];

    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;

    allInputs.forEach(input => {
        const container = input.closest('label') || input.parentElement;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const isOnScreen = (rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.left < screenWidth && rect.top >= 0 && rect.top < screenHeight);
        
        let isTrulyVisible = false;
        if (container.checkVisibility) {
            isTrulyVisible = container.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
        } else {
            const style = window.getComputedStyle(container);
            isTrulyVisible = (style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none');
        }
        
        let optionText = container.innerText.trim();
        
        if (isOnScreen && isTrulyVisible && optionText && visiblePageText.includes(optionText)) {
            options.push(optionText);
            validInputs.push({ input: input, container: container, text: optionText });
        }
    });

    if (options.length === 0) return;

    chrome.runtime.sendMessage({ type: "QUIZ_FOUND" });

    const safePageText = visiblePageText.replace(/[0-9]/g, '').substring(0, 100).trim();
    const stableMemoryKey = safePageText + " | " + options.join(" | ");

    const prompt = `You are answering a multiple choice question. 
    Read the webpage text below. Identify the question and the correct option(s).
    IMPORTANT RULES:
    1. Return ONLY the exact text of the correct option(s) from the list provided.
    2. Do not add quotes, markdown, or say "The answer is".
    3. If there are MULTIPLE correct options, put EACH exact option text on a NEW LINE.
    
    Webpage Text: ${visiblePageText}
    
    Options to choose from: ${options.join(" | ")}`;

    chrome.runtime.sendMessage({ type: "ASK_GEMINI", prompt: prompt, memoryKey: stableMemoryKey }, (response) => {
        if (response && response.answer) {
            let found = false;
            
            const aiAnswers = response.answer.toLowerCase().split('\n').map(a => a.replace(/\*/g, '').trim()).filter(a => a.length > 2);

            validInputs.forEach(item => {
                const optionText = item.text.toLowerCase();
                
                const isMatch = aiAnswers.some(aiAns => optionText.includes(aiAns) || aiAns.includes(optionText));
                
                if (isMatch) {
                    item.container.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
                    item.container.style.boxShadow = "0 0 0 3px #28a745";
                    item.container.style.borderRadius = "5px";
                    
                    // 🚨 THE SMART CLICKER FIX: Only click if it's not already checked!
                    if (!item.input.checked) {
                        // Click the visual label like a real human
                        item.container.click();
                        
                        // Fallback: If the label click didn't work, force the input directly
                        if (!item.input.checked) {
                            item.input.click();
                            // Force React/Angular to notice the change
                            item.input.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                    
                    found = true;
                }
            });

            if (found) {
                chrome.runtime.sendMessage({ type: "AI_FINISHED", status: "success" });
            } else {
                chrome.runtime.sendMessage({ type: "AI_FINISHED", status: "no_match", aiText: response.answer });
            }
        } else {
            chrome.runtime.sendMessage({ type: "AI_FINISHED", status: "error", answer: response?.answer || "Unknown error" });
        }
    });
})();