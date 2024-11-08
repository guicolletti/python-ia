async function fetchBotResponse(messageText) {
    try {
        const response = await fetch(`${window.location.href}search?prompt=${messageText}`);
        const data = await response.json();
        
        if (data.video) {
            return { text: data.message, video: data.video };
        } else {
            return { text: data.message };
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return { text: 'Desculpe, não consegui buscar uma resposta agora.' };
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const messageText = userInput.value.trim();

    if (messageText) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<span>${messageText}</span>`;
        chatWindow.appendChild(userMessage);

        userInput.value = '';

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot loading';
        loadingMessage.innerHTML = `<span>Carregando...</span>`;
        chatWindow.appendChild(loadingMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        const botResponse = await fetchBotResponse(messageText);

        chatWindow.removeChild(loadingMessage);

        // Se a resposta incluir um vídeo
        if (botResponse.video) {
            const botVideo = document.createElement('div');
            botVideo.className = 'message bot';
            botVideo.innerHTML = `<span>${botResponse.text}</span><br>${botResponse.video}`;
            chatWindow.appendChild(botVideo);
        } else {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `<span>${botResponse.text}</span>`;
            chatWindow.appendChild(botMessage);
        }

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}
