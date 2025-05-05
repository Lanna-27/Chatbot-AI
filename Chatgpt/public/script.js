const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const chatContainer = document.getElementById('chat-container');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  addMessage(userText, 'user');
  userInput.value = '';
  
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userText })
  });

  const data = await res.json();
  addMessage(data.reply, 'bot');
});

function addMessage(text, sender) {
  const message = document.createElement('div');
  message.classList.add('message', sender);
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}
