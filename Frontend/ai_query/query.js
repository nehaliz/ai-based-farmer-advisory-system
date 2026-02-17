const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const imageInput = document.getElementById("imageInput");

function appendMessage(sender, text, isLoader = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    if (sender === "ai") {
        const avatar = document.createElement("img");
        avatar.src = "../assets/avatar.png";
        avatar.classList.add("avatar");
        messageDiv.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    if (isLoader) {
        bubble.classList.add("thinking");
        bubble.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messageDiv.id = "ai-thinking"; 
    } else {
        bubble.innerHTML = text.replace(/\n/g, "<br>");
    }

    messageDiv.appendChild(bubble);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
}
async function sendMessage(file = null) {
    const question = userInput.value.trim();
    const userId = localStorage.getItem("farmer_user_id") || 1; 

    if (!question && !file) return;

    if (file) {
        appendMessage("user", "📸 <i>Sent a leaf image for analysis...</i>");
    } else {
        appendMessage("user", question);
    }

    userInput.value = "";
    appendMessage("ai", "", true); 

    const formData = new FormData();
    formData.append("user_id", userId);
    if (question) formData.append("query", question);
    if (file) formData.append("file", file);

    try {
        const response = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            body: formData
        });

        const loader = document.getElementById("ai-thinking");
        if (loader) loader.remove();

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();
        
        let finalOutput = data.response;
        if (data.detected) {
            finalOutput = `<strong>Diagnosis:</strong> ${data.detected}<br><br>${data.response}`;
        }
        
        appendMessage("ai", finalOutput);

    } catch (error) {
        console.error("Error:", error);
        const loader = document.getElementById("ai-thinking");
        if (loader) loader.remove();
        appendMessage("ai", "Sorry, I couldn't connect to the farming assistant. Please check your connection.");
    }
}

imageInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        sendMessage(e.target.files[0]);
    }
});

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});