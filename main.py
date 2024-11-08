from flask import Flask, render_template, request
from dotenv import load_dotenv
from googleapiclient.discovery import build
import os
import re

load_dotenv()

app = Flask(__name__)

# Configuração da API do YouTube
youtube_api_key = os.getenv('YOUTUBE_API_KEY')  # Você precisa adicionar sua chave de API do YouTube no arquivo .env
youtube = build('youtube', 'v3', developerKey=youtube_api_key)

# Rota para renderizar a página principal com o chatbot
@app.route('/')
def index():
    return render_template('index.html')

# Rota para buscar resposta e vídeos do chatbot
@app.route('/search')
def search():
    # Pega o prompt (mensagem do usuário)
    prompt = request.args.get('prompt')

    # Buscar vídeo relacionado ao conteúdo do prompt
    video_response = search_youtube_video(prompt)

    # Aqui você pode adicionar o seu modelo de IA para gerar a resposta (mesmo código que já possui)
    # Para simplificar, estou omitindo a lógica de geração de conteúdo da IA.
    message_response = f"Estou procurando um vídeo relacionado ao tema: {prompt}"

    return {'message': message_response, 'video': video_response}

def search_youtube_video(query):
    """Busca um vídeo no YouTube baseado na query"""
    try:
        # Faz a busca no YouTube
        request = youtube.search().list(
            part='snippet',
            q=query,
            type='video',
            maxResults=1  # Limita a busca a 1 vídeo
        )
        response = request.execute()

        # Pega o ID do vídeo encontrado
        video_id = response['items'][0]['id']['videoId']
        video_url = f"https://www.youtube.com/embed/{video_id}"

        # Retorna o código embed para o vídeo
        return f"<iframe width='560' height='315' src='{video_url}' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"

    except Exception as e:
        print(f"Erro ao buscar vídeo: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True)
