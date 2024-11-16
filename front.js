function openForm() {
    document.getElementById("popup-form").style.display = "block";
}
  
function closeForm() {
    document.getElementById("popup-form").style.display = "none";
}
// Toggle Chatbot visibility
function toggleChatbot() {
    const chatbotContainer = document.getElementById("chatbot-container");
    chatbotContainer.classList.toggle("hidden");
}

// Handle user input when Enter is pressed
function handleUserInput(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Send user message to chatbot
function sendMessage() {
    const userMessage = document.getElementById("userMessage").value;
    if (!userMessage) return;

    // Display user message
    displayMessage(userMessage, "user");

    // Clear input field
    document.getElementById("userMessage").value = "";

    // Simulate chatbot response
    setTimeout(() => {
        const botResponse = getBotResponse(userMessage);
        displayMessage(botResponse, "bot");
    }, 500);
}

// Display message in the chatbot window
function displayMessage(message, sender) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageContainer.textContent = message;

    document.getElementById("chatbot-messages").appendChild(messageContainer);
    messageContainer.scrollIntoView({ behavior: "smooth" });
}

// Generate chatbot response (basic example)
/*function getBotResponse(userMessage) {
    // Simple logic for chatbot responses (replace with AI logic if available)
    if (userMessage.toLowerCase().includes("hello")) {
        return "Hello! How can I assist you today with your finances?";
    } else if (userMessage.toLowerCase().includes("help")) {
        return "Sure! I can help you with budgeting, tracking expenses, or general finance tips.";
    } else {
        return "I'm here to assist you! Please let me know your query.";
    }
}*/
function getBotResponse(userMessage) {
    // Normalize user input
    const message = userMessage.toLowerCase().trim();

    // Response categories
    const responses = {
        greetings: [
            "Hello! How can I assist you today with your finances?",
            "Hi there! Need help managing your expenses or planning a budget?",
            "Hey! I'm here to make finances simpler for you."
        ],
        help: [
            "Sure! Here are a few things I can assist with:\n- Budget planning\n- Expense tracking\n- Investment advice\nJust type your query to get started!",
            "I can guide you on saving tips, expense monitoring, and more. What do you need help with?",
            "Tell me what you need, and I'll do my best to assist you."
        ],
        budget: [
            "Budgeting is key to financial success! Start by categorizing your expenses and setting limits for each category.",
            "Need help creating a budget? Let me guide you step-by-step.",
            "A solid budget can help you save more. Would you like a template or tips to start?"
        ],
        expenses: [
            "Tracking expenses is crucial. You can use our FIND Tracker to log your transactions easily.",
            "Keep an eye on your daily spending habits. Want me to help you analyze your expenses?",
            "Would you like tips on cutting unnecessary expenses?"
        ],
        fallback: [
            "I'm here to assist you! Can you clarify your query?",
            "I'm not sure I understood. Could you provide more details?",
            "Let me try again. Please rephrase or specify your request."
        ]
    };

    // Keywords and patterns for responses
    const keywords = {
        greetings: ["hello", "hi", "hey", "good morning", "good afternoon"],
        help: ["help", "assist", "support"],
        budget: ["budget", "budgeting", "plan finances", "money plan"],
        expenses: ["expense", "spending", "expenses", "track", "tracking"]
    };

    // Match user message to keywords
    for (const category in keywords) {
        if (keywords[category].some(keyword => message.includes(keyword))) {
            return getRandomResponse(responses[category]);
        }
    }

    // Default response if no match is found
    return getRandomResponse(responses.fallback);
}

// Helper function to pick a random response
function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}
