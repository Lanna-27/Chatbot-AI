// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const prompt = req.body.prompt;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "NodeChatTest"
    },
    body: JSON.stringify({
      model: "openai/chatgpt-4o-latest",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000
    })
  });

  const json = await response.json();
  console.log("Respuesta del modelo:", json);
  const reply = json.choices?.[0]?.message?.content || "Error al obtener respuesta.";
  res.json({ reply });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
