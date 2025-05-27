const socket = io("http://localhost:8000");
const messageInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-button");
const form = document.getElementById("chat-form");
const messagescontainer = document.getElementById("chat-messages");
const leftMessage = document.querySelector(".leftMessage");
const rightMessage = document.querySelector(".rightMessage");
const notificationMessage = document.querySelector(".notificationMessage");


function appendNotificationMessage(message) {
  const notificationElement = document.createElement("div");
  notificationElement.classList.add(
    "message",
    "notificationMessage"
  );
  notificationElement.innerText = message;
  messagescontainer.appendChild(notificationElement);
  messagescontainer.scrollTop = messagescontainer.scrollHeight; // auto-scroll
}
// Send user join event
const name = prompt("Enter your name:");
socket.emit("new-user-join", name);

// Listen for other users joining
socket.on("user-join", (name) => {
  console.log("🔔 Received user-join:", name);
  appendNotificationMessage(`${name} has joined the chat`);
});

// Listen for incoming messages
socket.on("receive_message", (data) => {
  console.log("📥 Received message:", data);
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "leftMessage");
  messageElement.innerHTML = `<strong>${data.name}:</strong> ${data.data}`;
  messagescontainer.appendChild(messageElement);
  messagescontainer.scrollTop = messagescontainer.scrollHeight; // auto-scroll
});
// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    console.log("📤 Sending message:", message);
    socket.emit("send_message", message);
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "rightMessage");
    messageElement.innerHTML = `<strong>You:</strong> ${message}`;
    messagescontainer.appendChild(messageElement);
    messagescontainer.scrollTop = messagescontainer.scrollHeight; // auto-scroll
    messageInput.value = ""; // Clear input field
  }
});
socket.on("connect", () => {
  console.log("✅ Connected to socket.io server");
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection failed:", err.message);
});