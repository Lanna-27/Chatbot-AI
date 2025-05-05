// public/script.js
document.getElementById('send-button').addEventListener('click', async () => {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;
  
    mostrarMensaje("Tú", message);
    input.value = "";
  
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message })
    });
  
    const data = await res.json();
    mostrarMensaje("Bot", data.reply);
  });
  
  function mostrarMensaje(who, text) {
    const messagesDiv = document.getElementById('messages');
    const div = document.createElement('div');
    div.textContent = `${who}: ${text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  