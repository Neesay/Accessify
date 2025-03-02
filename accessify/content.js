// Apply stored settings when the page loads
chrome.storage.sync.get(["dyslexiaLevel", "colorBlindMode"], (data) => {
    applyDyslexiaMode(data.dyslexiaLevel || "none");
    applyColorBlindFilter(data.colorBlindMode || "none");
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "changeDyslexiaLevel") {
        chrome.storage.sync.set({ dyslexiaLevel: message.level });
        applyDyslexiaMode(message.level);
    }

    if (message.action === "toggleColorBlindMode") {
        chrome.storage.sync.set({ colorBlindMode: message.type });
        applyColorBlindFilter(message.type);
    }

    if (message.action === "speakText") {
        startSpeech(message.text, message.speed);
    }

    if (message.action === "stopSpeech") {
        stopSpeech();
    }

    if (message.action === "changeSpeechSpeed") {
        updateSpeechSpeed(message.speed);
    }
});

// 🟢 Function to apply Dyslexia Mode
function applyDyslexiaMode(level) {
    const styles = {
        mild: {
            fontSize: "18px",
            letterSpacing: "0.08em",
            lineHeight: "1.5",
            backgroundColor: "#FDF7E3"
        },
        moderate: {
            fontSize: "22px",
            letterSpacing: "0.12em",
            lineHeight: "1.6",
            backgroundColor: "#FAF8E4"
        },
        strong: {
            fontSize: "26px",
            letterSpacing: "0.15em",
            lineHeight: "1.8",
            backgroundColor: "#FFF8D6"
        },
        none: {
            fontSize: "",
            letterSpacing: "",
            lineHeight: "",
            backgroundColor: ""
        }
    };

    let selectedStyle = styles[level];

    document.body.style.fontSize = selectedStyle.fontSize;
    document.body.style.letterSpacing = selectedStyle.letterSpacing;
    document.body.style.lineHeight = selectedStyle.lineHeight;
    document.body.style.backgroundColor = selectedStyle.backgroundColor;
}

// 🟢 Function to apply Color Blind Mode
function applyColorBlindFilter(type) {
    document.documentElement.style.filter = ""; // Reset first

    const filters = {
        protanopia: "grayscale(30%) sepia(100%) hue-rotate(-20deg)",
        deuteranopia: "grayscale(30%) sepia(100%) hue-rotate(20deg)",
        tritanopia: "grayscale(30%) sepia(100%) hue-rotate(90deg)",
        "high-contrast": "contrast(1.5)",
        none: ""
    };

    document.documentElement.style.filter = filters[type] || "";
}

// 🟢 Function to start Text-to-Speech
let speech = new SpeechSynthesisUtterance();
let isSpeaking = false;

function startSpeech(text, speed) {
    if (isSpeaking) stopSpeech(); // Stop any existing speech before starting a new one

    speech.text = text;
    speech.rate = speed || 1; // Default speed is 1x
    speechSynthesis.speak(speech);
    isSpeaking = true;
}

// 🟢 Function to stop Text-to-Speech
function stopSpeech() {
    speechSynthesis.cancel();
    isSpeaking = false;
}

// 🟢 Function to dynamically update speed while reading
function updateSpeechSpeed(speed) {
    if (isSpeaking) {
        speechSynthesis.cancel(); // Stop current speech
        speech.rate = speed; // Update speed
        speechSynthesis.speak(speech); // Restart with new speed
    }
}


