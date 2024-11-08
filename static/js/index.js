function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão de enviar um formulário
        sendMessage(); // Chama a função para enviar a mensagem
    }
}

// Função que envia a mensagem do usuário
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const messageText = userInput.value.trim();

    if (messageText) {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<span>${messageText}</span>`;
        chatWindow.appendChild(userMessage);

        userInput.value = ''; // Limpar o campo de entrada

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot loading';
        loadingMessage.innerHTML = `<span>Carregando...</span>`;
        chatWindow.appendChild(loadingMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Obter a resposta do bot
        const botResponse = await fetchBotResponse(messageText);

        chatWindow.removeChild(loadingMessage); // Remover a mensagem de carregamento

        // Se a resposta incluir um vídeo
        if (botResponse.video) {
            const botVideoMessage = document.createElement('div');
            botVideoMessage.className = 'message bot';
            botVideoMessage.innerHTML = `<span>${botResponse.text}</span><br>${botResponse.video}`;
            chatWindow.appendChild(botVideoMessage);
        } else {
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `<span>${botResponse.text}</span>`;
            chatWindow.appendChild(botMessage);
        }

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

// Função que faz a requisição ao backend para obter a resposta do bot
async function fetchBotResponse(messageText) {
    try {
        const response = await fetch(`${window.location.href}search?prompt=${messageText}`);
        const data = await response.json();
        
        // Verificar se a resposta inclui um vídeo
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
