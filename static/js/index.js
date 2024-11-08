function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Impede o comportamento padrão de enviar um formulário
        sendMessage(); // Chama a função para enviar a mensagem
    }
}

// Função que envia a mensagem do usuário
async function sendMessage() {
    const userInput = document.getElementById('userInput'); // Pega o campo de input
    const chatWindow = document.getElementById('chatWindow'); // Pega a janela de chat
    const messageText = userInput.value.trim(); // Obtém o texto da mensagem e remove espaços extras

    if (messageText) { // Se houver algum texto no input
        const userMessage = document.createElement('div'); // Cria a mensagem do usuário
        userMessage.className = 'message user'; // Classe para a mensagem do usuário
        userMessage.innerHTML = `<span>${messageText}</span>`; // Insere o texto da mensagem
        chatWindow.appendChild(userMessage); // Adiciona a mensagem à janela de chat

        userInput.value = ''; // Limpa o campo de input

        // Mensagem de "Carregando..." enquanto o bot está pensando
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'message bot loading';
        loadingMessage.innerHTML = `<span>Carregando...</span>`;
        chatWindow.appendChild(loadingMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Rola a janela para o final

        // Chama a função para buscar a resposta do bot
        const botResponse = await fetchBotResponse(messageText);

        chatWindow.removeChild(loadingMessage); // Remove a mensagem de "Carregando..."

        // Cria a mensagem do bot com a resposta recebida
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.innerHTML = `<span>${botResponse}</span>`;
        chatWindow.appendChild(botMessage); // Adiciona a resposta do bot ao chat

        chatWindow.scrollTop = chatWindow.scrollHeight; // Rola a janela para o final
    }
}

// Função que faz a requisição ao backend para obter a resposta do bot
async function fetchBotResponse(messageText) {
    try {
        const response = await fetch(`${window.location.href}search?prompt=${messageText}`);
        const data = await response.json();
        return data.message; // Retorna a resposta do bot
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return 'Desculpe, não consegui buscar uma resposta agora.'; // Em caso de erro, retorna uma mensagem padrão
    }
}
