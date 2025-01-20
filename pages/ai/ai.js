const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

const aiInfo = document.getElementById('ai-info');
aiInfo.innerHTML = `
    <p>Привет! Я твой персональный ИИ-помощник для обучения. Спроси меня о чем угодно.</p>
    <p>Я работаю на основе модели Gemini.</p>
`;

function addMessage(message, isUser = true, isError = false, originalMessage = null) {
    const messageDiv = document.createElement('div');
    
    if (originalMessage) {
        const originalMessageDiv = document.createElement('div');
        originalMessageDiv.textContent = originalMessage;
          originalMessageDiv.classList.add('chat-message');
           originalMessageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        messageDiv.appendChild(originalMessageDiv);
    }
    
    const textDiv = document.createElement('div');
    textDiv.innerHTML = marked.parse(message);
    
    messageDiv.appendChild(textDiv);
    
    if (isError) {
        const repeatButton = document.createElement("button");
        repeatButton.innerText = "Повторить";
        repeatButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'mt-2');
        repeatButton.addEventListener('click', () => {
          sendRequestToBackend(originalMessage);
        });
         messageDiv.appendChild(repeatButton);
    }

    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = "";
        sendRequestToBackend(message);
    }
});

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

function sendRequestToBackend(message) {
  fetch('https://mgfood.pythonanywhere.com/api/ai_chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: message }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
       return response.json()
    })
     .then((data) => {
        addMessage(data.response, false);
        })
         .catch(error => {
            console.error("Fetch error:", error);
              if (error.message === 'Failed to fetch'){
                addMessage('Проблема с сетью. Попробуйте позже.', false, true, message);
              } else if(error.message.startsWith('HTTP error')){
                addMessage('Проблема с сервером. Попробуй обновить страницу или подожди немного, прежде чем снова отправить запрос.', false, true, message);
              } else {
                 addMessage('Извини, не удалось получить ответ от сервера', false, true, message);
              }
        });
}