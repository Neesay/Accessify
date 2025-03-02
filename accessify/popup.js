document.addEventListener("DOMContentLoaded", () => {
    const dyslexiaLevelSelect = document.getElementById("dyslexiaLevel");
    const colorBlindSelect = document.getElementById("colorBlindToggle");
    const speakButton = document.getElementById("speakButton");
    const stopButton = document.getElementById("stopButton");
    const speedSlider = document.getElementById("speedSlider");

    // Load stored settings when popup opens
    chrome.storage.sync.get(["dyslexiaLevel", "colorBlindMode"], (data) => {
        dyslexiaLevelSelect.value = data.dyslexiaLevel || "none";
        colorBlindSelect.value = data.colorBlindMode || "none";
    });

    // Change Dyslexia Mode based on selection
    dyslexiaLevelSelect.addEventListener("change", (event) => {
        const level = event.target.value;
        chrome.storage.sync.set({ dyslexiaLevel: level });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "changeDyslexiaLevel",
                    level: level,
                });
            }
        });
    });

    // Change Color Blind Mode
    colorBlindSelect.addEventListener("change", (event) => {
        const selectedMode = event.target.value;
        chrome.storage.sync.set({ colorBlindMode: selectedMode });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "toggleColorBlindMode",
                    type: selectedMode,
                });
            }
        });
    });

    // Read Selected Text with Adjustable Speed
    speakButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: () => window.getSelection().toString()
                }, (result) => {
                    const selectedText = result[0]?.result.trim();
                    if (selectedText) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "speakText",
                            text: selectedText,
                            speed: parseFloat(speedSlider.value),
                        });
                    } else {
                        alert("Please select some text first!");
                    }
                });
            }
        });
    });

    // Stop Reading
    stopButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "stopSpeech"
                });
            }
        });
    });

    // Adjust speed dynamically while reading
    speedSlider.addEventListener("input", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "changeSpeechSpeed",
                    speed: parseFloat(speedSlider.value),
                });
            }
        });
    });
});
