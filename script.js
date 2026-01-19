async function askAI() {
    const query = document.getElementById("query").value.trim();
    const responseBox = document.getElementById("response-box");
    const responseText = document.getElementById("response");

    if (!query) {
        alert("Please enter a question");
        return;
    }

    responseBox.classList.remove("hidden");
    responseText.innerText = "⏳ Processing your question...";

    try {
        const res = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        const data = await res.json();
        responseText.innerText = data.response;

    } catch (error) {
        responseText.innerText = "Unable to connect to the AI server.";
    }
}