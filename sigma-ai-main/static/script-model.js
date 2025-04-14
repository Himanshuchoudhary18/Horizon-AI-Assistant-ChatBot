document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");
    const messagesDiv = document.getElementById("messages");
    const inputField = document.getElementById("question");

    // Function to display messages
    function displayMessage(text, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageDiv.innerText = text;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
    }

    // Function to send message
    async function sendMessage() {
        let question = inputField.value.trim();
        if (!question) return;

        displayMessage(question, "user");
        inputField.value = ""; // 🔥 Clear input field after sending the message

        let response = await fetch("/get_answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: question }),
        });

        let data = await response.json();
        displayMessage(data.answer, "bot");
    }

    // Send button click event
    sendBtn.addEventListener("click", sendMessage);

    // Enable Enter key to send message
    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent new line
            sendMessage();
        }
    });

    // Speech-to-Text
    micBtn.addEventListener("click", function () {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();

        // 🔥 Change mic button color when active
        micBtn.style.backgroundColor = "#00ffff";  // Glowing Cyan

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript;
            inputField.value = transcript;
        };

        recognition.onend = function () {
            // 🔥 Reset mic button color after use
            micBtn.style.backgroundColor = "";
        };
    });
});
