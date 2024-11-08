from flask import Flask, render_template, request
from dotenv import load_dotenv
from google import generativeai as genai
import os
import re

load_dotenv()

app = Flask(__name__)


@app.route('/search')
def search():
    model = genai.GenerativeModel('gemini-1.0-pro-latest')
    genai.configure(api_key=os.getenv('API'))
    
    # Contexto da IA
    context = ('Você é um chat destinado a responder, guiar e ensinar jovens aprendizes a como utilizar os mais diversos automóveis do agro, como uma colheitadeira, etc. Seu nome é CNHbot.')
    
    # Pega o prompt (mensagem do usuário)
    prompt = request.args.get('prompt')
    
    # Expressão regular para detectar URL do YouTube e pegar o video_id
    youtube_url_pattern = r'(https?://www\.youtube\.com/watch\?v=([a-zA-Z0-9_-]+))'
    
    # Verificar se o prompt contém um link do YouTube
    match = re.search(youtube_url_pattern, prompt)
    if match:
        video_id = match.group(2)  # O video_id está no segundo grupo da expressão regular
        video_response = f"<iframe width='560' height='315' src='https://www.youtube.com/embed/{video_id}' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
    else:
        video_response = None
    
    # Gerar resposta com a IA
    input_ia = f'{context}: {prompt}'
    output = model.generate_content(input_ia)
    
    return {'message': output.text, 'video': video_response}

if __name__ == '__main__':
    app.run(debug=True)
