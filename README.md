# 🧠 Gemini Quiz Assistant

An advanced, AI-powered Chrome Extension that seamlessly identifies and answers multiple-choice questions on educational platforms. Powered by Google's Gemini AI, this tool features smart DOM manipulation, viewport filtering, and intelligent memory caching.

## ✨ Key Features

* **🤖 AI Integration:** Connects directly to the Google Gemini API (Gemini 2.5 Flash) to accurately analyze webpage context and solve questions.
* **🥷 Stealth DOM Injection:** Uses non-destructive styling (`outline` instead of physical resizing) and simulated direct-input clicks to bypass layout crashes on modern React/Angular websites.
* **🧠 Smart Memory Caching:** Saves previously answered questions to your local browser storage. If you encounter the same question again, it answers instantly and saves your API free-tier quota.
* **👁️ Viewport & Ghost Filtering:** Mathematically checks screen boundaries and CSS opacity to ignore hidden "carousel" questions and transparent elements.
* **🖱️ Smart Clicker:** Intelligently handles both Radio Buttons (single answer) and Checkboxes (multiple answers) without triggering double-click bugs.
* **🔒 Secure Settings Dashboard:** A built-in Options page that safely encrypts your personal API key into Chrome's Local Storage, keeping it out of the source code.
* **⚡ Keyboard Shortcuts:** Instantly trigger the AI without opening the menu using `Alt + S` (Customizable).

---

## 🚀 How to Install (For Chrome & Edge)

Since this is a custom developer tool, you will need to install it manually:

1. Click the green **Code** button at the top of this repository and select **Download ZIP**.
2. **Extract/Unzip** the downloaded folder somewhere safe on your computer.
3. Open your browser and go to your extensions page:
   * **Chrome:** `chrome://extensions/`
   * **Edge:** `edge://extensions/`
4. Turn on **Developer mode** (a toggle switch usually in the top right or bottom left corner).
5. Click the **Load unpacked** button.
6. Select the extracted `gemini-quiz-assistant` folder. The extension is now installed!

---

## ⚙️ Setup & Usage

**1. Add your API Key**
* Right-click the new extension icon in your browser toolbar and select **Options**.
* Follow the on-screen guide to generate a free API key from Google AI Studio.
* Paste your key and click **Save**.

**2. Solve a Quiz**
* Navigate to your quiz webpage.
* Press the keyboard shortcut (`Alt + S` on Windows / `Option + S` on Mac), OR click the extension icon and click **Solve Quiz**.
* The AI will highlight and select the correct answer(s) automatically.

**3. Advanced Tools**
* If the website updates a question or the AI makes a mistake, open the **Options** page and click **Wipe AI Memory** to force the AI to think from scratch.

---

## ⚠️ Disclaimer
*This extension was built as a personal programming challenge to learn JavaScript, API integrations, and Chrome Extension development. It is intended strictly for educational and accessibility purposes.*
