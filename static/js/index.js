function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão de enviar um formulário
        sendMessage(); // Chama a função para enviar a mensagem
    }
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const messageText = userInput.value.trim();

    if (messageText) {
        // Enviar a mensagem do usuário
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<span>${messageText}</span>`;
        chatWindow.appendChild(userMessage);

        userInput.value = ''; // Limpar o campo de entrada

        // Mostrar uma mensagem de "carregando..." enquanto o bot processa a resposta
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot loading';
        loadingMessage.innerHTML = `<span>Carregando...</span>`;
        chatWindow.appendChild(loadingMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Obter a resposta do bot
        const botResponse = await fetchBotResponse(messageText);

        chatWindow.removeChild(loadingMessage); // Remover a mensagem de carregamento

        // Exibir a resposta do bot
        if (botResponse.video) {
            // Se o bot respondeu com um vídeo
            const botVideoMessage = document.createElement('div');
            botVideoMessage.className = 'message bot';
            botVideoMessage.innerHTML = `<span>${botResponse.text}</span><br>${botResponse.video}`;
            chatWindow.appendChild(botVideoMessage);
        } else {
            // Caso contrário, exibir apenas o texto
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `<span>${botResponse.text}</span>`;
            chatWindow.appendChild(botMessage);
        }

        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll para a parte mais recente da conversa
    }
}

async function fetchBotResponse(messageText) {
    try {
        // Enviar o prompt para o backend (Flask) para obter a resposta do bot
        const response = await fetch(`${window.location.href}search?prompt=${messageText}`);
        const data = await response.json();

        // Retornar a resposta do bot com o texto e o vídeo (se existir)
        return {
            text: data.message,   // Mensagem do bot
            video: data.video     // Vídeo (pode ser null se não houver vídeo)
        };
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return { text: 'Desculpe, não consegui buscar uma resposta agora.' };
    }
}
