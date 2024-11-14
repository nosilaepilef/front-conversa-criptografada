const ws = new WebSocket('ws://192.168.31.81:8080');

ws.onopen = () => {
  console.log("Conectado ao servidor WebSocket");
};

ws.onmessage = (event) => {
  console.log("Mensagem recebida:", event.data); // Log para debugging
  const chat = document.getElementById('chat');
  const newMessage = document.createElement('p');

  // Verifique se a mensagem é um Blob
  if (event.data instanceof Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      const decryptedMessage = b64ToUtf8(reader.result); // Decifra a mensagem recebida
      newMessage.textContent = `Mensagem criptografada: ${reader.result} | Mensagem original: ${decryptedMessage}`;
      chat.appendChild(newMessage);
    };
    reader.readAsText(event.data); // Lê o Blob como texto
  } else {
    // Se for uma string
    try {
      const decryptedMessage = b64ToUtf8(event.data); // Decifra a mensagem recebida
      newMessage.textContent = `Mensagem criptografada: ${event.data} | Mensagem original: ${decryptedMessage}`;
    } catch (error) {
      newMessage.textContent = `Erro ao decifrar a mensagem: ${event.data}`;
    }

    chat.appendChild(newMessage);
  }
};

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();

  if (message) {
    const encryptedMessage = utf8ToB64(message); // Criptografa a mensagem
    ws.send(encryptedMessage); // Envia a mensagem criptografada
    input.value = ''; // Limpa o campo de entrada
  } else {
    alert("Por favor, digite uma mensagem!");
  }
}

function utf8ToB64(str) {
  return window.btoa(unescape(encodeURIComponent(str))); // Codifica a mensagem em Base64
}

function b64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str))); // Decodifica a mensagem de Base64
}
