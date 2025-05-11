import { getChatbotResponse } from 'backend/chatbot.jsw';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import { local } from 'wix-storage';

let sessionId;

$w.onReady(() => {
  sessionId = local.getItem("chatSessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    local.setItem("chatSessionId", sessionId);
  }

  // Cargar mensajes al iniciar
  loadMessages(sessionId);

  // Enviar mensaje
  $w('#sendButton').onClick(async () => {
    const userId = wixUsers.currentUser.id;
    const prompt = $w('#userInput').value.trim();
    if (!prompt) return;

    await addMessage(prompt, 'user', userId, sessionId);
    $w('#userInput').value = '';

    try {
      const reply = await getChatbotResponse(prompt);
      await addMessage(reply, 'bot', userId, sessionId);
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      await addMessage("Ocurrió un error al conectar con el servidor.", 'bot', userId, sessionId);
    }
  });

  // Renderizado de cada mensaje en el Repeater
  $w('#chatRepeater').onItemReady(($item, itemData) => {
    $item('#messageText').text = itemData.text;

    if (itemData.sender === 'user') {
      $item('#messageBox').style.backgroundColor = '#d4f8d4';
    } else {
      $item('#messageBox').style.backgroundColor = '#f1f1f1';
    }
  });
});

async function addMessage(text, sender, userId, sessionId) {
  await wixData.insert("Messages", {
    userId: userId,
    sessionId: sessionId,
    text: text,
    sender: sender,
    timestamp: new Date()
  });

  await loadMessages(sessionId); // recargar mensajes tras agregar uno
}

async function loadMessages(sessionId) {
  const user = wixUsers.currentUser;
  const userId = user.loggedIn ? user.id : null;

  let query = wixData.query("Messages").ascending("timestamp");

  if (userId) {
    query = query.eq("userId", userId);
  } else {
    query = query.eq("sessionId", sessionId);
  }

  try {
    const res = await query.find();

    const mensajes = res.items.map((item) => ({
      _id: item._id,
      text: item.text,
      sender: item.sender,
    }));

    $w("#chatRepeater").data = mensajes;

    // // Esperar un pequeño retraso para asegurar que el DOM se actualizó
    // // Hacer scroll al final visual
    // setTimeout(() => {
    //   $w("#bottomAnchor").scrollTo();
    // }, 200);

  } catch (err) {
    console.error("Error al cargar mensajes:", err);
  }
}
